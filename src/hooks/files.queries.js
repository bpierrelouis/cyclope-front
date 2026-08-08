import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { filesResourceName, filesService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = filesResourceName;
const service = filesService;

const queries = createCrudQueries(resource, service);

const useGetContent = (url) => useQuery({
    enabled: !!url,
    queryFn: () => service.getContent(url),
    queryKey: [resource, url],
});

const useCarto = () => useGetContent('carto/world_10.pmtiles');

const useGetTree = () => useQuery({
    queryFn: () => service.getTree(),
    queryKey: [resource],
});

const useGetUploadLink = () => useMutation({
    mutationFn: (url) => service.getUploadLink(url),
});

const useUploadFiles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: service.saveFiles,
        onSettled: () => queryClient.invalidateQueries({ queryKey: [resource] }),
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
