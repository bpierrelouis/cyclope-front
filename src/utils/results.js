export const buildLowConfidenceZones = (results, safeDuration) => {
    const sorted = [...(results ?? [])]
        .filter((r) => r.seconds !== null)
        .sort((a, b) => a.seconds - b.seconds);

    return sorted
        .map((r, i) => ({
            end: sorted[i + 1]?.seconds ?? safeDuration,
            id: r.id,
            isFreezing: r.isFreezing,
            start: r.seconds,
        }))
        .filter((z) => z.isFreezing);
};

/**
 * Le "Number.isFinite()" protège d'un NaN ou Infinity sur une modification de la cellule.
 * @param value
 * @returns {boolean}
 */
const isNumberBetween = (value, min, max) =>
    Number.isFinite(value) && value >= min && value <= max;
export const isValidLatitude = (latitude) => isNumberBetween(latitude, -90, 90);
export const isValidLongitude = (longitude) => isNumberBetween(longitude, -180, 180);

export const toText = (objects) =>
    (objects ?? [])
        .map(({ type, confidence }) => `${type}/${Math.round(confidence * 100)}`)
        .join(';');

// Renvoie la liste des objets, ou null si la saisie ne respecte pas le format.
export const fromText = (text) => {
    const objects = (text ?? '')
        .split(';')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const [type, percent] = entry.split('/').map((part) => part.trim());
            // Confiance absente ou vide ("personne" ou "personne/") → 100 par défaut.
            return { confidence: Number(percent || '100') / 100, type };
        });

    const isValid = objects.every(
        ({ type, confidence }) =>
            type && Number.isFinite(confidence) && confidence >= 0 && confidence <= 1,
    );
    return isValid ? objects : null;
};
