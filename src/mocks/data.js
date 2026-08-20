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
        acft: { latitude, longitude },
        altitude: {
            unit: 'm',
            value: altitude,
        },
        deg: { confidence: 1 },
        frame_number: index * 60,
        is_freezing: isFreezing,
        objects,
        speed: {
            unit: 'km/h',
            value: speed,
        },
        tgt: {
            latitude: targetLatitude,
            longitude: targetLongitude,
        },
        timestamp,
    },
    treatment_id: treatmentId,
});

export const mockResults = [
    {
        id: 1,
        index: 0,
        response_json: {
            acft: {
                latitude: 48,
                longitude: 2,
            },
            altitude: {
                unit: 'm',
                value: 300.5,
            },
            deg: {
                confidence: 1,
            },
            frame_number: 0,
            is_freezing: false,
            objects: [
                {
                    confidence: 0.2,
                    type: 'helicoptere',
                },
                {
                    confidence: 0.4,
                    type: 'skis',
                },
            ],
            speed: {
                unit: 'km/h',
                value: 53.2,
            },
            tgt: {
                latitude: 47.5,
                longitude: 2.8,
            },
            timestamp: '00:00:00.000',
        },
        treatment_id: 1,
        url: 'https://picsum.photos/300/200',
    },
    {
        id: 2,
        index: 0,
        response_json: {
            acft: {
                latitude: 48,
                longitude: 2,
            },
            altitude: {
                unit: 'm',
                value: 300.5,
            },
            deg: {
                confidence: 1,
            },
            frame_number: 0,
            is_freezing: false,
            objects: [
                {
                    box: {
                        height: 0.25,
                        width: 0.3,
                        x: 0.1,
                        y: 0.15,
                    },
                    confidence: 0.2,
                    type: 'helicoptere',
                },
                {
                    box: {
                        height: 0.18,
                        width: 0.12,
                        x: 0.55,
                        y: 0.6,
                    },
                    confidence: 0.4,
                    type: 'skis',
                },
            ],
            speed: {
                unit: 'km/h',
                value: 53.2,
            },
            tgt: {
                latitude: 47.5,
                longitude: 2.8,
            },
            timestamp: '00:00:00.000',
        },
        treatment_id: 2,
    },
    {
        id: 3,
        index: 1,
        response_json: {
            acft: {
                latitude: 49,
                longitude: 3,
            },
            altitude: {
                unit: 'm',
                value: 310.2,
            },
            deg: {
                confidence: 0.5,
            },
            frame_number: 60,
            is_freezing: true,
            objects: [
                {
                    box: {
                        height: 0.2,
                        width: 0.25,
                        x: 0.35,
                        y: 0.05,
                    },
                    confidence: 0.55,
                    type: 'avion',
                },
                {
                    box: {
                        height: 0.15,
                        width: 0.1,
                        x: 0.7,
                        y: 0.55,
                    },
                    confidence: 0.1,
                    type: 'skis',
                },
            ],
            speed: {
                unit: 'km/h',
                value: 52.1,
            },
            tgt: {
                latitude: 47.5,
                longitude: 2.8,
            },
            timestamp: '00:00:03.000',
        },
        treatment_id: 2,
    },
    {
        id: 4,
        index: 2,
        response_json: {
            acft: {
                latitude: 50,
                longitude: 3.5,
            },
            altitude: {
                unit: 'm',
                value: 311.5,
            },
            deg: {
                confidence: 1,
            },
            frame_number: 120,
            is_freezing: false,
            objects: [],
            speed: {
                unit: 'km/h',
                value: 51.2,
            },
            tgt: {
                latitude: 47.5,
                longitude: 2.8,
            },
            timestamp: '00:00:06.000',
        },
        treatment_id: 2,
    },
    {
        id: 5,
        index: 3,
        response_json: {
            acft: {
                latitude: 51,
                longitude: 5,
            },
            altitude: {
                unit: 'm',
                value: 311.5,
            },
            deg: {
                confidence: 1,
            },
            frame_number: 180,
            is_freezing: false,
            objects: [],
            speed: {
                unit: 'km/h',
                value: 51.2,
            },
            tgt: {
                latitude: 47.5,
                longitude: 2.8,
            },
            timestamp: '00:00:09.000',
        },
        treatment_id: 2,
    },
    createMockVideoResult({
        altitude: 82,
        id: 6,
        index: 0,
        latitude: 48.8566,
        longitude: 2.3522,
        objects: [
            { confidence: 0.96, type: 'personne' },
            { confidence: 0.81, type: 'velo' },
        ],
        speed: 18,
        targetLatitude: 48.8571,
        targetLongitude: 2.354,
        timestamp: '00:00:00.750',
        treatmentId: 3,
    }),
    createMockVideoResult({
        altitude: 79,
        id: 7,
        index: 1,
        isFreezing: true,
        latitude: 48.8574,
        longitude: 2.355,
        objects: [{ confidence: 0.67, type: 'camion' }],
        speed: 12,
        targetLatitude: 48.858,
        targetLongitude: 2.3565,
        timestamp: '00:00:02.250',
        treatmentId: 3,
    }),
    createMockVideoResult({
        altitude: 74,
        id: 8,
        index: 2,
        latitude: 48.8588,
        longitude: 2.359,
        objects: [{ confidence: 0.89, type: 'voiture' }],
        speed: 24,
        targetLatitude: 48.8594,
        targetLongitude: 2.3602,
        timestamp: '00:00:05.500',
        treatmentId: 3,
    }),
    createMockVideoResult({
        altitude: 70,
        id: 9,
        index: 3,
        latitude: 48.8601,
        longitude: 2.3624,
        speed: 31,
        targetLatitude: 48.8608,
        targetLongitude: 2.364,
        timestamp: '00:00:08.750',
        treatmentId: 3,
    }),
    createMockVideoResult({
        altitude: 35,
        id: 10,
        index: 0,
        latitude: 43.2947,
        longitude: 5.3728,
        objects: [{ confidence: 0.94, type: 'bateau' }],
        speed: 42,
        targetLatitude: 43.293,
        targetLongitude: 5.375,
        timestamp: '00:00:01.500',
        treatmentId: 4,
    }),
    createMockVideoResult({
        altitude: 28,
        id: 11,
        index: 1,
        isFreezing: true,
        latitude: 43.292,
        longitude: 5.378,
        objects: [{ confidence: 0.58, type: 'oiseau' }],
        speed: 7,
        targetLatitude: 43.2905,
        targetLongitude: 5.381,
        timestamp: '00:00:04.500',
        treatmentId: 4,
    }),
    createMockVideoResult({
        altitude: 41,
        id: 12,
        index: 2,
        latitude: 43.288,
        longitude: 5.384,
        objects: [
            { confidence: 0.86, type: 'bateau' },
            { confidence: 0.73, type: 'bouee' },
        ],
        speed: 55,
        targetLatitude: 43.286,
        targetLongitude: 5.387,
        timestamp: '00:00:07.500',
        treatmentId: 4,
    }),
    createMockVideoResult({
        altitude: 46,
        id: 13,
        index: 3,
        latitude: 43.284,
        longitude: 5.39,
        speed: 63,
        targetLatitude: 43.282,
        targetLongitude: 5.393,
        timestamp: '00:00:09.500',
        treatmentId: 4,
    }),
];

export const mocksFilesTree = [
    {
        extension: 'jpg',
        id: 1,
        name: 'fichier1.jpg',
        size: 6000,
        url: 'https://picsum.photos/300/200',
    },
    {
        extension: 'jpg',
        id: 2,
        name: 'fichier2.jpg',
        size: 6000,
        url: 'https://picsum.photos/300/200',
    },
    {
        extension: 'jpg',
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
        name: 'sous-dossier1',
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
