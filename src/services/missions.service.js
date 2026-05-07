import { createCrudService } from './crud.factory';
import { httpRequest } from './httpClient';

export const missionsResourceName = 'missions';

const service = createCrudService(missionsResourceName);

const getAllMediasByMissionId = (id) => httpRequest(`${missionsResourceName}/${id}/medias`);

export const missionsService = {
    ...service,
    getAllMediasByMissionId,
};
