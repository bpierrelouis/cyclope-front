import { createCrudService } from './crud.factory';
import { httpRequest } from './httpClient';

export const filesResourceName = 'files';

const service = createCrudService(filesResourceName);

const getContent = (url) =>
    httpRequest(`${filesResourceName}/download?url=${encodeURIComponent(url)}`)
        .then((result) => result.downloadUrl);

const getTree = () =>
    httpRequest(`${filesResourceName}/tree`);

export const filesService = {
    ...service,
    getContent,
    getTree,
};
