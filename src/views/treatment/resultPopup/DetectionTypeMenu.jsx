import { CheckIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import { useDetectionCatalogStore } from '../../../stores';
import {
    cn,
    getDetectionBackgroundStyle,
    getDetectionColor,
    sameName,
} from '../../../utils';

export function DetectionTypeMenu(props) {
    const {
        dialogElement, onSelect, position, selectedType,
    } = props;
    const buttonRefs = useRef(new Map());
    const highlightedNameRef = useRef(null);
    const searchRef = useRef('');
    const searchTimeoutRef = useRef(null);
    const [highlightedName, setHighlightedName] = useState(null);
    const [newDetectionName, setNewDetectionName] = useState('');
    const [search, setSearch] = useState('');
    const { addDetection, categories, detections } = useDetectionCatalogStore(useShallow((state) => ({
        addDetection: state.addDetection,
        categories: state.categories,
        detections: state.detections,
    })));

    useEffect(() => {
        if (!position || !dialogElement) return undefined;

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

            const normalizedSearch = searchRef.current
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '')
                .toLocaleLowerCase();
            const match = detections.find((detection) => detection.name
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '')
                .toLocaleLowerCase()
                .startsWith(normalizedSearch));
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
    }, [detections, dialogElement, onSelect, position]);

    useEffect(() => {
        if (!highlightedName) return;
        buttonRefs.current.get(highlightedName)?.scrollIntoView({ block: 'nearest' });
    }, [highlightedName]);

    if (!position || !dialogElement) return null;

    const addAndSelect = (event) => {
        event.preventDefault();
        const name = newDetectionName.trim();
        if (!name) return;

        addDetection(name);
        const existing = detections.find((detection) => sameName(detection.name, name));
        onSelect(existing?.name ?? name);
        setNewDetectionName('');
    };

    return createPortal(
        <div
            className='z-50 fixed bg-base-100 shadow-2xl border border-base-300 rounded-xl w-64 overflow-hidden'
            style={{ left: position.left, top: position.top }}
            onPointerDown={(event) => event.stopPropagation()}
            role='dialog'
            aria-label='Choisir un type de détection'
        >
            <div className='flex justify-between items-start gap-3 px-3 pt-3 pb-2'>
                <div>
                    <p className='font-semibold text-sm leading-tight'>Type de détection</p>
                    <p className='mt-0.5 text-base-content/55 text-xs'>Tapez pour atteindre un type</p>
                </div>
                <kbd className='kbd kbd-sm text-base-content/60'>↵</kbd>
            </div>

            {search && (
                <div className='flex items-center gap-2 bg-primary/10 mx-2 mb-1 px-2.5 py-1.5 rounded-lg text-primary text-xs'>
                    <SearchIcon aria-hidden='true' size={13} />
                    <span className='truncate'>Recherche : <strong>{search}</strong></span>
                </div>
            )}

            <div className='flex flex-col gap-0.5 px-2 pb-2 max-h-44 overflow-y-auto' role='listbox'>
                {detections.length === 0 && (
                    <p className='px-2 py-5 text-base-content/50 text-sm text-center'>
                        Aucun type enregistré
                    </p>
                )}
                {detections.map((detection) => {
                    const isSelected = sameName(detection.name, selectedType);
                    const isHighlighted = sameName(detection.name, highlightedName);

                    return (
                        <button
                            key={detection.name}
                            ref={(element) => {
                                if (element) buttonRefs.current.set(detection.name, element);
                                else buttonRefs.current.delete(detection.name);
                            }}
                            type='button'
                            className={cn(
                                'group flex items-center gap-2.5 hover:bg-base-200 px-2.5 py-2 rounded-lg text-left text-sm cursor-pointer',
                                isSelected && 'bg-base-200 font-semibold',
                                isHighlighted && 'bg-primary/15 outline outline-1 outline-primary',
                            )}
                            onClick={() => onSelect(detection.name)}
                            role='option'
                            aria-selected={isSelected}
                        >
                            <span
                                className='shadow-xs rounded-full w-3 h-3 shrink-0'
                                style={getDetectionBackgroundStyle(
                                    getDetectionColor(detection.name, detections, categories),
                                )}
                            />
                            <span className='flex-1 truncate'>{detection.name}</span>
                            {isSelected && <CheckIcon aria-hidden='true' className='text-primary' size={15} />}
                            {isHighlighted && !isSelected && (
                                <span className='text-primary/70 text-[10px] uppercase tracking-wide'>Entrée</span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className='bg-base-200/60 border-base-300 border-t p-2.5'>
                <p className='mb-1.5 px-0.5 font-medium text-base-content/60 text-xs'>
                    Créer un nouveau type
                </p>
                <form
                    className='flex gap-1.5'
                    onSubmit={addAndSelect}
                >
                    <input
                        className='flex-1 bg-base-100 min-w-0 input input-bordered input-sm'
                        value={newDetectionName}
                        onChange={(event) => setNewDetectionName(event.target.value)}
                        placeholder='Nom du type…'
                        aria-label='Nom de la nouvelle détection'
                    />
                    <button
                        type='submit'
                        className='btn btn-primary btn-sm btn-square'
                        disabled={!newDetectionName.trim()}
                        title='Ajouter et sélectionner'
                        aria-label='Ajouter et sélectionner la détection'
                    >
                        <PlusIcon size={16} />
                    </button>
                </form>
            </div>
        </div>,
        dialogElement,
    );
}
