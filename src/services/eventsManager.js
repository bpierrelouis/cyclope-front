import { handlePercentageUpdate, handleStatusUpdate } from '../utils';

export const eventsManager = {
    connect(queryClient) {
        const eventSource = new EventSource('/api/event');

        eventSource.addEventListener(
            'treatment_status',
            (event) => handleStatusUpdate(event, queryClient),
        );

        eventSource.addEventListener(
            'treatment_percentage',
            (event) => handlePercentageUpdate(event, queryClient),
        );

        return () => eventSource.close();
    },
};
