import { usePlayerStore, useTableStore } from '../stores';

const MESSAGE_TYPES = {
    FILTERS_UPDATE: 'FILTERS_UPDATE',
    REQUEST_FILTERS: 'REQUEST_FILTERS',
};

const filtersChannel = new BroadcastChannel('table-filters-channel');

const isSameModel = (a, b) => JSON.stringify(a) === JSON.stringify(b);

class TableService {

    constructor() {
        filtersChannel.onmessage = (event) => {
            const message = event.data;

            switch (message.type) {
                case MESSAGE_TYPES.REQUEST_FILTERS:
                    this.handleFiltersRequest();
                    break;

                case MESSAGE_TYPES.FILTERS_UPDATE:
                    this.setLocalFilterModel(message.payload.filterModel);
                    break;
            }
        };

        this.requestFilters();
    }

    handleFiltersRequest() {
        if (!usePlayerStore.getState().isMaster) return;
        this.broadcastFilterModel(useTableStore.getState().filterModel);
    }

    requestFilters() {
        filtersChannel.postMessage({ type: MESSAGE_TYPES.REQUEST_FILTERS });
    }

    syncFilterModel(filterModel) {
        if (isSameModel(useTableStore.getState().filterModel, filterModel)) return;

        this.setLocalFilterModel(filterModel);
        this.broadcastFilterModel(filterModel);
    }

    setLocalFilterModel(filterModel) {
        useTableStore.getState().setFilterModel(filterModel);
    }

    broadcastFilterModel(filterModel) {
        filtersChannel.postMessage({
            payload: { filterModel },
            type: MESSAGE_TYPES.FILTERS_UPDATE,
        });
    }
}

export const tableService = new TableService();
