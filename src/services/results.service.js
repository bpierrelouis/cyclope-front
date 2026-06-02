import { createCrudService } from './crud.factory.js';

export const resultsResourceName = 'results';

const service = createCrudService(resultsResourceName);

export const resultsService = service;
