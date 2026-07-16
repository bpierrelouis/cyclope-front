import { useQuery } from '@tanstack/react-query';
import { getHealth, healthResourceName } from '../services';

export const useGetHealth = () => useQuery({
    queryKey: [healthResourceName],
    queryFn: getHealth,
});
