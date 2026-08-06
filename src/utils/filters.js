export const filterMissionsByStatus = (missions, status) => {
    if (!status) return missions;
    return missions?.filter((m) => Boolean(m.statuses[status]));
};

/**
 * Interprète le modèle de filtres AG Grid hors de la grille, notamment sur la carte.
 */
export const resultPassesTableFilters = (
    result,
    filterModel,
) => {
    const favoriteFilter = filterModel?.isFavorite;
    const detectionTypes = filterModel?.objects?.values ?? [];

    // isFavorite est lu sur le resultat lui-meme : les results sont synchronises entre fenetres via playerService.
    if (favoriteFilter && !result.isFavorite) {
        return false;
    }

    if (detectionTypes.length > 0) {
        const types = result.objects?.map(({ type }) => type) ?? [];
        if (!detectionTypes.some((type) => types.includes(type))) {
            return false;
        }
    }

    return true;
};

export const filterResultsLikeTable = (results, filterModel) =>
    (results ?? []).filter((result) => resultPassesTableFilters(result, filterModel));
