import { http, HttpResponse } from 'msw';
import { mockMedias, mockMissions, mockResults, mocksFilesTree, mockTreatments } from './data';

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
];
