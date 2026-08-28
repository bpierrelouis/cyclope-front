import { TABLE_FILTER_TYPES } from '../constants';

export const filterMissionsByStatus = (missions, status) => {
    if (!status) return missions;
    return missions?.filter((m) => Boolean(m.statuses[status]));
};

const CUSTOM_FILTER_FIELDS = new Set(['isFavorite', 'objects']);

export const getFieldValue = (object, path) =>
    path.split('.').reduce((value, key) => value?.[key], object);

export const normalizeNumericFilterValue = (value) => {
    if (value == null || (typeof value === 'string' && value.trim() === '')) return null;
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
};

const PREDICATES = {
    [TABLE_FILTER_TYPES.TEXT.CONTAINS]: (value, { filter }) =>
        String(value).toLowerCase().includes(String(filter).toLowerCase()),
    [TABLE_FILTER_TYPES.NUMBER.EQUALS]: (value, { filter }) => Number(value) === filter,
    [TABLE_FILTER_TYPES.NUMBER.GREATER_THAN]: (value, { filter }) => Number(value) > filter,
    [TABLE_FILTER_TYPES.NUMBER.IN_RANGE]: (value, { filter, filterTo }) =>
        Number(value) > filter && Number(value) < filterTo,
    [TABLE_FILTER_TYPES.NUMBER.LESS_THAN]: (value, { filter }) => Number(value) < filter,
};

const passesColumnFilter = (value, model) => {
    const predicate = PREDICATES[model?.type];
    if (!predicate) return true;
    const normalizedValue = model.filterType === 'number'
        ? normalizeNumericFilterValue(value)
        : value;
    if (normalizedValue == null) return false;
    return predicate(normalizedValue, model);
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

    return Object.entries(filterModel ?? {})
        .filter(([field]) => !CUSTOM_FILTER_FIELDS.has(field))
        .every(([field, model]) => passesColumnFilter(getFieldValue(result, field), model));
};

export const filterResultsLikeTable = (results, filterModel) =>
    (results ?? []).filter((result) => resultPassesTableFilters(result, filterModel));
