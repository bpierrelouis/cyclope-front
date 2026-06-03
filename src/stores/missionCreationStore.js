import { create } from 'zustand';

const toggle = (selection, id) => {
    const next = new Set(selection);
    if (next.has(id)) {
        next.delete(id);
    } else {
        next.add(id);
    }
    return next;
};

export const useMissionCreationStore = create((set) => ({
    fileIds: new Set(),
    configs: {},

    toggle: (id) =>
        set((state) => ({
            ...state,
            fileIds: toggle(state.fileIds, id),
        })),

    clear: () =>
        set((state) => ({
            ...state,
            fileIds: new Set(),
            configs: {},
        })),

    updateConfig: (id, config) =>
        set((state) => ({
            ...state,
            configs: {
                ...state.configs,
                [id]: config,
            },
        })),

    updatePartialConfig: (id, partialConfig) =>
        set((state) => ({
            ...state,
            configs: {
                ...state.configs,
                [id]: {
                    ...state.configs[id],
                    ...partialConfig,
                },
            },
        })),
}));
