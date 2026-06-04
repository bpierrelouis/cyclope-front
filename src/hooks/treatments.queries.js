import { useQuery } from '@tanstack/react-query';
import { treatmentsResourceName, treatmentsService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = treatmentsResourceName;
const service = treatmentsService;

const queries = createCrudQueries(resource, service);

const useGetLastByMediaId = (mediaId) => useQuery({
    queryKey: [resource, 'media', mediaId],
    queryFn: () => service.getLastByMediaId(mediaId),
    enabled: !!mediaId,
});

export const treatmentsQueries = {
    ...queries,
    useGetLastByMediaId,
};
