import { useMemo } from 'react';

import {
    useMediaViewerSource,
    useMissionViewerSource,
    useSelectionData,
} from '../hooks';
import { useActiveViewerItem } from '../hooks/useActiveViewerItem';
import { SelectionContext } from './selectionContext';

export function SelectionProvider({ children }) {
    const selection = useSelectionData();
    const mediaSource = useMediaViewerSource({
        ...selection,
        enabled: !selection.isMission,
    });
    const missionSource = useMissionViewerSource({
        enabled: selection.isMission,
        medias: selection.medias,
        mission: selection.mission,
    });
    const source = selection.isMission ? missionSource : mediaSource;
    const activeItem = useActiveViewerItem(source);

    const value = useMemo(() => ({
        activeItem,
        error: selection.error,
        isLoading: selection.isLoading,
        isMission: selection.isMission,
        media: selection.media,
        medias: selection.medias,
        mission: selection.mission,
        source,
        treatment: selection.treatment,
    }), [
        activeItem,
        selection.error,
        selection.isLoading,
        selection.isMission,
        selection.media,
        selection.medias,
        selection.mission,
        selection.treatment,
        source,
    ]);

    return (
        <SelectionContext.Provider value={value}>
            {children}
        </SelectionContext.Provider>
    );
}
