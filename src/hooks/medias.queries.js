import { mediasResourceName, mediasService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = mediasResourceName;
const service = mediasService;

const queries = createCrudQueries(resource, service);

export const mediasQueries = queries;
