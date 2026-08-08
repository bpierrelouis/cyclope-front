export const mockMissions = [
    {
        creation_date: '2026-04-15T10:00:00Z',
        id: 1,
        medias_status: {
            DONE: 1,
            ERROR: 1,
            PENDING: 1,
            RUNNING: 1,
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
        display_name: 'drone_survey_A.mp4',
        file_id: 5,
        id: 2,
        last_treatment_id: 2,
        last_treatment_status: 'RUNNING',
        mission_id: 1,
        parent_file: {
            duration: 50,
            extension: 'mp4',
            id: 5,
            name: 'mov_bbb.mp4',
            size: 60521,
            url: '/dev-media/html/mov_bbb.mp4',
        },
    },
    {
        display_name: 'drone_survey_A.mp4',
        file_id: 5,
        id: 3,
        // last_treatment_id: 2,
        last_treatment_status: 'PENDING',

        mission_id: 1,

        parent_file: {
            duration: 50,
            extension: 'mp4',
            id: 5,
            name: 'mov_bbb.mp4',
            size: 60521,
            url: '/dev-media/html/mov_bbb.mp4',
        },
    },
    {
        display_name: 'drone_survey_A.mp4',
        file_id: 5,
        id: 4,
        // last_treatment_id: 2,
        last_treatment_status: 'ERROR',

        mission_id: 1,

        parent_file: {
            duration: 50,
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
        status: 'RUNNING',
    },
];

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
        treatment_id: 2,
        url: 'https://picsum.photos/300/200',
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
                    confidence: 0.55,
                    type: 'avion',
                },
                {
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
        url: 'https://picsum.photos/300/200',
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
        url: 'https://picsum.photos/300/200',
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
        url: 'https://picsum.photos/300/200',
    },
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
                duration: 50,
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
