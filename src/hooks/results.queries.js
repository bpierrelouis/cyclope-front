import { useQuery } from '@tanstack/react-query';
import { resultsResourceName, resultsService } from '../services';
import { sortAndMapPoints } from '../utils';

const resource = resultsResourceName;
const service = resultsService;

const useGetAllPointsByTreatmentId = (treatmentId) => useQuery({
    queryKey: [resource, treatmentId],
    queryFn: () => service.getAll(new URLSearchParams({ treatment_id: treatmentId }))
        .then(sortAndMapPoints),
});

export const resultsQueries = {
    useGetAllPointsByTreatmentId,
};
