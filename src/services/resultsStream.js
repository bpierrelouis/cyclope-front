import { Result } from '../models';
import { parseEvent } from '../utils';
import { resultsResourceName } from './results.service';
import { treatmentsResourceName } from './treatments.service';

class ResultsStream {
    es = null;

    connect(treatmentId, add) {
        if (!Number.isInteger(treatmentId)) return;

        const endpoint = `/api/${treatmentsResourceName}/${treatmentId}/${resultsResourceName}/stream`;

        this.es = new EventSource(endpoint);

        this.es.addEventListener(
            'treatment_result',
            (event) => add(Result.mapper(parseEvent(event))),
        );
    }

    disconnect() {
        this.es?.close();
    }
}

export const resultsStream = new ResultsStream();
