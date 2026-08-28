import { SearchIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import { useDetectionTypeSearch, useFittedMenuPosition } from '../../hooks';
import { useDetectionCatalogStore } from '../../stores';
import { sameName } from '../../utils';
import { DetectionTypeCreator } from './DetectionTypeCreator';
import { DetectionTypeList } from './DetectionTypeList';

export function DetectionTypeMenu(props) {
    const {
        dialogElement, onSelect, position, selectedType,
    } = props;
    const { addDetection, categories, detections } = useDetectionCatalogStore(useShallow((state) => ({
        addDetection: state.addDetection,
        categories: state.categories,
        detections: state.detections,
    })));
    const { menuRef, menuStyle } = useFittedMenuPosition(position);
    const { highlightedName, registerButton, search } = useDetectionTypeSearch({
        active: Boolean(position && dialogElement),
        detections,
        onSelect,
    });

    if (!position || !dialogElement) return null;

    const addAndSelect = (name) => {
        addDetection(name);
        const existing = detections.find((detection) => sameName(detection.name, name));
        onSelect(existing?.name ?? name);
    };

    return createPortal(
        <div
            ref={menuRef}
            className='z-50 fixed bg-base-100 shadow-2xl border border-base-300 rounded-xl w-64 max-w-[calc(100vw-1rem)] max-h-[calc(100vh-1rem)] overflow-y-auto'
            style={menuStyle}
            onPointerDown={(event) => event.stopPropagation()}
            role='dialog'
            aria-label='Choisir un type de détection'
        >
            <div className='flex justify-between items-start gap-3 px-3 pt-3 pb-2'>
                <div>
                    <p className='font-semibold text-sm leading-tight'>Type de détection</p>
                    <p className='mt-0.5 text-xs text-base-content/55'>
                        Tapez pour atteindre un type
                    </p>
                </div>
                <kbd className='text-base-content/60 kbd kbd-sm'>↵</kbd>
            </div>

            {search && (
                <div className='flex items-center gap-2 bg-primary/10 mx-2 mb-1 px-2.5 py-1.5 rounded-lg text-primary text-xs'>
                    <SearchIcon aria-hidden='true' size={13} />
                    <span className='truncate'>Recherche : <strong>{search}</strong></span>
                </div>
            )}

            <DetectionTypeList
                categories={categories}
                detections={detections}
                highlightedName={highlightedName}
                onSelect={onSelect}
                registerButton={registerButton}
                selectedType={selectedType}
            />
            <DetectionTypeCreator onCreate={addAndSelect} />
        </div>,
        dialogElement,
    );
}
