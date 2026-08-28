import { Result } from '../models';
import { parseEvent } from '../utils';
import { resultsResourceName } from './results.service';
import { treatmentsResourceName } from './treatments.service';

export const resultsStream = {
    connect(treatmentId, add) {
        if (!Number.isInteger(treatmentId)) return () => {};

        const endpoint = `/api/${treatmentsResourceName}/${treatmentId}/${resultsResourceName}/stream`;
        const eventSource = new EventSource(endpoint);

        eventSource.addEventListener(
            'treatment_result',
            (event) => add(Result.mapper(parseEvent(event))),
        );

        return () => eventSource.close();
    },
};
