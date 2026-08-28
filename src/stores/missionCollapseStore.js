import { createStore } from 'zustand/vanilla';

export const missionCollapseStore = createStore((set) => ({
    opened: null,

    toggle: (id) =>
        set((state) => ({
            opened: id === state.opened ? null : id,
        })),
}));
