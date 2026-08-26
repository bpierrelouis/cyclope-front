import { ListIcon, PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
    DeleteButton,
    SectionCard,
} from '../../../components';
import { useDetectionCatalogStore } from '../../../stores';
import { getDetectionBackgroundStyle } from '../../../utils';

function DetectionRow(props) {
    const {
        categories, color, detection, onCategoryChange, onRemove,
    } = props;

    return (
        <div className='flex items-center gap-2 hover:bg-base-200 p-2 rounded-box'>
            <span
                className='rounded-full w-3 h-3 shrink-0'
                style={getDetectionBackgroundStyle(color)}
            />
            <span className='flex-1 min-w-0 font-medium truncate'>{detection.name}</span>
            <select
                className='w-44 select select-bordered select-sm'
                value={detection.categoryId ?? ''}
                onChange={(event) => onCategoryChange(detection.name, event.target.value)}
                aria-label={`Catégorie de ${detection.name}`}
            >
                <option value=''>Non catégorisée</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name || 'Catégorie'}
                    </option>
                ))}
            </select>
            <DeleteButton
                aria-label={`Retirer ${detection.name}`}
                onClick={() => onRemove(detection.name)}
                title='Retirer la détection'
            />
        </div>
    );
}

export function DetectionsCard() {
    const {
        addDetection, categories, detections, removeDetection, setDetectionCategory,
    } = useDetectionCatalogStore(useShallow((state) => ({
        addDetection: state.addDetection,
        categories: state.categories,
        detections: state.detections,
        removeDetection: state.removeDetection,
        setDetectionCategory: state.setDetectionCategory,
    })));
    const [name, setName] = useState('');

    const sortedDetections = useMemo(
        () => [...detections].sort((left, right) => left.name.localeCompare(right.name)),
        [detections],
    );
    const categoryColors = useMemo(
        () => new Map(categories.map((category) => [category.id, category.color])),
        [categories],
    );
    const pendingCount = detections.filter((detection) => !detection.categoryId).length;

    const submit = (event) => {
        event.preventDefault();
        if (addDetection(name)) setName('');
    };

    return (
        <SectionCard
            description='Les nouvelles détections reçues sont ajoutées automatiquement. Associez-les à une catégorie pour appliquer sa couleur au tableau des résultats.'
            icon={ListIcon}
            title={`Détections (${pendingCount} à catégoriser)`}
        >

            <form className='flex gap-2' onSubmit={submit}>
                <input
                    className='flex-1 input input-bordered'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='Ajouter une détection manuellement'
                    aria-label='Nom de la détection'
                />
                <button className='btn btn-primary' type='submit' disabled={!name.trim()}>
                    <PlusIcon size={16} /> Ajouter
                </button>
            </form>

            <div className='flex flex-col flex-1 gap-1 mt-2 min-h-0 overflow-auto'>
                {sortedDetections.length === 0 && (
                    <p className='bg-base-200 p-3 rounded-box text-base-content/60 text-sm'>
                        Les types détectés apparaîtront ici à la réception des résultats.
                    </p>
                )}
                {sortedDetections.map((detection) => (
                    <DetectionRow
                        key={detection.name}
                        categories={categories}
                        color={categoryColors.get(detection.categoryId)}
                        detection={detection}
                        onCategoryChange={setDetectionCategory}
                        onRemove={removeDetection}
                    />
                ))}
            </div>
        </SectionCard>
    );
}
