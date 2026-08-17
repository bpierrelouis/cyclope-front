import { create } from 'zustand';

export const usePlayerStore = create(() => ({
    currentTime: 0,
    duration: 0,
    isMaster: false,

    isMediaOpen: false,
    isPlanOpen: false,
    isTableOpen: false,

    mediaId: null,
    missionId: null,
    playing: false,
    segmentOffset: 0,

    treatmentId: null,
}));
