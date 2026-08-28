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

const settleWithConcurrency = async (items, worker, concurrency = 6, onProgress) => {
    const results = new Array(items.length);
    let nextIndex = 0;
    let settledCount = 0;

    const run = async () => {
        while (nextIndex < items.length) {
            const index = nextIndex++;
            try {
                results[index] = { status: 'fulfilled', value: await worker(items[index]) };
            } catch (reason) {
                results[index] = { reason, status: 'rejected' };
            } finally {
                settledCount += 1;
                onProgress?.(settledCount, items.length, results[index]);
            }
        }
    };

    const workerCount = Math.min(concurrency, items.length);
    await Promise.all(Array.from({ length: workerCount }, run));
    return results;
};

const notifyRejectedUpload = (result) => {
    if (result.status !== 'rejected') return;

    openErrorToast(
        result.reason instanceof Error
            ? result.reason.message
            : 'Une erreur est survenue.',
    );
};

const saveXyzFolder = async ({ files, folder, onProgress }) => {
    const name = getRootFolderName(files);
    const results = await settleWithConcurrency(
        files,
        (file) => saveFile({
            acceptedExtensions: ACCEPTED_XYZ_EXTENSIONS,
            checkDuplicate: false,
            file,
            folder,
        }),
        6,
        (completed, total, result) => {
            notifyRejectedUpload(result);
            onProgress?.(completed, total, result);
        },
    );

    const xyzChecksum = await computeXyzChecksum(results);

    await checkFileExists(name, xyzChecksum);

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
    acceptedExtensions, allowXyzFolder, files, folder, onProgress,
}) => {
    const hasDirectory = files.some((file) => getRelativeFilePath(file).includes('/'));
    const isXyzFolder = allowXyzFolder && isFilesInXyzFolder(files);

    if (allowXyzFolder && hasDirectory && !isXyzFolder) {
        openErrorToast('Dossier refusé. Une carte XYZ doit suivre la structure nom/z/x/y.png.');
        return [];
    }

    if (isXyzFolder) return saveXyzFolder({ files, folder, onProgress });

    const results = await settleWithConcurrency(
        files,
        (file) => saveFile({
            acceptedExtensions,
            checkDuplicate: true,
            file,
            folder,
        }).then(service.create),
        6,
        (completed, total, result) => {
            if (result.status === 'fulfilled') {
                openSuccessToast(`Fichier « ${result.value.name} » importé.`);
            } else {
                notifyRejectedUpload(result);
            }
            onProgress?.(completed, total, result);
        },
    );

    const succeeded = results.filter((result) => result.status === 'fulfilled');

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
