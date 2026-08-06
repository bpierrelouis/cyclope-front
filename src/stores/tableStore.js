import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const KEY = 'table-preferences';

// Ajoute ou retire une valeur d'une liste.
const toggleIn = (list, value) =>
    (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

export const useTableStore = create(persist(
    (set, get) => ({
        hiddenColumnIds: [],
        filterModel: {},

        toggleColumn: (colId) =>
            set({ hiddenColumnIds: toggleIn(get().hiddenColumnIds, colId) }),

        showAllColumns: () => set({ hiddenColumnIds: [] }),

        setFilterModel: (filterModel) => set({ filterModel }),
    }),
    {
        name: KEY,
        partialize: ({ hiddenColumnIds, filterModel }) =>
            ({ hiddenColumnIds, filterModel }),
    },
));

globalThis.addEventListener('storage', (e) => {
    if (e.key === KEY) useTableStore.persist.rehydrate();
});
