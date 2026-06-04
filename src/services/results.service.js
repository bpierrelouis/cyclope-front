import { Result } from '../models';
import { createCrudService } from './crud.factory.js';

export const resultsResourceName = 'results';

const service = createCrudService(resultsResourceName, Result.mapper);

export const resultsService = service;
