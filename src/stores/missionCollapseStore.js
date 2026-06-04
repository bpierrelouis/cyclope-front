import { create } from 'zustand';

export const useMissionCollapseStore = create((set) => ({
    opened: null,

    toggle: (id) =>
        set((state) => ({
            opened: id === state.opened ? null : id,
        })),
}));
