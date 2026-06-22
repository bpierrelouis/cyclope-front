import { Media } from '../models';
import { mediasResourceName } from '../services';
import { convertKeysFromSnakeToCamelCase } from './request';

const updateMedia = (queryClient, lastTreatmentId, partial) =>
    queryClient.setQueriesData(
        { queryKey: [mediasResourceName, 'mission'] },
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
};

export const handlePercentageUpdate = (event, queryClient) => {
    const data = parseEvent(event);
    updateMedia(
        queryClient,
        data.treatmentId,
        { percentage: data.percentage },
    );
};
