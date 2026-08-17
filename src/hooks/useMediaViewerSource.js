import { useMemo } from 'react';

import { createMediaViewerSource } from '../models';
import { useTreatmentResults } from './useTreatmentResults';

export function useMediaViewerSource({
    enabled, media, mission, treatment,
}) {
    const { data: results, error } = useTreatmentResults(
        enabled ? treatment?.id : undefined,
    );

    return useMemo(() => createMediaViewerSource({
        error,
        media,
        mission,
        results,
        treatment,
    }), [error, media, mission, results, treatment]);
}
