import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
    playing: false,
    currentTime: 0,
    duration: 0,
    media: null,
    isMaster: false,

    isMediaOpen: false,
    isPlanOpen: false,
    isTableOpen: false,

    setStatePartial: (data) =>
        set((state) => ({
            ...state,
            ...data,
        })),
}));