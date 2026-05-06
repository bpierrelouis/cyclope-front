import { httpRequest } from './httpClient';

export const createCrudService = (endPoint) => {

    const getAll = () => httpRequest(endPoint);

    const getById = (id) => httpRequest(`${endPoint}/${id}`);

    const create = (payload) =>
        httpRequest(endPoint, {
            method: 'POST',
            body: JSON.stringify(payload),
        });

    const update = ({ id, data }) =>
        httpRequest(`${endPoint}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

    const remove = (id) =>
        httpRequest(`${endPoint}/${id}`, {
            method: 'DELETE',
        });

    return { getAll, getById, create, update, remove };
};
