const MOCK_VIDEO_DURATION_SECONDS = 17;

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
            url: '/dev-media/image',
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
            duration: MOCK_VIDEO_DURATION_SECONDS,
            extension: 'mp4',
            id: 5,
            name: 'mov_bbb.mp4',
            size: 60521,
            url: '/dev-media/video',
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
            duration: MOCK_VIDEO_DURATION_SECONDS,
            extension: 'mp4',
            id: 5,
            name: 'mov_bbb.mp4',
            size: 60521,
            url: '/dev-media/video',
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
            duration: MOCK_VIDEO_DURATION_SECONDS,
            extension: 'mp4',
            id: 5,
            name: 'mov_bbb.mp4',
            size: 60521,
            url: '/dev-media/video',
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
            url: '/dev-media/image',
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
            url: '/dev-media/image',
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
            altitude: [{
                confidence: 100,
                unit: 'm',
                value: altitude,
            }],
            coordinate: {
                latitude: { confidence: 100, value: latitude },
                longitude: { confidence: 100, value: longitude },
            },
            speed: [{
                confidence: 100,
                unit: 'km/h',
                value: speed,
            }],
        },
        frame_index: index,
        meta_data: {
            degradation_image: 0,
            is_freezing: isFreezing,
        },
        objects,
        target: {
            coordinate: {
                latitude: { confidence: 100, value: targetLatitude },
                longitude: { confidence: 100, value: targetLongitude },
            },
        },
        timestamp,
        timestamp_seconds: null,
    },
    treatment_id: treatmentId,
});

const MOCK_RESULT_INTERVAL_SECONDS = 2.5;
const MOCK_VIDEO_HEIGHT = 1080;
const MOCK_VIDEO_WIDTH = 1920;
const PREVIOUS_MOCK_VIDEO_HEIGHT = 176;
const PREVIOUS_MOCK_VIDEO_WIDTH = 320;

const scaleVideoX = (value) =>
    Math.round(value * MOCK_VIDEO_WIDTH / PREVIOUS_MOCK_VIDEO_WIDTH);
const scaleVideoY = (value) =>
    Math.round(value * MOCK_VIDEO_HEIGHT / PREVIOUS_MOCK_VIDEO_HEIGHT);

const createMockDetection = ({
    boxIndex = 0,
    classId,
    confidence,
    scaleToVideo = true,
    type,
    x1,
    x2,
    y1,
    y2,
}) => {
    const left = scaleToVideo ? scaleVideoX(x1) : x1;
    const right = scaleToVideo ? scaleVideoX(x2) : x2;
    const top = scaleToVideo ? scaleVideoY(y1) : y1;
    const bottom = scaleToVideo ? scaleVideoY(y2) : y2;

    return {
        bbox: {
            height: bottom - top,
            width: right - left,
            x1: left,
            x2: right,
            y1: top,
            y2: bottom,
        },
        box_index: boxIndex,
        class_id: classId,
        confidence,
        type,
    };
};

const MOCK_AIRPLANE_DETECTIONS = [
    createMockDetection({
        classId: 4,
        confidence: 70.3,
        type: 'avion',
        x1: 72,
        x2: 238,
        y1: 38,
        y2: 122,
    }),
    createMockDetection({
        boxIndex: 1,
        classId: 4,
        confidence: 17.75,
        type: 'avion',
        x1: 248,
        x2: 306,
        y1: 55,
        y2: 108,
    }),
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
                altitude: [{
                    confidence: 100,
                    unit: 'm',
                    value: coordinates.altitude,
                }],
                coordinate: {
                    latitude: { confidence: 100, value: coordinates.latitude },
                    longitude: { confidence: 100, value: coordinates.longitude },
                },
                speed: [{
                    confidence: 100,
                    unit: 'km/h',
                    value: coordinates.speed,
                }],
            },
            objects: responseJson.objects,
            target: {
                ...responseJson.target,
                coordinate: {
                    latitude: { confidence: 100, value: MOCK_TARGET_COORDINATES.latitude },
                    longitude: { confidence: 100, value: MOCK_TARGET_COORDINATES.longitude },
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
        response_json: {
            ...mockTrajectoryResults[0].response_json,
            objects: [createMockDetection({
                classId: 4,
                confidence: 70.3,
                scaleToVideo: false,
                type: 'avion',
                x1: 72,
                x2: 238,
                y1: 38,
                y2: 122,
            })],
        },
        treatment_id: 1,
    },
    ...mockTrajectoryResults,
    createMockVideoResult({
        altitude: 82,
        id: 20,
        index: 0,
        latitude: 48.8564,
        longitude: 2.358,
        objects: [
            createMockDetection({
                classId: 0,
                confidence: 96,
                type: 'personne',
                x1: 35,
                x2: 90,
                y1: 30,
                y2: 160,
            }),
            createMockDetection({
                boxIndex: 1,
                classId: 1,
                confidence: 81,
                type: 'velo',
                x1: 80,
                x2: 180,
                y1: 85,
                y2: 165,
            }),
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
        objects: [createMockDetection({
            classId: 2,
            confidence: 67,
            type: 'camion',
            x1: 150,
            x2: 300,
            y1: 60,
            y2: 160,
        })],
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
        objects: [createMockDetection({
            classId: 3,
            confidence: 89,
            type: 'voiture',
            x1: 105,
            x2: 240,
            y1: 85,
            y2: 158,
        })],
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
        objects: [createMockDetection({
            classId: 5,
            confidence: 94,
            type: 'bateau',
            x1: 55,
            x2: 270,
            y1: 75,
            y2: 160,
        })],
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
        objects: [createMockDetection({
            classId: 6,
            confidence: 58,
            type: 'oiseau',
            x1: 190,
            x2: 255,
            y1: 25,
            y2: 75,
        })],
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
        url: '/dev-media/image',
    },
    {
        extension: 'jpg',
        folder: 'media',
        id: 2,
        name: 'fichier2.jpg',
        size: 6000,
        url: '/dev-media/image',
    },
    {
        extension: 'jpg',
        folder: 'media',
        id: 3,
        name: 'fichier3.jpg',
        size: 6000,
        url: '/dev-media/image',
    },
    {
        children: [
            {
                extension: 'jpg',
                id: 4,
                name: 'fichier4.jpg',
                size: 6000,
                url: '/dev-media/image',
            },
            {
                duration: MOCK_VIDEO_DURATION_SECONDS,
                extension: 'mp4',
                id: 5,
                name: 'mov_bbb.mp4',
                size: 60521,
                url: '/dev-media/video',
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
                url: '/dev-media/image',
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
