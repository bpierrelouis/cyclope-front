export const mockMissions = [
    {
        creation_date: '2026-04-15T10:00:00Z',
        id: 1,
        medias_status: {
            DONE: 4,
        },
        name: 'Survol zone A — 15/04/2026',
    },
    {
        creation_date: '2026-04-15T10:00:00Z',
        id: 2,
        medias_status: {
            PENDING: 1,
        },
        name: 'Parc Nord B',
    },
    {
        creation_date: '2026-04-15T10:00:00Z',
        id: 3,
        medias_status: {
            ERROR: 1,
        },
        name: 'Hangar H',
    },
];

export const mockMedias = [
    {
        display_name: 'IMG_0234.jpg',
        file_id: 1,
        id: 1,
        last_treatment_id: 1,
        last_treatment_status: 'DONE',
        mission_id: 1,
        parent_file: {
            extension: 'jpg',
            id: 1,
            name: 'fichier1.jpg',
            size: 6000,
            url: 'https://picsum.photos/300/200',
        },
    },
    {
        display_name: 'drone_survey_A_01.mp4',
        file_id: 5,
        id: 2,
        last_treatment_id: 2,
        last_treatment_status: 'DONE',
        mission_id: 1,
        parent_file: {
            duration: 10.026667,
            extension: 'mp4',
            id: 5,
            name: 'mov_bbb.mp4',
            size: 60521,
            url: '/dev-media/html/mov_bbb.mp4',
        },
    },
    {
        display_name: 'drone_survey_A_02.mp4',
        file_id: 5,
        id: 3,
        last_treatment_id: 3,
        last_treatment_status: 'DONE',

        mission_id: 1,

        parent_file: {
            duration: 10.026667,
            extension: 'mp4',
            id: 5,
            name: 'mov_bbb.mp4',
            size: 60521,
            url: '/dev-media/html/mov_bbb.mp4',
        },
    },
    {
        display_name: 'drone_survey_A_03.mp4',
        file_id: 5,
        id: 4,
        last_treatment_id: 4,
        last_treatment_status: 'DONE',

        mission_id: 1,

        parent_file: {
            duration: 10.026667,
            extension: 'mp4',
            id: 5,
            name: 'mov_bbb.mp4',
            size: 60521,
            url: '/dev-media/html/mov_bbb.mp4',
        },
    },
    {
        display_name: 'fichier3.jpg',
        file_id: 3,
        id: 5,
        last_treatment_status: 'PENDING',
        mission_id: 2,
        parent_file: {
            extension: 'jpg',
            id: 3,
            name: 'fichier3.jpg',
            size: 6000,
            url: 'https://picsum.photos/300/200',
        },
    },
    {
        display_name: 'fichier4.jpg',
        file_id: 4,
        id: 6,
        last_treatment_status: 'ERROR',
        mission_id: 3,
        parent_file: {
            extension: 'jpg',
            id: 4,
            name: 'fichier4.jpg',
            size: 6000,
            url: 'https://picsum.photos/300/200',
        },
    },
];

export const mockTreatments = [
    {
        config: {
            confidence_threshold: 50,
            frame_step: 3,
            object_detection_enabled: true,
            processing_level: 2,
        },
        creation_date: '2026-04-15T10:00:00Z',
        id: 1,
        media_id: 1,
        status: 'DONE',
    },
    {
        config: {
            confidence_threshold: 42,
            frame_step: 3,
            object_detection_enabled: true,
            processing_level: 2,
        },
        creation_date: '2026-04-15T10:00:00Z',
        id: 2,
        media_id: 2,
        status: 'DONE',
    },
    {
        config: {
            confidence_threshold: 42,
            frame_step: 3,
            object_detection_enabled: true,
            processing_level: 2,
        },
        creation_date: '2026-04-15T10:05:00Z',
        id: 3,
        media_id: 3,
        status: 'DONE',
    },
    {
        config: {
            confidence_threshold: 42,
            frame_step: 3,
            object_detection_enabled: true,
            processing_level: 2,
        },
        creation_date: '2026-04-15T10:10:00Z',
        id: 4,
        media_id: 4,
        status: 'DONE',
    },
];

