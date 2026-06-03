import { useQuery } from '@tanstack/react-query';
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

export const filesQueries = {
    ...queries,
    useGetContent,
    useCarto,
    useGetTree,
};
