import { ACCEPTED_FILES_EXTENSIONS, getExtension, getVideoDuration, isAcceptedFileExtension, isVideoExtension, joinPath, openErrorToast, openSuccessToast } from '../utils';
import { createCrudService } from './crud.factory';
import { httpRequest } from './httpClient';

export const filesResourceName = 'files';

const service = createCrudService(filesResourceName);

const getContent = (url) =>
    httpRequest(`${filesResourceName}/download?url=${encodeURIComponent(url)}`)
        .then((result) => result.downloadUrl);

const getTree = () =>
    httpRequest(`${filesResourceName}/tree`);

const getUploadPath = (url) => {
    const fullPath = `${filesResourceName}/${url}`;
    return httpRequest(`${filesResourceName}/upload?url=${encodeURIComponent(fullPath)}`);
};

const uploadFile = async (url, file) =>
    await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });

const saveFile = async (file, folder) => {
    const { name, size } = file;
    const targetPath = joinPath(folder, name);
    const extension = getExtension(name);
    const isVideo = isVideoExtension(extension);
    const duration = isVideo ? await getVideoDuration(file) : null;

    if (!isAcceptedFileExtension(extension)) {
        throw new Error(`"${name}" refusé. Formats autorisés : ${ACCEPTED_FILES_EXTENSIONS.join(', ')}.`);
    }

    const { uploadUrl, url } = await getUploadPath(targetPath);
    const { ok, status } = await uploadFile(uploadUrl, file);

    if (!ok) {
        throw new Error(`"${name}" : Upload S3 refusé (${status})`);
    }

    return service.create({
        name,
        url,
        size,
        extension,
        duration,
    });
};

const saveFiles = async ({ files, folder }) => {
    const results = await Promise.allSettled(
        files.map(file => saveFile(file, folder)),
    );

    results
        .filter((result) => result.status === 'rejected')
        .forEach(result => {
            openErrorToast(
                result.reason instanceof Error
                    ? result.reason.message
                    : 'Une erreur est survenue.',
            );
        });

    const succeeded = results.filter(result => result.status === 'fulfilled');
    const uploadedCount = succeeded.length;

    if (uploadedCount > 0) {
        openSuccessToast(
            `${uploadedCount} fichier${uploadedCount > 1 ? 's' : ''} uploadé${uploadedCount > 1 ? 's' : ''}.`,
        );
    }

    return succeeded.map((result) => result.value);
};

export const filesService = {
    ...service,
    getContent,
    getTree,
    saveFiles,
};
