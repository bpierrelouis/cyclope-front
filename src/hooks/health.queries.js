import { useQuery } from '@tanstack/react-query';

import { healthQueryKeys } from '../constants';
import { getHealth } from '../services';

export const useGetHealth = () => useQuery({
    queryFn: getHealth,
    queryKey: healthQueryKeys.all,
});
