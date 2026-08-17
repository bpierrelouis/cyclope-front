import { useShallow } from 'zustand/react/shallow';

import { createViewerItem, getLocalTimelinePosition } from '../models';
import { usePlayerStore } from '../stores';
import { mediasQueries } from './medias.queries';
import { resultsQueries } from './results.queries';
import { treatmentsQueries } from './treatments.queries';

export function useActiveViewerItem(source) {
    const sourceItem = usePlayerStore((state) =>
        getLocalTimelinePosition(source, state.currentTime)?.item ?? null);
    const {
        mediaId,
        segmentOffset,
        treatmentId,
    } = usePlayerStore(useShallow((state) => ({
        mediaId: state.mediaId,
        segmentOffset: state.segmentOffset,
        treatmentId: state.treatmentId,
    })));
    const { data: treatment } = treatmentsQueries.useGetById(treatmentId);
    const { data: media } = mediasQueries.useGetById(
        treatment?.mediaId ?? mediaId,
    );
    const { data: results = [] } = resultsQueries.useGetAllByTreatmentId(
        treatmentId,
    );
    const synchronizedItem = media
        ? createViewerItem({
            media,
            offset: segmentOffset,
            results,
            treatment,
        })
        : null;

    return sourceItem ?? synchronizedItem;
}
