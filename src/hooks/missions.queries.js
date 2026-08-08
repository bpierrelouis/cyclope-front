import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mediasResourceName, missionsResourceName, missionsService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = missionsResourceName;
const service = missionsService;

const queries = createCrudQueries(resource, service);

const useAddMedias = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, medias }) => service.addMedias(id, medias),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [resource] });
            queryClient.invalidateQueries({ queryKey: [resource, id] });
            queryClient.invalidateQueries({ queryKey: [mediasResourceName] });
        },
    });
};

export const missionsQueries = {
    ...queries,
    useAddMedias,
};
