import { useQueries, useQuery } from '@tanstack/react-query';

import { treatmentsQueryKeys } from '../constants';
import { treatmentsService } from '../services';
import { createCrudQueries } from './crud.factory';

const service = treatmentsService;

const queries = createCrudQueries(service, treatmentsQueryKeys);

const getMediaTreatmentsQueryOptions = (mediaId) => ({
    enabled: Number.isInteger(mediaId),
    queryFn: () => service.getAll(new URLSearchParams({ media_id: mediaId })),
    queryKey: treatmentsQueryKeys.byMedia(mediaId),
});

const useGetAllByMediaId = (mediaId) => useQuery(
    getMediaTreatmentsQueryOptions(mediaId),
);

const useGetAllByMediaIds = (mediaIds) => useQueries({
    queries: mediaIds.map(getMediaTreatmentsQueryOptions),
});

export const treatmentsQueries = {
    ...queries,
    useGetAllByMediaId,
    useGetAllByMediaIds,
};
