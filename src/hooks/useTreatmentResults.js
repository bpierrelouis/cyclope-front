import { resultsQueries } from './results.queries';
import { useDiscoverDetections } from './useDiscoverDetections';
import { useResultsStreams } from './useResultsStreams';

const EMPTY_RESULTS = [];

export function useTreatmentResults(treatmentId) {
    const query = resultsQueries.useGetAllByTreatmentId(treatmentId);
    const results = query.data ?? EMPTY_RESULTS;

    useResultsStreams([treatmentId]);

    useDiscoverDetections(results);

    return {
        ...query,
        data: results,
    };
}
