import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { resultsQueryKeys } from '../constants';
import { resultsStream, resultsSyncService } from '../services';
import { mergeResults } from '../utils';

const getSubscriptionKey = (treatmentIds) => [...new Set(
    treatmentIds.filter(Number.isInteger),
)]
    .sort((left, right) => left - right)
    .join(',');

/** Maintient un flux SSE indépendant pour chaque traitement consulté. */
export function useResultsStreams(treatmentIds) {
    const queryClient = useQueryClient();
    const subscriptionKey = getSubscriptionKey(treatmentIds);

    useEffect(() => {
        if (!subscriptionKey) return;

        const treatmentIdsToSubscribe = subscriptionKey
            .split(',')
            .map(Number);
        const disconnect = treatmentIdsToSubscribe.map((treatmentId) =>
            resultsStream.connect(treatmentId, (result) => {
                queryClient.setQueryData(
                    resultsQueryKeys.byTreatment(treatmentId),
                    (previous) => mergeResults(previous ?? [], [result]),
                );
                resultsSyncService.publish(result);
            }));

        return () => disconnect.forEach((closeStream) => closeStream());
    }, [queryClient, subscriptionKey]);
}
