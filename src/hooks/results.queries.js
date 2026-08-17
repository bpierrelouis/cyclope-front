import {
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { resultsQueryKeys } from '../constants';
import { Result } from '../models';
import { resultsService, resultsSyncService } from '../services';
import { mergeResults } from '../utils';
import { createCrudQueries } from './crud.factory';

const service = resultsService;

const getTreatmentResultsQueryOptions = (
    treatmentId,
    queryClient,
    disabledQueryId,
) => {
    const queryKey = Number.isInteger(treatmentId)
        ? resultsQueryKeys.byTreatment(treatmentId)
        : resultsQueryKeys.disabledTreatment(disabledQueryId);

    return {
        enabled: Number.isInteger(treatmentId),
        queryFn: async () => {
            const snapshot = await service.getAll(
                new URLSearchParams({ treatment_id: treatmentId }),
            );
            const streamed = queryClient.getQueryData(queryKey) ?? [];
            return mergeResults(snapshot, streamed);
        },
        queryKey,
    };
};

const applyPatch = (result, data) => Result.mapper({
    ...result.meta,
    ...data,
    responseJson: data.responseJson
        ? { ...result.data, ...data.responseJson }
        : result.data,
});

const replaceResult = (queryClient, id, replacement) => {
    queryClient.setQueriesData({ queryKey: resultsQueryKeys.all }, (data) => {
        if (Array.isArray(data)) {
            return data.map((result) => result.id === id ? replacement : result);
        }
        return data?.id === id ? replacement : data;
    });
};

const findCachedResult = (queryClient, id) => {
    const entries = queryClient.getQueriesData({ queryKey: resultsQueryKeys.all });
    for (const [, data] of entries) {
        if (Array.isArray(data)) {
            const result = data.find((item) => item.id === id);
            if (result) return result;
        } else if (data?.id === id) {
            return data;
        }
    }
};

const useGetAllByTreatmentId = (treatmentId) => {
    const queryClient = useQueryClient();

    return useQuery(getTreatmentResultsQueryOptions(treatmentId, queryClient));
};

const useGetAllByTreatmentIds = (treatmentIds) => {
    const queryClient = useQueryClient();

    return useQueries({
        queries: treatmentIds.map((treatmentId, index) =>
            getTreatmentResultsQueryOptions(treatmentId, queryClient, index)),
    });
};

const useUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, id }) => service.update({ data, id }),
        onError: (_error, _variables, context) => {
            context?.snapshots.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onMutate: async ({ data, id }) => {
            await queryClient.cancelQueries({ queryKey: resultsQueryKeys.all });
            const snapshots = queryClient.getQueriesData({ queryKey: resultsQueryKeys.all });
            const previous = findCachedResult(queryClient, id);

            if (previous) replaceResult(queryClient, id, applyPatch(previous, data));
            return { snapshots };
        },
        onSuccess: (updated) => {
            replaceResult(queryClient, updated.id, updated);
            resultsSyncService.publish(updated);
        },
    });
};

export const resultsQueries = {
    ...createCrudQueries(service, resultsQueryKeys),
    useGetAllByTreatmentId,
    useGetAllByTreatmentIds,
    useUpdate,
};
