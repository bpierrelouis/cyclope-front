import {
    mediasQueryKeys,
    missionsQueryKeys,
    treatmentsQueryKeys,
} from '../constants';
import { Media } from '../models';
import { convertKeysFromSnakeToCamelCase } from './request';

const updateMedia = (queryClient, lastTreatmentId, partial) =>
    queryClient.setQueriesData(
        { queryKey: mediasQueryKeys.missionLists },
        (old) => old?.map((m) =>
            m.lastTreatmentId === lastTreatmentId ? new Media({ ...m.meta, ...partial }) : m),
    );

export const parseEvent = (event) => {
    const data = JSON.parse(event.data);
    return convertKeysFromSnakeToCamelCase(data);
};

export const handleStatusUpdate = (event, queryClient) => {
    const data = parseEvent(event);
    updateMedia(
        queryClient,
        data.treatmentId,
        { lastTreatmentStatus: data.status },
    );
    queryClient.invalidateQueries({ queryKey: missionsQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: treatmentsQueryKeys.all });
};

export const handlePercentageUpdate = (event, queryClient) => {
    const data = parseEvent(event);
    updateMedia(
        queryClient,
        data.treatmentId,
        { percentage: data.percentage },
    );
};
