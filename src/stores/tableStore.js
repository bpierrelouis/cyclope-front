import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const KEY = 'table-preferences';

// Ajoute ou retire une valeur d'une liste.
const toggleIn = (list, value) =>
    (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

export const useTableStore = create(persist(
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
    if (e.key === KEY) useTableStore.persist.rehydrate();
});