const createMockVideoResult = ({
    altitude,
    id,
    index,
    treatmentId,
    timestamp,
    latitude,
    longitude,
    speed,
    targetLatitude,
    targetLongitude,
    isFreezing = false,
    objects = [],
}) => ({
    id,
    index,
    response_json: {
        aircraft: {
            altitude: {
                confiance: 100,
                unite: 'm',
                valeur: altitude,
            },
            coord: {
                latitude: { confiance: 100, valeur: latitude },
                longitude: { confiance: 100, valeur: longitude },
            },
            vitesse: {
                confiance: 100,
                unite: 'km/h',
                valeur: speed,
            },
        },
        frame_index: index,
        meta_data: {
            degradation_image: 0,
            is_freezing: isFreezing,
        },
        objects,
        target: {
            coord: {
                latitude: { confiance: 100, valeur: targetLatitude },
                longitude: { confiance: 100, valeur: targetLongitude },
            },
        },
        timestamp,
        timestamp_seconds: null,
    },
    treatment_id: treatmentId,
});

const MOCK_RESULT_INTERVAL_SECONDS = 1.5;
const MOCK_AIRPLANE_DETECTIONS = [
    {
        bbox: {
            height: 706,
            width: 523,
            x1: 0,
            x2: 523,
            y1: 8,
            y2: 714,
        },
        box_index: 0,
        class_id: 4,
        confidence: 70.3,
        type: 'avion',
    },
    {
        bbox: {
            height: 1038,
            width: 527,
            x1: 0,
            x2: 527,
            y1: 33,
            y2: 1071,
        },
        box_index: 1,
        class_id: 4,
        confidence: 17.75,
        type: 'avion',
    },
];
const MOCK_RESPONSE_VARIANTS = [
    ...Array.from({ length: 4 }, () => ({
        meta_data: { degradation_image: 42, is_freezing: true },
        objects: MOCK_AIRPLANE_DETECTIONS,
    })),
    { meta_data: { degradation_image: 8, is_freezing: false }, objects: [] },
    { meta_data: { degradation_image: 20, is_freezing: false }, objects: [] },
    { meta_data: { degradation_image: 20, is_freezing: false }, objects: [] },
];
const MOCK_TRAJECTORY = [
    {
        altitude: 120, latitude: 48.8566, longitude: 2.3522, speed: 72,
    },
    {
        altitude: 124, latitude: 48.8573, longitude: 2.3526, speed: 76,
    },
    {
        altitude: 129, latitude: 48.8578, longitude: 2.3533, speed: 81,
    },
    {
        altitude: 127, latitude: 48.8580, longitude: 2.3543, speed: 78,
    },
    {
        altitude: 133, latitude: 48.8579, longitude: 2.3554, speed: 84,
    },
    {
        altitude: 138, latitude: 48.8575, longitude: 2.3564, speed: 88,
    },
    {
        altitude: 135, latitude: 48.8569, longitude: 2.3572, speed: 83,
    },
];
const MOCK_TARGET_COORDINATES = { latitude: 48.8620, longitude: 2.3630 };

const toMockTimestamp = (seconds) =>
    `00:00:${seconds.toFixed(3).padStart(6, '0')}`;

const mockTrajectoryResults = MOCK_RESPONSE_VARIANTS.map((responseJson, position) => {
    const coordinates = MOCK_TRAJECTORY[position];
    const seconds = position * MOCK_RESULT_INTERVAL_SECONDS;

    return {
        id: position + 2,
        index: position,
        response_json: {
            ...responseJson,
            aircraft: {
                ...responseJson.aircraft,
                altitude: {
                    confiance: 100,
                    unite: 'm',
                    valeur: coordinates.altitude,
                },
                coord: {
                    latitude: { confiance: 100, valeur: coordinates.latitude },
                    longitude: { confiance: 100, valeur: coordinates.longitude },
                },
                vitesse: {
                    confiance: 100,
                    unite: 'km/h',
                    valeur: coordinates.speed,
                },
            },
            objects: responseJson.objects,
            target: {
                ...responseJson.target,
                coord: {
                    latitude: { confiance: 100, valeur: MOCK_TARGET_COORDINATES.latitude },
                    longitude: { confiance: 100, valeur: MOCK_TARGET_COORDINATES.longitude },
                },
            },
            timestamp: toMockTimestamp(seconds),
            timestamp_seconds: seconds,
        },
        treatment_id: 2,
    };
});

