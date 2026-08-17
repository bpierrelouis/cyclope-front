import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mediasQueryKeys, missionsQueryKeys } from '../constants';
import { missionsService } from '../services';
import { createCrudQueries } from './crud.factory';

const service = missionsService;

const queries = createCrudQueries(service, missionsQueryKeys);

const useAddMedias = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, medias }) => service.addMedias(id, medias),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: missionsQueryKeys.lists });
            queryClient.invalidateQueries({ queryKey: missionsQueryKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: mediasQueryKeys.byMission(id) });
        },
    });
};

export const missionsQueries = {
    ...queries,
    useAddMedias,
};
