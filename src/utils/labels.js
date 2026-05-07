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
