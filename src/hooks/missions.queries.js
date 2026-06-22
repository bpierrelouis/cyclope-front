import { useMutation, useQuery } from '@tanstack/react-query';
import { missionsResourceName, missionsService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = missionsResourceName;
const service = missionsService;

const queries = createCrudQueries(resource, service);

const getURLSearchParamsForStatus = (status) =>
    status === 'ALL' ? null : new URLSearchParams({ medias_status: status });

const useGetAllByStatus = (status) => useQuery({
    queryKey: [resource, status],
    queryFn: () => service.getAll(getURLSearchParamsForStatus(status)),
});


const useAddMedias = () => useMutation({
    mutationFn: ({ id, medias }) => service.addMedias(id, medias),
});

export const missionsQueries = {
    ...queries,
    useGetAllByStatus,
    useAddMedias,
};
