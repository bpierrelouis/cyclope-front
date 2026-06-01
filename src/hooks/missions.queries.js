import { useQuery } from '@tanstack/react-query';
import { missionsResourceName, missionsService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = missionsResourceName;
const service = missionsService;

const queries = createCrudQueries(resource, service);

const getURLSearchParamsForStatus = (status) =>
    status === 'all' ? null : new URLSearchParams({ status });

const useGetAllByStatus = (status) => useQuery({
    queryKey: [resource, status],
    queryFn: () => service.getAll(getURLSearchParamsForStatus(status)),
});

export const missionsQueries = {
    ...queries,
    useGetAllByStatus,
};
