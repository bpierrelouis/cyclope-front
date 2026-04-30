import { httpRequest } from './httpClient';

export function createCrudService(endPoint) {
    return {
        getAll() {
            return httpRequest(endPoint);
        },

        getById(id) {
            return httpRequest(`${endPoint}/${id}`);
        },

        create(payload) {
            return httpRequest(endPoint, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
        },

        update(id, payload) {
            return httpRequest(`${endPoint}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });
        },

        remove(id) {
            return httpRequest(`${endPoint}/${id}`, {
                method: 'DELETE',
            });
        },
    };
}
