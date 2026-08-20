import { useMemo, useRef } from 'react';

import { useDetectionCatalogStore } from '../../../stores';
import { getDetectionBackgroundStyle, getDetectionColor } from '../../../utils';

const EMPTY_OBJECTS = [];
const normalizeType = (type) => String(type ?? '').trim();
const sameType = (left, right) =>
    normalizeType(left).localeCompare(normalizeType(right), undefined, { sensitivity: 'accent' }) === 0;

export function DetectionCellEditor(props) {
    const { value = [], onValueChange } = props;
    const currentValue = value ?? EMPTY_OBJECTS;
    const categories = useDetectionCatalogStore((state) => state.categories);
    const detections = useDetectionCatalogStore((state) => state.detections);

    const categoryById = useMemo(
        () => new Map(categories.map((category) => [category.id, category])),
        [categories],
    );
    const options = useMemo(() => [...detections].sort((left, right) => {
        const leftCategory = categoryById.get(left.categoryId)?.name ?? 'Sans catégorie';
        const rightCategory = categoryById.get(right.categoryId)?.name ?? 'Sans catégorie';
        return leftCategory.localeCompare(rightCategory) || left.name.localeCompare(right.name);
    }), [categoryById, detections]);

    const removedByTypeRef = useRef(new Map());

    const toggle = (name) => {
        const selected = currentValue.filter((object) => sameType(object.type, name));
        if (selected.length > 0) {
            removedByTypeRef.current.set(name, selected);
            onValueChange(currentValue.filter((object) => !sameType(object.type, name)));
            return;
        }
        const restored = removedByTypeRef.current.get(name) ?? [{ confidence: 1, type: name }];
        onValueChange([...currentValue, ...restored]);
    };

    return (
        <div className='bg-base-100 shadow-xl border border-base-300 rounded-box w-72 max-h-80 text-base-content overflow-auto'>
            <div className='top-0 z-10 sticky bg-base-100 border-base-300 px-3 py-2 border-b'>
                <strong className='text-sm'>Détections</strong>
            </div>
            <div className='flex flex-col gap-1 p-2'>
                {options.length === 0 && (
                    <span className='p-2 opacity-60 text-xs'>Ajoutez d’abord une détection dans les paramètres.</span>
                )}
                {options.map((detection) => {
                    const category = categoryById.get(detection.categoryId);
                    return (
                        <label
                            key={detection.name}
                            className='flex items-center gap-2 hover:bg-base-200 px-2 py-1.5 rounded-field cursor-pointer'
                        >
                            <input
                                type='checkbox'
                                className='checkbox checkbox-primary checkbox-sm'
                                checked={currentValue.some((object) => sameType(object.type, detection.name))}
                                onChange={() => toggle(detection.name)}
                            />
                            <span
                                className='rounded-full w-2.5 h-2.5 shrink-0'
                                style={getDetectionBackgroundStyle(
                                    getDetectionColor(detection.name, detections, categories),
                                )}
                            />
                            <span className='flex-1 text-sm'>{detection.name}</span>
                            <span className='opacity-50 text-xs'>{category?.name ?? 'Non classée'}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
