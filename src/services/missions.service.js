import { Mission } from '../models';
import { createCrudService } from './crud.factory';
import { httpRequest } from './httpClient';
import { mediasResourceName } from './medias.service';

export const missionsResourceName = 'missions';

const service = createCrudService(missionsResourceName, Mission.mapper);

const addMedias = (id, medias) =>
    httpRequest(`${missionsResourceName}/${id}/${mediasResourceName}`, {
        body: { medias },
        method: 'POST',
    })
        .then(Mission.mapper);


export const missionsService = {
    ...service,
    addMedias,
};
