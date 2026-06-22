import { Treatment } from '../models';
import { createCrudService } from './crud.factory';

export const treatmentsResourceName = 'treatments';

const service = createCrudService(treatmentsResourceName, Treatment.mapper);

export const treatmentsService = service;
