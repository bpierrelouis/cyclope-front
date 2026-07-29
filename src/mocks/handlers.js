import { http, HttpResponse, sse } from 'msw';
import { events, health, mockMedias, mockMissions, mockResults, mocksFilesTree, mockTreatments } from './data';

let missions = [...mockMissions];
let medias = [...mockMedias];
let treatments = [...mockTreatments];
let results = [...mockResults];

// --- Helpers arbre de fichiers ---

const flattenTree = (nodes) =>
    nodes.flatMap((node) => (node.children ? flattenTree(node.children) : [node]));

let nextFileId = Math.max(0, ...flattenTree(mocksFilesTree).map((file) => file.id)) + 1;
let nextMissionId = Math.max(0, ...missions.map((mission) => Number(mission.id))) + 1;
let nextMediaId = Math.max(0, ...medias.map((media) => media.id)) + 1;

// Retire le préfixe "files/" et sépare les dossiers du nom de fichier.
const parseFilePath = (url) => {
    const segments = url.replace(/^files\//, '').split('/').filter(Boolean);
    const fileName = segments.pop();
    return { folders: segments, fileName };
};

// Descend dans l'arbre en créant les dossiers manquants, renvoie le tableau d'enfants cible.
const resolveFolderChildren = (folders) => {
    let children = mocksFilesTree;
    for (const name of folders) {
        let folder = children.find((node) => node.children && node.name === name);
        if (!folder) {
            folder = { name, children: [] };
            children.push(folder);
        }
        children = folder.children;
    }
    return children;
};

// Supprime un fichier n'importe où dans l'arbre (recherche récursive).
const removeFileFromTree = (nodes, id) => {
    const index = nodes.findIndex((node) => !node.children && node.id == id);
    if (index !== -1) {
        nodes.splice(index, 1);
        return true;
    }
    return nodes.some((node) => node.children && removeFileFromTree(node.children, id));
};

const findFileInTree = (id) =>
    flattenTree(mocksFilesTree).find((file) => file.id == id);

// Crée les médias d'une mission à partir des fichiers de l'arbre.
const createMedias = (missionId, items = []) =>
    items.map((item) => {
        const fileId = Number(item.file_id);
        const file = findFileInTree(fileId);
        const media = {
            id: nextMediaId++,
            display_name: item.display_name,
            mission_id: Number(missionId),
            file_id: fileId,
            parent_file: file ?? null,
            last_treatment_status: 'PENDING',
        };
        medias.push(media);
        return media;
    });

const getHandlers = (resource, data) => [

    // GET ALL
    http.get(`/api/${resource}`, async ({ request }) => {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        const keys = [...new Set(searchParams.keys())];

        if (!keys.length) {
            return HttpResponse.json(data);
        }

        const items = data.filter((item) =>
            keys.every((key) => {
                const values = searchParams.getAll(key);

                return values.some((value) => {
                    const itemValue = item[key];

                    if (Array.isArray(itemValue)) {
                        return itemValue.some((iv) => String(iv) === value);
                    }

                    return String(itemValue) === value;
                });
            }),
        );

        return HttpResponse.json(items);
    }),

    // GET BY ID
    http.get(`/api/${resource}/:id`, ({ params }) => {
        const target = data.find(item => item.id == params.id);

        if (!target) {
            return HttpResponse.json(
                { message: `${resource} not found` },
                { status: 404 },
            );
        }

        return HttpResponse.json(target);
    }),

    // UPDATE
    http.patch(`/api/${resource}/:id`, async ({ params, request }) => {
        const changes = await request.clone().json();
        const index = data.findIndex(({ id }) => id == params.id);

        if (index === -1) {
            return HttpResponse.json(
                { message: `${resource} not found` },
                { status: 404 },
            );
        }

        const updated = { ...data[index], ...changes };
        data[index] = updated;
        return HttpResponse.json(updated);
    }),

    // DELETE
    http.delete(`/api/${resource}/:id`, ({ params }) => {
        const index = data.findIndex(item => item.id == params.id);

        if (index === -1) {
            return HttpResponse.json(
                { message: `${resource} not found` },
                { status: 404 },
            );
        }

        data.splice(index, 1);

        return new HttpResponse(null, {
            status: 204,
        });
    }),
];

const eventsSender = (client, interval, data) => {
    let i = 0;

    const func = setInterval(() => {
        if (i >= data.length) {
            clearInterval(func);
            return;
        }

        client.send(data[i]);
        i++;
    }, interval);
};

const applyTreatmentStatus = ({ treatment_id: treatmentId, status }) => {
    const treatment = treatments.find((item) => item.id === treatmentId);
    if (!treatment || treatment.status === status) return;

    const media = medias.find((item) => item.id === treatment.media_id);
    const previousStatus = media?.last_treatment_status ?? treatment.status;

    treatment.status = status;

    if (!media) return;

    media.last_treatment_status = status;
    if (status === 'DONE') media.percentage = 100;

    const mission = missions.find((item) => item.id === media.mission_id);
    if (!mission) return;

    mission.medias_status = {
        ...mission.medias_status,
        [previousStatus]: Math.max(0, (mission.medias_status?.[previousStatus] ?? 0) - 1),
        [status]: (mission.medias_status?.[status] ?? 0) + 1,
    };
};

export const handlers = [
    http.get('/api/health', () => {
        return HttpResponse.json(health);
    }),

    ...getHandlers('missions', missions),
    ...getHandlers('medias', medias),
    ...getHandlers('treatments', treatments),
    ...getHandlers('results', results),
    ...getHandlers('files/tree', mocksFilesTree),

    http.get('/api/medias/:id/last_treatment', ({ params }) => {
        const media = medias.find((item) => item.id === Number(params.id));
        const treatment = treatments.find((item) =>
            item.id === media?.last_treatment_id && item.media_id === media.id,
        );

        if (!treatment) {
            return HttpResponse.json(
                { message: 'treatment not found' },
                { status: 404 },
            );
        }

        return HttpResponse.json(treatment);
    }),

    http.get('/api/files/download', ({ request }) => {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const target = searchParams.get('url');
        return HttpResponse.json({
            url: target,
            download_url: target,
        });
    }),

    // --- Partie "new" : upload, fichiers, missions ---

    // Lien d'upload présigné : renvoie une URL de PUT factice interceptée juste en dessous.
    http.get('/api/files/upload', ({ request }) => {
        const url = new URL(request.url).searchParams.get('url');
        return HttpResponse.json({
            url,
            upload_url: `/api/s3-upload?url=${encodeURIComponent(url)}`,
        });
    }),

    // Faux S3 : accepte le PUT sans rien stocker.
    http.put('/api/s3-upload', () => new HttpResponse(null, { status: 200 })),

    // Création d'un fichier : insertion dans l'arbre au bon endroit,
    http.post('/api/files', async ({ request }) => {
        const body = await request.json();
        const { folders, fileName } = parseFilePath(body.url ?? body.name);
        const children = resolveFolderChildren(folders);

        const file = {
            id: nextFileId++,
            name: body.name ?? fileName,
            url: body.url,
            size: body.size,
            extension: body.extension,
            duration: body.duration,
        };
        children.push(file);

        return HttpResponse.json(file, { status: 201 });
    }),

    // Suppression d'un fichier n'importe où dans l'arbre.
    http.delete('/api/files/:id', ({ params }) => {
        const removed = removeFileFromTree(mocksFilesTree, params.id);

        if (!removed) {
            return HttpResponse.json(
                { message: 'file not found' },
                { status: 404 },
            );
        }

        return new HttpResponse(null, { status: 204 });
    }),

    // Création d'une mission avec ses médias.
    http.post('/api/missions', async ({ request }) => {
        const body = await request.json();
        const id = nextMissionId++;
        const createdMedias = createMedias(id, body.medias);

        const mission = {
            id,
            name: body.name,
            creation_date: new Date().toISOString(),
            medias_status: { PENDING: createdMedias.length },
        };
        missions.push(mission);

        return HttpResponse.json(mission, { status: 201 });
    }),

    // Ajout de médias à une mission existante.
    http.post('/api/missions/:id/medias', async ({ params, request }) => {
        const body = await request.json();
        const mission = missions.find((item) => item.id == params.id);

        if (!mission) {
            return HttpResponse.json(
                { message: 'mission not found' },
                { status: 404 },
            );
        }

        const createdMedias = createMedias(mission.id, body.medias);
        mission.medias_status = {
            ...mission.medias_status,
            PENDING: (mission.medias_status?.PENDING ?? 0) + createdMedias.length,
        };

        return HttpResponse.json(mission);
    }),

    sse('/api/event', async ({ client }) => {
        const statusEvent = events.find((event) => event.event === 'treatment_status');
        if (statusEvent) {
            setTimeout(() => applyTreatmentStatus(statusEvent.data), events.length * 200);
        }
        eventsSender(client, 200, events);
    }),

    sse('/api/treatments/:id/results/stream', async ({ client, params }) => {
        const items = results.filter(item => item.treatment_id == params.id);
        const events = items.map((data) => ({
            event: 'treatment_result',
            data,
        }));
        eventsSender(client, 500, events);
    }),
];
