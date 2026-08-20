import { PlusIcon, TagsIcon, Trash2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { ConfigurationCard } from '../../components';
import { useDetectionCatalogStore } from '../../stores';
import { getDetectionBackgroundStyle, getDetectionColor } from '../../utils';
import { SettingsCardHeader } from './SettingsCardHeader';

const DEFAULT_COLOR = '#3b82f6';

export function DetectionCategoriesSettings() {
    const {
        categories,
        detections,
        addCategory,
        updateCategory,
        removeCategory,
        addDetection,
        setDetectionCategory,
        removeDetection,
    } = useDetectionCatalogStore(useShallow((state) => ({
        addCategory: state.addCategory,
        addDetection: state.addDetection,
        categories: state.categories,
        detections: state.detections,
        removeCategory: state.removeCategory,
        removeDetection: state.removeDetection,
        setDetectionCategory: state.setDetectionCategory,
        updateCategory: state.updateCategory,
    })));
    const [categoryName, setCategoryName] = useState('');
    const [categoryColor, setCategoryColor] = useState(DEFAULT_COLOR);
    const [detectionName, setDetectionName] = useState('');

    const sortedDetections = useMemo(
        () => [...detections].sort((left, right) => left.name.localeCompare(right.name)),
        [detections],
    );
    const pendingCount = detections.filter((detection) => !detection.categoryId).length;

    const submitCategory = (event) => {
        event.preventDefault();
        if (addCategory(categoryName, categoryColor)) setCategoryName('');
    };

    const submitDetection = (event) => {
        event.preventDefault();
        if (addDetection(detectionName)) setDetectionName('');
    };

    return (
        <ConfigurationCard>
            <SettingsCardHeader icon={TagsIcon} title='Catégories de détection'>
                Les nouvelles détections reçues sont ajoutées automatiquement. Associez-les à une catégorie pour appliquer sa couleur au tableau des résultats.
            </SettingsCardHeader>

            <div className='divider my-1'>Catégories</div>

            <form className='flex sm:flex-row flex-col gap-2' onSubmit={submitCategory}>
                <input
                    className='flex-1 input input-bordered'
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    placeholder='Nom de la catégorie'
                    aria-label='Nom de la catégorie'
                />
                <input
                    type='color'
                    className='p-1 w-12 h-9 input input-bordered cursor-pointer'
                    value={categoryColor}
                    onChange={(event) => setCategoryColor(event.target.value)}
                    aria-label='Couleur de la catégorie'
                />
                <button className='btn btn-primary' type='submit' disabled={!categoryName.trim()}>
                    <PlusIcon size={16} /> Ajouter
                </button>
            </form>

            <div className='flex flex-col gap-2 mt-2'>
                {categories.length === 0 && (
                    <p className='bg-base-200 p-3 rounded-box text-base-content/60 text-sm'>
                        Aucune catégorie pour le moment.
                    </p>
                )}
                {categories.map((category) => (
                    <div key={category.id} className='flex items-center gap-2 bg-base-200 p-2 rounded-box'>
                        <input
                            type='color'
                            className='p-1 w-10 h-9 input input-bordered cursor-pointer'
                            value={category.color}
                            onChange={(event) => updateCategory(category.id, { color: event.target.value })}
                            aria-label={`Couleur de ${category.name}`}
                        />
                        <input
                            className='flex-1 input input-bordered input-sm'
                            value={category.name}
                            onChange={(event) => updateCategory(category.id, { name: event.target.value })}
                            onBlur={(event) => updateCategory(category.id, {
                                name: event.target.value.trim() || 'Catégorie',
                            })}
                            aria-label='Nom de la catégorie'
                        />
                        <span className='hidden sm:inline opacity-60 text-xs'>
                            {detections.filter((detection) => detection.categoryId === category.id).length} détection(s)
                        </span>
                        <button
                            type='button'
                            className='btn btn-ghost btn-square btn-sm text-error'
                            onClick={() => removeCategory(category.id)}
                            title='Supprimer la catégorie'
                        >
                            <Trash2Icon size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <div className='divider my-2'>
                Détections ({pendingCount} à catégoriser)
            </div>

            <form className='flex gap-2' onSubmit={submitDetection}>
                <input
                    className='flex-1 input input-bordered'
                    value={detectionName}
                    onChange={(event) => setDetectionName(event.target.value)}
                    placeholder='Ajouter une détection manuellement'
                    aria-label='Nom de la détection'
                />
                <button className='btn btn-primary' type='submit' disabled={!detectionName.trim()}>
                    <PlusIcon size={16} /> Ajouter
                </button>
            </form>

            <div className='flex flex-col gap-1 mt-2 max-h-96 overflow-auto'>
                {sortedDetections.length === 0 && (
                    <p className='bg-base-200 p-3 rounded-box text-base-content/60 text-sm'>
                        Les types détectés apparaîtront ici à la réception des résultats.
                    </p>
                )}
                {sortedDetections.map((detection) => {
                    return (
                        <div key={detection.name} className='flex items-center gap-2 hover:bg-base-200 p-2 rounded-box'>
                            <span
                                className='rounded-full w-3 h-3 shrink-0'
                                style={getDetectionBackgroundStyle(
                                    getDetectionColor(detection.name, detections, categories),
                                )}
                            />
                            <span className='flex-1 min-w-0 font-medium truncate'>{detection.name}</span>
                            <select
                                className='w-44 select select-bordered select-sm'
                                value={detection.categoryId ?? ''}
                                onChange={(event) => setDetectionCategory(detection.name, event.target.value)}
                                aria-label={`Catégorie de ${detection.name}`}
                            >
                                <option value=''>Non catégorisée</option>
                                {categories.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name || 'Catégorie'}</option>
                                ))}
                            </select>
                            <button
                                type='button'
                                className='btn btn-ghost btn-square btn-sm text-error'
                                onClick={() => removeDetection(detection.name)}
                                title='Retirer la détection'
                            >
                                <Trash2Icon size={15} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ConfigurationCard>
    );
}
