import { StarIcon } from 'lucide-react';

import { iconSizes, NOTIFICATION_LABELS } from '../../../constants';
import { resultsQueries } from '../../../hooks';
import { cn, openErrorToast, preventDefault } from '../../../utils';

/**
 * Fonction de mise en favori d'une ligne.
 * Passe par le hook d'update générique, qui envoie le PATCH.
 * L'étoile bascule tout de suite et ne revient en arrière que si le serveur
 * refuse.
 * Le bouton est verrouillé le temps de l'aller-retour pour éviter les bugs.
 */
export function FavoriteCell(props) {
    const isFavorite = props.value;
    const { mutate: updateResult, isPending } = resultsQueries.useUpdate();

    const handleClick = () => updateResult(
        { data: { isFavorite: !isFavorite }, id: props.data.id },
        { onError: () => openErrorToast(NOTIFICATION_LABELS.FAVORITE_SAVE_ERROR) },
    );

    return (
        <button
            type='button'
            disabled={isPending}
            className={cn(
                'hover:text-warning text-base-content/50 btn btn-ghost',
                isFavorite && 'text-warning',
            )}
            onClick={preventDefault(handleClick)}
        >
            <StarIcon
                size={iconSizes.sm}
                fill={isFavorite ? 'currentColor' : 'none'}
            />
        </button>
    );
}
