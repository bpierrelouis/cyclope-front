import { useMemo } from 'react';

import { createMissionViewerSource } from '../models';
import { getLatestCompletedTreatment } from '../utils';
import { resultsQueries } from './results.queries';
import { treatmentsQueries } from './treatments.queries';
import { useDiscoverDetections } from './useDiscoverDetections';
import { useResultsStreams } from './useResultsStreams';

export function useMissionViewerSource({
    enabled, medias, mission,
}) {
    const videos = useMemo(
        () => enabled
            ? medias?.filter((media) => media.isVideo) ?? []
            : [],
        [enabled, medias],
    );
    const treatmentQueries = treatmentsQueries.useGetAllByMediaIds(
        videos.map((media) => media.id),
    );
    const treatments = treatmentQueries.map(({ data }) =>
        getLatestCompletedTreatment(data));
    const treatmentIds = treatments.map((treatment) => treatment?.id);
    const resultQueries = resultsQueries.useGetAllByTreatmentIds(
        treatmentIds,
    );
    const results = resultQueries.flatMap(({ data }) => data ?? []);

    useResultsStreams(treatmentIds);
    useDiscoverDetections(results);
    const items = videos.map((media, index) => {
        const treatmentQuery = treatmentQueries[index];
        const resultQuery = resultQueries[index];

        return {
            error: treatmentQuery?.error ?? resultQuery?.error,
            media,
            results: resultQuery?.data ?? [],
            treatment: treatments[index],
        };
    });
    return createMissionViewerSource({ items, mission });
}
