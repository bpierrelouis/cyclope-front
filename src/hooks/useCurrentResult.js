import { useSelectionContext } from '../contexts/selectionContext';
import { getCurrentResult } from '../utils';
import { useCurrentTime } from './useCurrentTime';

export function useCurrentResult() {
    const { activeItem } = useSelectionContext();
    const currentTime = useCurrentTime();

    if (!activeItem) return null;

    return getCurrentResult(
        activeItem.results,
        currentTime,
    );
}
