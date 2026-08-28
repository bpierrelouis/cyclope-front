import { StarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { iconSizes } from '../../constants';
import { cn } from '../../utils';

/**
 * Filtre les lignes favorites directement depuis l'en-tête de leur colonne.
 */
export function FavoriteHeader(props) {
    const { api } = props;
    const colId = props.column.getColId();
    const [filterActive, setFilterActive] = useState(false);

    useEffect(() => {
        const updateFilterState = () => {
            setFilterActive(Boolean(api.getFilterModel()[colId]));
        };
        api.addEventListener('filterChanged', updateFilterState);
        return () => api.removeEventListener('filterChanged', updateFilterState);
    }, [api, colId]);

    const toggleFavoriteFilter = async () => {
        await api.setColumnFilterModel(
            colId,
            filterActive
                ? null
                : { filterType: colId, value: true },
        );
        api.onFilterChanged();
    };

    return (
        <button
            type='button'
            onClick={toggleFavoriteFilter}
            className={cn(
                'flex justify-center items-center w-full h-full cursor-pointer',
                'hover:text-warning focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2',
                filterActive && 'text-warning',
            )}
            aria-pressed={filterActive}
            aria-label={filterActive ? 'Afficher tous les résultats' : 'Afficher uniquement les favoris'}
        >
            <StarIcon
                size={iconSizes.sm}
                fill={filterActive ? 'currentColor' : 'none'}
            />
        </button>
    );
}
