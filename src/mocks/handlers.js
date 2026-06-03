import { http, HttpResponse } from 'msw';
import { mockMedias, mockMissions, mockResults, mocksFilesTree } from './data';

let missions = [...mockMissions];
let medias = [...mockMedias];
let results = [...mockResults];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const getHandlers = (resource, data) => [

    // GET ALL
    http.get(`/api/${resource}`, async ({ request }) => {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const params = Object.fromEntries(searchParams.entries());
        const entries = Object.entries(params);
        if (!entries.length) return HttpResponse.json(data);
        const items = data.filter((item) => entries.every(([k, v]) => item[k] == v));
        return HttpResponse.json(items);
    }),

    // GET BY ID
    http.get(`/api/${resource}/:id`, ({ params }) => {
        const target = data.find(item => item.id === params.id);

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
        const index = data.findIndex(({ id }) => id === params.id);
        const updated = { ...data[index], ...changes };
        data[index] = updated;
        return HttpResponse.json(updated);
    }),

    // DELETE
    http.delete(`/api/${resource}/:id`, ({ params }) => {
        const index = data.findIndex(item => item.id === params.id);

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
    ...getHandlers('results', results),
    ...getHandlers('files/tree', mocksFilesTree),
];
