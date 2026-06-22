import { resultsResourceName, resultsService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = resultsResourceName;
const service = resultsService;

const queries = createCrudQueries(resource, service);

export const resultsQueries = queries;
