import { arrayMapper } from '../utils';
import { httpRequest } from './httpClient';

export const createCrudService = (
    endPoint,
    mapper = (element) => element,
) => {
    const getAll = (urlSearchParams) =>
        httpRequest(`${endPoint}?${urlSearchParams || ''}`)
            .then((data) => arrayMapper(data, mapper));

    const getById = (id) =>
        httpRequest(`${endPoint}/${id}`)
            .then(mapper);

    const create = (payload) =>
        httpRequest(endPoint, {
            body: payload,
            method: 'POST',
        })
            .then(mapper);

    const update = ({ id, data }) =>
        httpRequest(`${endPoint}/${id}`, {
            body: data,
            method: 'PATCH',
        })
            .then(mapper);

    const remove = (id) =>
        httpRequest(`${endPoint}/${id}`, {
            method: 'DELETE',
        });

    return {
        create, getAll, getById, remove, update,
    };
};
