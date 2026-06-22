import { treatmentsResourceName, treatmentsService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = treatmentsResourceName;
const service = treatmentsService;

const queries = createCrudQueries(resource, service);

export const treatmentsQueries = queries;
