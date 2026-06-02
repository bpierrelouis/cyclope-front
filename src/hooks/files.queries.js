import { useQuery } from '@tanstack/react-query';
import { filesResourceName, filesService } from '../services';

const resource = filesResourceName;
const service = filesService;

const useGet = (url) => useQuery({
    queryKey: [resource, url],
    queryFn: () => service.get(url),
    enabled: !!url,
});

const useCarto = () => useGet('carto/world_10.pmtiles');

export const filesQueries = {
    useGet,
    useCarto,
};
