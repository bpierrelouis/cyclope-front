import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { filesResourceName, filesService } from '../services';
import { createCrudQueries } from './crud.factory';

const resource = filesResourceName;
const service = filesService;

const queries = createCrudQueries(resource, service);

const useGetContent = (url) => useQuery({
    queryKey: [resource, url],
    queryFn: () => service.getContent(url),
    enabled: !!url,
});

const useCarto = () => useGetContent('carto/world_10.pmtiles');

const useGetTree = () => useQuery({
    queryKey: [resource],
    queryFn: () => service.getTree(),
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
    useGetContent,
    useCarto,
    useGetTree,
    useGetUploadLink,
    useUploadFiles,
};
