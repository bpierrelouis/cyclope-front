import { Mission } from '../models';
import { createCrudService } from './crud.factory';
import { httpRequest } from './httpClient';

export const missionsResourceName = 'missions';

const service = createCrudService(missionsResourceName, Mission.mapper);

const create = (payload) => httpRequest('new', {
    method: 'POST',
    body: payload,
}).then(Mission.mapper);

export const missionsService = {
    ...service,
    create,
};
