import { handlePercentageUpdate, handleStatusUpdate } from '../utils';

class EventsManager {
    es = null;

    connect(queryClient) {
        this.es = new EventSource('/api/event');

        this.es.addEventListener(
            'treatment_status',
            (event) => handleStatusUpdate(event, queryClient),
        );

        this.es.addEventListener(
            'treatment_percentage',
            (event) => handlePercentageUpdate(event, queryClient),
        );
    }

    disconnect() {
        this.es?.close();
    }
}

export const eventsManager = new EventsManager();
