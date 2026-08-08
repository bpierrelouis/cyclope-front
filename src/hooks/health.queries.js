import { useQuery } from '@tanstack/react-query';

import { getHealth, healthResourceName } from '../services';

export const useGetHealth = () => useQuery({
    queryFn: getHealth,
    queryKey: [healthResourceName],
});
