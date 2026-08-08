import { create } from 'zustand';

import { sortAndMapPoints } from '../utils';

export const usePlayerStore = create((set) => ({
    currentTime: 0,
    duration: 0,
    isMaster: false,

    isMediaOpen: false,
    isPlanOpen: false,
    isTableOpen: false,
    media: null,

    playing: false,

    results: [],
    setStatePartial: (data) =>
        set((state) => {
            const newState = {
                ...state,
                ...data,
            };
            newState.track = sortAndMapPoints(newState.results);
            return newState;
        }),
    track: [],

    treatment: null,
}));