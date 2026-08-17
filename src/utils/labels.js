import { ELevelLabel } from '../constants';

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

export const formatTimecode = (time) => {
    const totalSeconds = Math.max(0, Math.floor(time));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((value) => value.toString().padStart(2, '0'))
        .join(':');
};

export const includesIgnoreCase = (str, search) =>
    str.toLowerCase().includes(search.toLowerCase());

export const getConfigDescription = (config) => {
    const {
        processingLevel, frameStep, objectDetectionEnabled, confidenceThreshold,
    } = config;
    return [
        ELevelLabel[processingLevel],
        frameStep && `${frameStep}s`,
        objectDetectionEnabled && `${confidenceThreshold}%`,
    ].filter(Boolean).join(' - ');
};
