import { useQuery } from '@tanstack/react-query';
import { missionsResourceName, missionsService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = missionsResourceName;
const service = missionsService;

const queries = createCrudQueries(resource, service);

const useGetAllMediasByMissionId = (id) => useQuery({
    queryKey: [resource, id, 'medias'],
    queryFn: () => service.getAllMediasByMissionId(id),
    enabled: !!id,
});

export const missionsQueries = {
    ...queries,
    useGetAllMediasByMissionId,
};
