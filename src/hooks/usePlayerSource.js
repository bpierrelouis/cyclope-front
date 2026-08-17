import { useEffect } from 'react';

import { useSelectionContext } from '../contexts';
import { playerService } from '../services';

/** Projects a viewer source into the state shared by all presentation views. */
export function usePlayerSource() {
    const {
        activeItem, isMission, mission, source,
    } = useSelectionContext();
    const treatmentId = activeItem?.treatment?.id;
    const mediaId = treatmentId ? null : activeItem?.media.id;
    const missionId = isMission ? mission?.id ?? null : null;
    const hasActiveItem = Boolean(activeItem);
    const segmentOffset = activeItem?.offset ?? 0;

    useEffect(() => {
        playerService.setLocalState({ isMaster: true });
        playerService.announceMaster();
    }, []);

    useEffect(() => {
        if (!source.id) return;

        playerService.sync({
            currentTime: 0,
            missionId,
            playing: false,
        });
    }, [missionId, source.id]);

    useEffect(() => {
        if (!source.id) return;
        playerService.sync({ duration: source.duration });
    }, [source.duration, source.id]);

    useEffect(() => {
        if (!hasActiveItem || !source.id) return;
        playerService.sync({ mediaId, segmentOffset, treatmentId });
    }, [hasActiveItem, mediaId, segmentOffset, source.id, treatmentId]);

}
