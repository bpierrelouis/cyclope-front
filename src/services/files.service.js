import { httpRequest } from './httpClient';

export const filesResourceName = 'files';

const get = (url) =>
    httpRequest(`${filesResourceName}/download?url=${encodeURIComponent(url)}`);

export const filesService = {
    get,
};
