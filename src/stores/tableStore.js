import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

const KEY = 'table-preferences';

// Ajoute ou retire une valeur d'une liste.
const toggleIn = (list, value) =>
    (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

export const tableStore = createStore(persist(
    (set, get) => ({
        filterModel: {},
        hiddenColumnIds: [],

        setFilterModel: (filterModel) => set({ filterModel }),

        showAllColumns: () => set({ hiddenColumnIds: [] }),

        toggleColumn: (colId) =>
            set({ hiddenColumnIds: toggleIn(get().hiddenColumnIds, colId) }),
    }),
    {
        name: KEY,
        partialize: ({ hiddenColumnIds, filterModel }) =>
            ({ filterModel, hiddenColumnIds }),
    },
));

globalThis.addEventListener('storage', (e) => {
    if (e.key === KEY) tableStore.persist.rehydrate();
});
