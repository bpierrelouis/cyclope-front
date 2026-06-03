export const getMissionDescription = (mission) => {
    return new Date(mission.creationDate).toLocaleString();
};

export const formatTime = (time) => {
    if (!time) return '00:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
};

export const formatForExtractionFrame = (intervalSec) => {
    if (intervalSec < 1) return `${(1 / intervalSec).toFixed(1)} frames/s`;
    if (intervalSec < 60) return `1 frame / ${intervalSec.toFixed(1)} s`;
    if (intervalSec < 3600) return `1 frame / ${(intervalSec / 60).toFixed(1)} min`;
    return `1 frame / ${(intervalSec / 3600).toFixed(1)} h`;
};