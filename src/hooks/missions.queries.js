import { useMutation } from '@tanstack/react-query';
import { missionsResourceName, missionsService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = missionsResourceName;
const service = missionsService;

const queries = createCrudQueries(resource, service);

const useAddMedias = () => useMutation({
    mutationFn: ({ id, medias }) => service.addMedias(id, medias),
});

export const missionsQueries = {
    ...queries,
    useAddMedias,
};
