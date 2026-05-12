import { createCrudService } from './crud.factory';

export const mediasResourceName = 'medias';

const service = createCrudService(mediasResourceName);

export const mediasService = service;
