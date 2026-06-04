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
            method: 'POST',
            body: payload,
        })
            .then(mapper);

    const update = ({ id, data }) =>
        httpRequest(`${endPoint}/${id}`, {
            method: 'PATCH',
            body: data,
        })
            .then(mapper);

    const remove = (id) =>
        httpRequest(`${endPoint}/${id}`, {
            method: 'DELETE',
        });

    return { getAll, getById, create, update, remove };
};
