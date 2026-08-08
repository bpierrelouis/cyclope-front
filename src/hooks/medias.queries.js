import { useQuery } from '@tanstack/react-query';

import { mediasResourceName, mediasService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = mediasResourceName;
const service = mediasService;

const queries = createCrudQueries(resource, service);

const useGetAllByMissionId = (missionId) => useQuery({
    enabled: !!missionId,
    queryFn: () => service.getAll(new URLSearchParams({ mission_id: missionId })),
    queryKey: [resource, 'mission', missionId],
});

export const mediasQueries = {
    ...queries,
    useGetAllByMissionId,
};
