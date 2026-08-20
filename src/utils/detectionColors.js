const DEFAULT_DETECTION_COLOR = '#000000';

export const getDetectionBackgroundStyle = (color) => ({
    backgroundColor: color ?? DEFAULT_DETECTION_COLOR,
});

const normalizeName = (name) => String(name ?? '').trim();
const sameName = (left, right) =>
    normalizeName(left).localeCompare(normalizeName(right), undefined, { sensitivity: 'accent' }) === 0;

/**
 * Renvoie la couleur de la catégorie, ou du noir par défaut.
 */
export const getDetectionColor = (type, detections = [], categories = []) => {
    const detection = detections.find((item) => sameName(item.name, type));
    const category = categories.find((item) => item.id === detection?.categoryId);
    return category?.color ?? DEFAULT_DETECTION_COLOR;
};
