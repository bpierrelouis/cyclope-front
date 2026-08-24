import { ACCEPTED_XYZ_EXTENSIONS } from '../constants';
import {
    computeChecksum,
    computeXyzChecksum,
    getExtension,
    getRelativeFilePath,
    getRootFolderName,
    getVideoDuration,
    isAcceptedFileExtension,
    isFilesInXyzFolder,
    isVideoExtension,
    joinPath,
    openErrorToast,
    openSuccessToast,
} from '../utils';
import { createCrudService } from './crud.factory';
import { httpRequest } from './httpClient';

export const filesResourceName = 'files';

const service = createCrudService(filesResourceName);

const getContent = (url) =>
    httpRequest(`${filesResourceName}/download?url=${encodeURIComponent(url)}`)
        .then((result) => result.downloadUrl);

const getRedirectUrl = (url) =>
    `/api/${filesResourceName}/redirect?url=${encodeURIComponent(url)}`;

const getTree = (folder) =>
    httpRequest(`${filesResourceName}/tree?folder=${encodeURIComponent(folder)}`);

const getUploadPath = (url) =>
    httpRequest(`${filesResourceName}/upload?url=${encodeURIComponent(url)}`);

const checkFileExists = (name, checksum) =>
    httpRequest(`${filesResourceName}/exists?name=${encodeURIComponent(name)}&checksum=${checksum}`)
        .then(({ exists }) => {
            if (exists) {
                throw new Error(`"${name}" est déjà présent sur le serveur.`);
            }
        });

const uploadFile = (url, file) =>
    fetch(url, {
        body: file,
        headers: { 'Content-Type': file.type },
        method: 'PUT',
    });

const saveFile = async ({
    acceptedExtensions, checkDuplicate, file, folder,
}) => {
    const { name, size } = file;
    const targetPath = joinPath(folder, getRelativeFilePath(file));
    const extension = getExtension(name);

    if (!isAcceptedFileExtension(acceptedExtensions, extension)) {
        throw new Error(`"${name}" refusé. Formats autorisés : ${acceptedExtensions.join(', ')}.`);
    }

    const checksum = await computeChecksum(file);
    if (checkDuplicate) {
        await checkFileExists(name, checksum);
    }

    const isVideo = isVideoExtension(extension);
    const duration = isVideo ? await getVideoDuration(file) : null;

    const { uploadUrl, url } = await getUploadPath(targetPath);
    const { ok, status } = await uploadFile(uploadUrl, file);

    if (!ok) {
        throw new Error(`"${name}" : Upload S3 refusé (${status})`);
    }

    return {
        checksum,
        duration,
        extension,
        name,
        size,
        url,
    };
};

const settleWithConcurrency = async (items, worker, concurrency = 6) => {
    const results = new Array(items.length);
    let nextIndex = 0;

    const run = async () => {
        while (nextIndex < items.length) {
            const index = nextIndex++;
            try {
                results[index] = { status: 'fulfilled', value: await worker(items[index]) };
            } catch (reason) {
                results[index] = { reason, status: 'rejected' };
            }
        }
    };

    const workerCount = Math.min(concurrency, items.length);
    await Promise.all(Array.from({ length: workerCount }, run));
    return results;
};

const notifyRejectedUploads = (results) => {
    results
        .filter((result) => result.status === 'rejected')
        .forEach((result) => {
            openErrorToast(
                result.reason instanceof Error
                    ? result.reason.message
                    : 'Une erreur est survenue.',
            );
        });
};

const saveXyzFolder = async ({ files, folder }) => {
    const name = getRootFolderName(files);
    const results = await settleWithConcurrency(
        files,
        (file) => saveFile({
            acceptedExtensions: ACCEPTED_XYZ_EXTENSIONS,
            checkDuplicate: false,
            file,
            folder,
        }),
    );

    const xyzChecksum = await computeXyzChecksum(results);

    await checkFileExists(name, xyzChecksum);

    notifyRejectedUploads(results);
    if (results.some((result) => result.status === 'rejected')) return [];

    const carto = await service.create({
        checksum: xyzChecksum,
        duration: null,
        extension: 'xyz',
        name,
        size: 0,
        url: joinPath(folder, name),
    });
    openSuccessToast(`Fond de carte « ${name} » importé.`);
    return [carto];
};

const saveFiles = async ({
    acceptedExtensions, allowXyzFolder, files, folder,
}) => {
    const hasDirectory = files.some((file) => getRelativeFilePath(file).includes('/'));
    const isXyzFolder = allowXyzFolder && isFilesInXyzFolder(files);

    if (allowXyzFolder && hasDirectory && !isXyzFolder) {
        openErrorToast('Dossier refusé. Une carte XYZ doit suivre la structure nom/z/x/y.png.');
        return [];
    }

    if (isXyzFolder) return saveXyzFolder({ files, folder });

    const results = await settleWithConcurrency(
        files,
        (file) => saveFile({
            acceptedExtensions,
            checkDuplicate: true,
            file,
            folder,
        }).then(service.create),
    );

    notifyRejectedUploads(results);

    const succeeded = results.filter((result) => result.status === 'fulfilled');
    const uploadedCount = succeeded.length;

    if (uploadedCount > 0) {
        openSuccessToast(
            `${uploadedCount} fichier${uploadedCount > 1 ? 's' : ''} uploadé${uploadedCount > 1 ? 's' : ''}.`,
        );
    }

    return succeeded.map((result) => result.value);
};

const removeMany = async (files) => {
    const results = await Promise.allSettled(
        files.map((file) => service.remove(file.id)),
    );

    const deleted = files.filter((file, index) => results[index].status === 'fulfilled');
    const failed = files.filter((file, index) => results[index].status === 'rejected');

    return { deleted, failed };
};

export const filesService = {
    ...service,
    getContent,
    getRedirectUrl,
    getTree,
    removeMany,
    saveFiles,
};
