import { create } from 'zustand';
import { useDefaultConfigStore } from './defaultConfigStore';

const initialState = {
    fileIds: new Set(),
    configs: {},
    missionId: null,
    missionName: '',
    uploadFolder: '',
};

export const useMissionCreationStore = create((set, get) => ({
    ...initialState,

    setUploadFolder: (path) => set({ uploadFolder: path }),

    setMissionName: (name) => set({ missionName: name }),

    setMissionId: (id) => set({ missionId: id }),

    selectMany: (files) => set((state) => {
        const fileIds = new Set(state.fileIds);
        const configs = { ...state.configs };
        const { getDefault } = useDefaultConfigStore.getState();

        for (const file of files) {
            // garde fou ignorant les noeuds sans id
            if (file?.id == null || fileIds.has(file.id)) continue;
            fileIds.add(file.id);
            configs[file.id] = getDefault(file);
        }
        return { fileIds, configs };
    }),

    select: (file) => get().selectMany([file]),

    //Deselect supprime le fichier et la config associée
    deselect: (id) => set((state) => {
        const fileIds = new Set(state.fileIds);
        fileIds.delete(id);

        const configs = { ...state.configs };
        delete configs[id];

        return { fileIds, configs };
    }),

    toggle: (file) => {
        if (get().fileIds.has(file.id)) get().deselect(file.id);
        else get().select(file);
    },

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

    clearSelection: () =>
        set({
            fileIds: new Set(),
            configs: {},
            uploadFolder: '',
        }),

    reset: () => set(initialState),
}));