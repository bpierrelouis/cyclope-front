const createResourceKeys = (resource) => ({
    all: [resource],
    detail: (id) => [resource, 'detail', id],
    list: (search = '') => [resource, 'list', search],
    lists: [resource, 'list'],
});

export const filesQueryKeys = {
    ...createResourceKeys('files'),
    content: (url) => ['files', 'content', url],
    tree: ['files', 'tree'],
};

export const filesMutationKeys = {
    upload: (folder) => ['files', 'upload', folder],
};

export const healthQueryKeys = createResourceKeys('health');

export const mediasQueryKeys = {
    ...createResourceKeys('medias'),
    byMission: (missionId) => ['medias', 'mission', missionId],
    missionLists: ['medias', 'mission'],
};

export const missionsQueryKeys = createResourceKeys('missions');

export const resultsQueryKeys = {
    ...createResourceKeys('results'),
    byTreatment: (treatmentId) => ['results', 'treatment', treatmentId],
    disabledTreatment: (slot) => ['results', 'treatment', 'disabled', slot],
};

export const treatmentsQueryKeys = {
    ...createResourceKeys('treatments'),
    byMedia: (mediaId) => ['treatments', 'media', mediaId],
};
