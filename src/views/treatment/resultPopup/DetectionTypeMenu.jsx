import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
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
    const [newDetectionName, setNewDetectionName] = useState('');
    const { addDetection, categories, detections } = useDetectionCatalogStore(useShallow((state) => ({
        addDetection: state.addDetection,
        categories: state.categories,
        detections: state.detections,
    })));

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
            className='z-50 fixed bg-base-100 shadow-xl border border-base-300 rounded-box w-56 max-h-56 overflow-auto'
            style={{ left: position.left, top: position.top }}
            onPointerDown={(event) => event.stopPropagation()}
        >
            <div className='flex flex-col gap-1 p-2'>
                {detections.map((detection) => (
                    <button
                        key={detection.name}
                        type='button'
                        className={cn(
                            'flex items-center gap-2 hover:bg-base-200 px-2 py-1.5 rounded-field text-left text-sm cursor-pointer',
                            sameName(detection.name, selectedType) && 'bg-base-200 font-semibold',
                        )}
                        onClick={() => onSelect(detection.name)}
                    >
                        <span
                            className='rounded-full w-2.5 h-2.5 shrink-0'
                            style={getDetectionBackgroundStyle(
                                getDetectionColor(detection.name, detections, categories),
                            )}
                        />
                        <span className='flex-1 truncate'>{detection.name}</span>
                    </button>
                ))}
                <form
                    className='flex gap-1 mt-1 pt-2 border-base-300 border-t'
                    onSubmit={addAndSelect}
                >
                    <input
                        className='flex-1 min-w-0 input input-bordered input-sm'
                        value={newDetectionName}
                        onChange={(event) => setNewDetectionName(event.target.value)}
                        placeholder='Nouvelle détection'
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
