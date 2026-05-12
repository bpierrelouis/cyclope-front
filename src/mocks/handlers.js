import { http, HttpResponse } from 'msw';
import { mockMedias, mockMissions } from './data';

let missions = [...mockMissions];
let medias = [...mockMedias];

const getHandlers = (resource, data) => [

    // GET ALL
    http.get('/api/' + resource, () => {
        return HttpResponse.json(data);
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

    // GET MEDIAS BY MISSION ID
    http.get('/api/missions/:id/medias', () => {
        return HttpResponse.json(medias);
    }),
];
