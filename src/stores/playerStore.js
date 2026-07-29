import { create } from 'zustand';
import { sortAndMapPoints } from '../utils';

export const usePlayerStore = create((set) => ({
    playing: false,
    currentTime: 0,
    duration: 0,

    media: null,
    treatment: null,
    results: [],
    track: [],

    isMaster: false,

    isMediaOpen: false,
    isPlanOpen: false,
    isTableOpen: false,

    setStatePartial: (data) =>
        set((state) => {
            const newState = {
                ...state,
                ...data,
            };
            newState.track = sortAndMapPoints(newState.results);
            return newState;
        }),
}));