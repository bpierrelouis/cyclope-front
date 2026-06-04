import { resultsResourceName, resultsService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = resultsResourceName;
const service = resultsService;

const queries = createCrudQueries(resource, service);

const useGetAllByTreatmentId = (treatmentId) =>
    queries.useGetAll(new URLSearchParams({ treatment_id: treatmentId }));

export const resultsQueries = {
    ...queries,
    useGetAllByTreatmentId,
};
