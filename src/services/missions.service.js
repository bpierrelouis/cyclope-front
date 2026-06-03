import { createCrudService } from './crud.factory';
import { httpRequest } from './httpClient';

export const missionsResourceName = 'missions';

const service = createCrudService(missionsResourceName);

const create = (payload) => httpRequest('new', {
    method: 'POST',
    body: JSON.stringify(payload),
});

export const missionsService = {
    ...service,
    create,
};
