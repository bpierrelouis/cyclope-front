import { Media } from '../models';
import { createCrudService } from './crud.factory';

export const mediasResourceName = 'medias';

const service = createCrudService(mediasResourceName, Media.mapper);

export const mediasService = service;
