import { Treatment } from '../models';
import { createCrudService } from './crud.factory';
import { httpRequest } from './httpClient';
import { mediasResourceName } from './medias.service';

export const treatmentsResourceName = 'treatments';

const service = createCrudService(treatmentsResourceName, Treatment.mapper);

const getLastByMediaId = (mediaId) =>
    httpRequest(`${mediasResourceName}/${mediaId}/last_treatment`)
        .then(Treatment.mapper);

export const treatmentsService = {
    ...service,
    getLastByMediaId,
};
