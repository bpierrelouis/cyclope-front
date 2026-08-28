import { resultsQueryKeys } from '../constants';
import { Result } from '../models';
import { mergeResults } from '../utils';

const MESSAGE_TYPES = {
    RESULT_UPSERTED: 'RESULT_UPSERTED',
};

const resultsChannel = new BroadcastChannel('results-cache-channel');

export const resultsSyncService = {
    connect(queryClient) {
        const handleMessage = (event) => {
            if (event.data.type !== MESSAGE_TYPES.RESULT_UPSERTED) return;

            const result = Result.mapper(event.data.payload.result);
            queryClient.setQueryData(
                resultsQueryKeys.byTreatment(result.treatmentId),
                (previous) => mergeResults(previous ?? [], [result]),
            );
        };
        resultsChannel.addEventListener('message', handleMessage);

        return () => resultsChannel.removeEventListener('message', handleMessage);
    },

    publish(result) {
        if (!Number.isInteger(result?.treatmentId)) return;
        resultsChannel.postMessage({
            payload: { result: result.meta },
            type: MESSAGE_TYPES.RESULT_UPSERTED,
        });
    },
};
