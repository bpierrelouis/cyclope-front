export const Plan = Object.freeze({
    GLYPHS_URL: '/fonts/{fontstack}/{range}.pbf',
    MARKER_STYLE: { pointerEvents: 'none', zIndex: 5 },

    MAX_ZOOM: 20,
    MIN_ZOOM: 0,

    RESYNC_THRESHOLD: 0.35,
    SPRITE_URL: '/sprites/v4/light',
});

export const iconSizes = Object.freeze({
    sm: 16,
    xs: 12,
});

export const HEALTH = Object.freeze({
    BACK_LABEL_BY_KEYPATH: [
        ['statusStorageS3', 'Stockage de fichier'],
        ['statusBdd', 'Base de données'],
    ],
    IA_LABEL_BY_KEYPATH: [
        ['workerRunning', 'IA processus'],
        ['aiFunctionLoaded', 'IA fonction chargée'],
    ],
    IA_MAIN_KEYPATH: 'statusApiIa',

    IA_RESPONSE_KEYPATH: 'responseHealthApiIa',

    LIMITING_KEYPATH: 'statusBdd',
});
