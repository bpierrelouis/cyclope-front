export const mockMissions = [
    {
        id: '1',
        name: 'Survol zone A — 15/04/2026',
        creation_date: '2026-04-15T10:00:00Z',
        medias_status: ['DONE', 'RUNNING', 'ERROR'],
    },
    {
        id: '2',
        name: 'Parc Nord B',
        creation_date: '2026-04-15T10:00:00Z',
        medias_status: ['RUNNING', 'PENDING'],
    },
    {
        id: '3',
        name: 'Hangar H',
        creation_date: '2026-04-15T10:00:00Z',
        medias_status: ['ERROR'],
    },
];

export const mockMedias = [
    {
        id: 1,
        display_name: 'IMG_0234.jpg',
        mission_id: 1,
        file_id: 1,
        parent_file: {
            name: 'IMG_0234',
            url: 'https://picsum.photos/300/200',
            size: 5201,
            extension: 'jpg',
        },
        last_treatment_id: 1,
        last_treatment_status: 'DONE',
    },
    {
        id: 2,
        display_name: 'drone_survey_A.mp4',
        mission_id: 1,
        file_id: 2,
        parent_file: {
            name: 'mov_bbb',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            size: 60521,
            extension: 'mp4',
            duration: 50,
        },
        last_treatment_id: 2,
        last_treatment_status: 'RUNNING',
    },
];

export const mockTreatments = [
    {
        id: 1,
        creation_date: '2026-04-15T10:00:00Z',
        media_id: 2,
        status: 'DONE',
        config: {},
    },
    {
        id: 2,
        creation_date: '2026-04-15T10:00:00Z',
        media_id: 1,
        status: 'RUNNING',
        config: {},
    },
];

export const mockResults = [
    {
        treatment_id: 1,
        id: 1,
        index: 1,
        url: 'https://picsum.photos/300/200',
        response_json: {
            frame_number: 60,
            timestamp: '00:01:00.000',
            coordinates: [
                {
                    longitude: 2,
                    latitude: 48,
                    unit: 'deg',
                },
            ],
            altitude: {
                value: 300.5,
                unit: 'm',
            },
            speed: {
                value: 53.2,
                unit: 'km/h',
            },
            objects: [
                {
                    type: 'helicoptere',
                    confidence: 0.2,
                },
                {
                    type: 'skis',
                    confidence: 0.4,
                },
            ],
        },
    },
    {
        treatment_id: 1,
        id: 2,
        index: 2,
        url: 'https://picsum.photos/300/200',
        response_json: {
            frame_number: 120,
            timestamp: '00:02:00.000',
            coordinates: [
                {
                    longitude: 3,
                    latitude: 49,
                    unit: 'deg',
                },
            ],
            altitude: {
                value: 310.2,
                unit: 'm',
            },
            speed: {
                value: 52.1,
                unit: 'km/h',
            },
            objects: [
                {
                    type: 'avion',
                    confidence: 0.55,
                },
                {
                    type: 'skis',
                    confidence: 0.1,
                },
            ],
        },
    },
    {
        treatment_id: 1,
        id: 3,
        index: 3,
        url: 'https://picsum.photos/300/200',
        response_json: {
            frame_number: 180,
            timestamp: '00:03:00.000',
            coordinates: [
                {
                    longitude: 3.5,
                    latitude: 50,
                    unit: 'deg',
                },
            ],
            altitude: {
                value: 311.5,
                unit: 'm',
            },
            speed: {
                value: 51.2,
                unit: 'km/h',
            },
            objects: [],
        },
    },
    {
        treatment_id: 2,
        id: 4,
        index: 1,
        url: 'https://picsum.photos/300/200',
        response_json: {
            frame_number: 0,
            timestamp: '00:00:00.000',
            coordinates: [
                {
                    longitude: 2,
                    latitude: 48,
                    unit: 'deg',
                },
            ],
            altitude: {
                value: 300.5,
                unit: 'm',
            },
            speed: {
                value: 53.2,
                unit: 'km/h',
            },
            objects: [
                {
                    type: 'helicoptere',
                    confidence: 0.2,
                },
                {
                    type: 'skis',
                    confidence: 0.4,
                },
            ],
        },
    },
];

export const mocksFilesTree = [
    {
        id: 1,
        name: 'fichier1.jpg',
        url: 'https://picsum.photos/300/200',
        size: 6000,
        extension: 'jpg',
    },
    {
        id: 2,
        name: 'fichier2.jpg',
        url: 'https://picsum.photos/300/200',
        size: 6000,
        extension: 'jpg',
    },
    {
        id: 3,
        name: 'fichier3.jpg',
        url: 'https://picsum.photos/300/200',
        size: 6000,
        extension: 'jpg',
    },
    {
        name: 'sous-dossier1',
        children: [
            {
                id: 4,
                name: 'fichier4.jpg',
                url: 'https://picsum.photos/300/200',
                size: 6000,
                extension: 'jpg',
            },
            {
                id: 5,
                name: 'mov_bbb.mp4',
                url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                size: 8000,
                extension: 'mp4',
                duration: 50,
            },
        ],
    },
];

export const statusUpdate = {
    event: 'treatment_status',
    data: {
        treatment_id: 1,
        status: 'ERROR',
    },
};

const percentageUpdate = (percentage) => ({
    event: 'treatment_percentage',
    data: {
        treatment_id: 2,
        percentage,
    },
});

export const percentageUpdates = Array.from({ length: 10 }, (_, i) => i * 10).map(percentageUpdate);
