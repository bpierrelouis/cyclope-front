import { http, HttpResponse, sse } from 'msw';
import { mockMedias, mockMissions, mockResults, mocksFilesTree, mockTreatments, percentageUpdates, statusUpdate } from './data';

let missions = [...mockMissions];
let medias = [...mockMedias];
let treatments = [...mockTreatments];
let results = [...mockResults];

const getHandlers = (resource, data) => [

    // GET ALL
    http.get(`/api/${resource}`, async ({ request }) => {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const params = Object.fromEntries(searchParams.entries());
        const entries = Object.entries(params);
        if (!entries.length) return HttpResponse.json(data);
        const items = data.filter((item) => entries.every(([k, v]) => {
            if (Array.isArray(item[k])) {
                return Boolean(item[k].find((iv) => iv == v));
            }
            return item[k] == v;
        }));
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

export const handlers = [
    ...getHandlers('missions', missions),
    ...getHandlers('medias', medias),
    ...getHandlers('treatments', treatments),
    ...getHandlers('results', results),
    ...getHandlers('files/tree', mocksFilesTree),

    http.get('/api/medias/:id/last_treatment', () => {
        return HttpResponse.json(treatments[0]);
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

    sse('/api/event', async ({ client }) => {
        let i = 0;

        const interval = setInterval(() => {
            if (i >= percentageUpdates.length) {
                clearInterval(interval);
                return;
            }

            if (i == Math.floor(percentageUpdates.length / 2)) {
                client.send(statusUpdate);
            }

            client.send(percentageUpdates[i]);
            i++;
        }, 1000);
    }),
];
