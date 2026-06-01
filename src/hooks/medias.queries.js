import { useQuery } from '@tanstack/react-query';
import { mediasResourceName, mediasService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = mediasResourceName;
const service = mediasService;

const queries = createCrudQueries(resource, service);

const useGetAllByMissionId = (missionId) => useQuery({
    queryKey: [resource, 'mission', missionId],
    queryFn: () => service.getAll(new URLSearchParams({ missionId })),
    enabled: !!missionId,
});

export const mediasQueries = {
    ...queries,
    useGetAllByMissionId,
};
