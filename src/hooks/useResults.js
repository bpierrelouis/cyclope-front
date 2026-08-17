import { useSelectionContext } from '../contexts/selectionContext';

export function useResults() {
    const { activeItem, source } = useSelectionContext();

    if (source.items.length > 0) return source.results;
    return activeItem?.results ?? [];
}
