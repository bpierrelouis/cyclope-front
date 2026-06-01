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