export const mockResults = [
    {
        id: 1,
        index: 0,
        response_json: mockTrajectoryResults[0].response_json,
        treatment_id: 1,
        url: 'https://picsum.photos/300/200',
    },
    ...mockTrajectoryResults,
    createMockVideoResult({
        altitude: 82,
        id: 20,
        index: 0,
        latitude: 48.8564,
        longitude: 2.358,
        objects: [
            { confidence: 96, type: 'personne' },
            { confidence: 81, type: 'velo' },
        ],
        speed: 18,
        targetLatitude: MOCK_TARGET_COORDINATES.latitude,
        targetLongitude: MOCK_TARGET_COORDINATES.longitude,
        timestamp: '00:00:00.750',
        treatmentId: 3,
    }),
    createMockVideoResult({
        altitude: 79,
        id: 21,
        index: 1,
        isFreezing: true,
        latitude: 48.8562,
        longitude: 2.359,
        objects: [{ confidence: 67, type: 'camion' }],
        speed: 12,
        targetLatitude: MOCK_TARGET_COORDINATES.latitude,
        targetLongitude: MOCK_TARGET_COORDINATES.longitude,
        timestamp: '00:00:02.250',
        treatmentId: 3,
    }),
    createMockVideoResult({
        altitude: 74,
        id: 22,
        index: 2,
        latitude: 48.8563,
        longitude: 2.3601,
        objects: [{ confidence: 89, type: 'voiture' }],
        speed: 24,
        targetLatitude: MOCK_TARGET_COORDINATES.latitude,
        targetLongitude: MOCK_TARGET_COORDINATES.longitude,
        timestamp: '00:00:05.500',
        treatmentId: 3,
    }),
    createMockVideoResult({
        altitude: 35,
        id: 23,
        index: 0,
        latitude: 48.8567,
        longitude: 2.3611,
        objects: [{ confidence: 94, type: 'bateau' }],
        speed: 42,
        targetLatitude: MOCK_TARGET_COORDINATES.latitude,
        targetLongitude: MOCK_TARGET_COORDINATES.longitude,
        timestamp: '00:00:01.500',
        treatmentId: 4,
    }),
    createMockVideoResult({
        altitude: 28,
        id: 24,
        index: 1,
        isFreezing: true,
        latitude: 48.8574,
        longitude: 2.3619,
        objects: [{ confidence: 58, type: 'oiseau' }],
        speed: 7,
        targetLatitude: MOCK_TARGET_COORDINATES.latitude,
        targetLongitude: MOCK_TARGET_COORDINATES.longitude,
        timestamp: '00:00:04.500',
        treatmentId: 4,
    }),
];
export const mocksFilesTree = [
    {
        extension: 'jpg',
        folder: 'media',
        id: 1,
        name: 'fichier1.jpg',
        size: 6000,
        url: 'https://picsum.photos/300/200',
    },
    {
        extension: 'jpg',
        folder: 'media',
        id: 2,
        name: 'fichier2.jpg',
        size: 6000,
        url: 'https://picsum.photos/300/200',
    },
    {
        extension: 'jpg',
        folder: 'media',
        id: 3,
        name: 'fichier3.jpg',
        size: 6000,
        url: 'https://picsum.photos/300/200',
    },
    {
        children: [
            {
                extension: 'jpg',
                id: 4,
                name: 'fichier4.jpg',
                size: 6000,
                url: 'https://picsum.photos/300/200',
            },
            {
                duration: 10.026667,
                extension: 'mp4',
                id: 5,
                name: 'mov_bbb.mp4',
                size: 60521,
                url: '/dev-media/html/mov_bbb.mp4',
            },
        ],
        folder: 'media',
        name: 'sous-dossier1',
    },
    {
        extension: 'pmtiles',
        folder: 'carto',
        id: 10,
        name: 'fichier10.pmtiles',
        size: 6000,
        url: 'carto/world_10.pmtiles',
    },
    {
        extension: 'geojson',
        folder: 'carto',
        id: 11,
        name: 'fichier11.geojson',
        size: 6000,
        url: 'carto/fichier11.geojson',
    },
    {
        children: [
            {
                extension: 'png',
                id: 12,
                name: 'fichier4.png',
                size: 6000,
                url: 'https://picsum.photos/300/200',
            },
        ],
        folder: 'carto',
        name: 'sous-dossier2',
    },
    {
        extension: 'xyz',
        folder: 'carto',
        id: 13,
        name: 'dossierXYZ',
        size: 6000,
        url: 'carto/dossierXYZ',
    },
];

const statusUpdate = {
    data: {
        status: 'DONE',
        treatment_id: 2,
    },
    event: 'treatment_status',
};

const percentageUpdate = (percentage) => ({
    data: {
        percentage,
        treatment_id: 2,
    },
    event: 'treatment_percentage',
});

export const events = [
    ...Array.from({ length: 50 }, (_, i) => (i + 1) * 2).map(percentageUpdate),
    statusUpdate,
];

export const health = {
    response_health_api_ia: {
        ai_function_loaded: false,
        worker_running: true,
    },
    status_api: true,
    status_api_ia: true,
    status_bdd: true,
    status_storage_s3: true,
};
