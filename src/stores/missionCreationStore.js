import { createStore } from 'zustand/vanilla';

import { defaultConfigStore } from './defaultConfigStore';

const initialState = {
    configs: {},
    fileIds: new Set(),
    missionId: null,
    missionName: '',
    uploadFolder: '',
};

export const missionCreationStore = createStore((set, get) => ({
    ...initialState,


    clearSelection: () =>
        set({
            configs: {},
            fileIds: new Set(),
            uploadFolder: '',
        }),


    //Deselect supprime le fichier et la config associée
    deselect: (id) => set((state) => {
        const fileIds = new Set(state.fileIds);
        fileIds.delete(id);

        const configs = { ...state.configs };
        delete configs[id];

        return { configs, fileIds };
    }),


    reset: () => set(initialState),


    select: (file) => get().selectMany([file]),


    selectMany: (files) => set((state) => {
        const fileIds = new Set(state.fileIds);
        const configs = { ...state.configs };
        const { getDefault } = defaultConfigStore.getState();

        for (const file of files) {
            // garde fou ignorant les noeuds sans id
            if (file?.id == null || fileIds.has(file.id)) continue;
            fileIds.add(file.id);
            configs[file.id] = getDefault(file);
        }
        return { configs, fileIds };
    }),


    setMissionId: (id) => set({ missionId: id }),

    setMissionName: (name) => set({ missionName: name }),

    setUploadFolder: (path) => set({ uploadFolder: path }),

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
}));
