import { useQuery } from '@tanstack/react-query';

import { mediasQueryKeys } from '../constants';
import { mediasService } from '../services';
import { createCrudQueries } from './crud.factory';

const service = mediasService;

const queries = createCrudQueries(service, mediasQueryKeys);

const useGetAllByMissionId = (missionId) => useQuery({
    enabled: !!missionId,
    queryFn: () => service.getAll(new URLSearchParams({ mission_id: missionId })),
    queryKey: mediasQueryKeys.byMission(missionId),
});

export const mediasQueries = {
    ...queries,
    useGetAllByMissionId,
};
