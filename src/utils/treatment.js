const regexTimecode = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}$/;

/**
 * Convertit un timecode 'HH:MM:SS.mmm' en secondes (Number), ou null.
 * @param {string} timecode
 * @returns {number|null}
 */
export const parseTimecode = (timecode) => {
    if (typeof timecode !== 'string' || !regexTimecode.test(timecode)) return null;
    const [h, m, s] = timecode.split(':').map(Number);
    return h * 3600 + m * 60 + s;
};

/**
 * Retourne le Result correspondant à l'instant courant : le plus récent dont
 * le timecode est <= currentTime. Repli sur le premier résultat sinon.
 * @param {Array} results
 * @param {number} currentTime - secondes
 * @returns {object|null}
 */
export const getCurrentResult = (results, currentTime) => {
    if (!results?.length) return null;

    let current = null;
    let bestSeconds = -Infinity;

    for (const result of results) {
        const seconds = result.seconds;
        if (seconds === null) continue;
        if (seconds <= currentTime && seconds > bestSeconds) {
            bestSeconds = seconds;
            current = result;
        }
    }

    return current ?? results[0];
};

export const getLatestCompletedTreatment = (treatments = []) => treatments.reduce(
    (latest, treatment) => treatment.status === 'DONE'
        && (!latest || treatment.id > latest.id)
        ? treatment
        : latest,
    null,
);
