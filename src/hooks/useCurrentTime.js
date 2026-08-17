import { useSelectionContext } from '../contexts/selectionContext';
import { usePlayerStore } from '../stores';

export function useCurrentTime() {
    const { activeItem } = useSelectionContext();
    const currentTime = usePlayerStore((state) => state.currentTime);

    return activeItem
        ? Math.max(0, currentTime - activeItem.offset)
        : currentTime;
}
