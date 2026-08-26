import { PlusIcon, TagsIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
    DeleteButton,
    SectionCard,
} from '../../../components';
import { useDetectionCatalogStore } from '../../../stores';

const DEFAULT_COLOR = '#3b82f6';

function CategoryRow(props) {
    const {
        category, detectionCount, onRemove, onUpdate,
    } = props;

    const updateName = (name) => onUpdate(category.id, { name });

    return (
        <div className='flex items-center gap-2 hover:bg-base-200 p-2 rounded-box'>
            <input
                type='color'
                className='p-1 w-10 h-9 input input-bordered cursor-pointer'
                value={category.color}
                onChange={(event) => onUpdate(category.id, { color: event.target.value })}
                aria-label={`Couleur de ${category.name}`}
            />
            <input
                className='flex-1 input input-bordered input-sm'
                value={category.name}
                onChange={(event) => updateName(event.target.value)}
                onBlur={(event) => updateName(event.target.value.trim() || 'Catégorie')}
                aria-label='Nom de la catégorie'
            />
            <span className='hidden sm:inline opacity-60 text-xs'>
                {detectionCount} détection(s)
            </span>
            <DeleteButton
                aria-label={`Supprimer ${category.name}`}
                onClick={() => onRemove(category.id)}
                title='Supprimer la catégorie'
            />
        </div>
    );
}

export function DetectionCategoriesCard() {
    const {
        addCategory, categories, detections, removeCategory, updateCategory,
    } = useDetectionCatalogStore(useShallow((state) => ({
        addCategory: state.addCategory,
        categories: state.categories,
        detections: state.detections,
        removeCategory: state.removeCategory,
        updateCategory: state.updateCategory,
    })));
    const [name, setName] = useState('');
    const [color, setColor] = useState(DEFAULT_COLOR);

    const detectionCounts = useMemo(() => detections.reduce((counts, detection) => {
        if (!detection.categoryId) return counts;
        counts.set(detection.categoryId, (counts.get(detection.categoryId) ?? 0) + 1);
        return counts;
    }, new Map()), [detections]);

    const submit = (event) => {
        event.preventDefault();
        if (addCategory(name, color)) setName('');
    };

    return (
        <SectionCard
            description='Créez les catégories et choisissez la couleur appliquée aux détections associées.'
            icon={TagsIcon}
            title='Catégories de détection'
        >

            <form className='flex sm:flex-row flex-col gap-2' onSubmit={submit}>
                <input
                    className='flex-1 input input-bordered'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='Nom de la catégorie'
                    aria-label='Nom de la catégorie'
                />
                <input
                    type='color'
                    className='p-1 w-12 h-9 input input-bordered cursor-pointer'
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    aria-label='Couleur de la catégorie'
                />
                <button className='btn btn-primary' type='submit' disabled={!name.trim()}>
                    <PlusIcon size={16} /> Ajouter
                </button>
            </form>

            <div className='flex flex-col flex-1 gap-2 mt-2 min-h-0 overflow-auto'>
                {categories.length === 0 && (
                    <p className='bg-base-200 p-3 rounded-box text-base-content/60 text-sm'>
                        Aucune catégorie pour le moment.
                    </p>
                )}
                {categories.map((category) => (
                    <CategoryRow
                        key={category.id}
                        category={category}
                        detectionCount={detectionCounts.get(category.id) ?? 0}
                        onRemove={removeCategory}
                        onUpdate={updateCategory}
                    />
                ))}
            </div>
        </SectionCard>
    );
}
