export const mockMissions = [
    {
        id: '1',
        name: 'Survol zone A — 15/04/2026',
        status: 'finished',
        creationDate: '2026-04-15T10:00:00Z',
    },
    {
        id: '2',
        name: 'Parc Nord B',
        status: 'progress',
        creationDate: '2026-04-15T10:00:00Z',
    },
    {
        id: '3',
        name: 'Hangar H',
        status: 'error',
        creationDate: '2026-04-15T10:00:00Z',
    },
];

export const mockMedias = [
    {
        id: '1',
        name: 'IMG_0234.jpg',
        isVideo: false,
        url: 'https://picsum.photos/300/200',
        status: 'finished',
        missionId: 1,
    },
    {
        id: '2',
        name: 'drone_survey_A.mp4',
        isVideo: true,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        status: 'progress',
        percentage: 40,
        missionId: 1,
    },
];

export const mockResults = [
    {
        treatment_id: 1,
        id: 1,
        index: 1,
        response_json: {
            coordinates: [
                { longitude: 2.3522, latitude: 48.8566 },
            ],
        },
    },
    {
        treatment_id: 1,
        id: 2,
        index: 2,
        response_json: {
            coordinates: [
                { longitude: 2.3600, latitude: 48.8600 },
            ],
        },
    },
    {
        treatment_id: 1,
        id: 3,
        index: 3,
        response_json: {
            coordinates: [
                { longitude: 2.3700, latitude: 48.8700 },
            ],
        },
    },
];
