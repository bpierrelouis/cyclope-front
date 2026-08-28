import { Result } from '../models';
import { createCrudService } from './crud.factory';

export const resultsResourceName = 'results';

const service = createCrudService(resultsResourceName, Result.mapper);

export const resultsService = service;
