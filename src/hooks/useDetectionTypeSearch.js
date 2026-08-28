import { useCallback, useEffect, useRef, useState } from 'react';

const normalizeSearch = (value) => value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase();

export function useDetectionTypeSearch({ active, detections, onSelect }) {
    const buttonRefs = useRef(new Map());
    const highlightedNameRef = useRef(null);
    const searchRef = useRef('');
    const searchTimeoutRef = useRef(null);
    const [highlightedName, setHighlightedName] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!active) return undefined;

        const resetSearchSoon = () => {
            window.clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = window.setTimeout(() => {
                searchRef.current = '';
                setSearch('');
            }, 800);
        };

        const onKeyDown = (event) => {
            if (event.target instanceof HTMLInputElement
                || event.ctrlKey || event.metaKey || event.altKey) return;

            if (event.key === 'Enter' && highlightedNameRef.current) {
                event.preventDefault();
                onSelect(highlightedNameRef.current);
                return;
            }

            if (event.key.length !== 1) return;

            event.preventDefault();
            searchRef.current += event.key;
            setSearch(searchRef.current);
            resetSearchSoon();

            const normalizedSearch = normalizeSearch(searchRef.current);
            const match = detections.find((detection) =>
                normalizeSearch(detection.name).startsWith(normalizedSearch));
            highlightedNameRef.current = match?.name ?? null;
            setHighlightedName(highlightedNameRef.current);
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            window.clearTimeout(searchTimeoutRef.current);
            highlightedNameRef.current = null;
            searchRef.current = '';
        };
    }, [active, detections, onSelect]);

    useEffect(() => {
        if (!highlightedName) return;
        buttonRefs.current.get(highlightedName)?.scrollIntoView({ block: 'nearest' });
    }, [highlightedName]);

    const registerButton = useCallback((name, element) => {
        if (element) buttonRefs.current.set(name, element);
        else buttonRefs.current.delete(name);
    }, []);

    return { highlightedName, registerButton, search };
}
