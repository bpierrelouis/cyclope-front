export const Plan = Object.freeze({
    GLYPHS_URL: '/fonts/{fontstack}/{range}.pbf',
    SPRITE_URL: '/sprites/v4/light',

    MIN_ZOOM: 0,
    MAX_ZOOM: 20,

    RESYNC_THRESHOLD: 0.35,
    MARKER_STYLE: { zIndex: 5, pointerEvents: 'none' },
});

export const iconSizes = Object.freeze({
    xs: 12,
    sm: 16,
});

export const HEALTH = Object.freeze({
    LIMITING_KEYPATH: 'statusBdd',
    IA_MAIN_KEYPATH: 'statusApiIa',
    IA_RESPONSE_KEYPATH: 'responseHealthApiIa',

    BACK_LABEL_BY_KEYPATH: [
        ['statusStorageS3', 'Stockage de fichier'],
        ['statusBdd', 'Base de données'],
    ],

    IA_LABEL_BY_KEYPATH: [
        ['workerRunning', 'IA processus'],
        ['aiFunctionLoaded', 'IA fonction chargée'],
    ],
});
