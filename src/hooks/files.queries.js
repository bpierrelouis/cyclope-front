import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { filesQueryKeys } from '../constants';
import { filesService } from '../services';
import { createCrudQueries } from './crud.factory';

const service = filesService;

const queries = createCrudQueries(service, filesQueryKeys);

const useGetContent = (url) => useQuery({
    enabled: !!url,
    queryFn: () => service.getContent(url),
    queryKey: filesQueryKeys.content(url),
});

const useCarto = () => useGetContent('carto/world_10.pmtiles');

const useGetTree = () => useQuery({
    queryFn: () => service.getTree(),
    queryKey: filesQueryKeys.tree,
});

const useGetUploadLink = () => useMutation({
    mutationFn: (url) => service.getUploadLink(url),
});

const useUploadFiles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: service.saveFiles,
        onSettled: () => queryClient.invalidateQueries({ queryKey: filesQueryKeys.all }),
    });
};

export const filesQueries = {
    ...queries,
    useCarto,
    useGetContent,
    useGetTree,
    useGetUploadLink,
    useUploadFiles,
};
