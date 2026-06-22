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

export const useMissionCreationStore = create((set, get) => ({
    fileIds: new Set(),
    configs: {},
    missionId: null,

    toggle: (id) =>
        set((state) => ({
            fileIds: toggle(state.fileIds, id),
        })),

    clear: () =>
        set({
            fileIds: new Set(),
            configs: {},
        }),

    updateConfig: (id, config) =>
        set((state) => ({
            configs: {
                ...state.configs,
                [id]: config,
            },
        })),

    updatePartialConfig: (id, partialConfig) =>
        get().updateConfig(id, {
            ...get().configs[id],
            ...partialConfig,
        }),

    setMissionId: (id) =>
        set(() => ({ missionId: id })),
}));
