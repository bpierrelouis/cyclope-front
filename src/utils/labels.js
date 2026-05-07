const getItemDescription = (title, count) => {
    if (count === 0) return null;
    return `${count} ${title}${count > 1 ? 's' : ''}`;
};

export const getMissionDescription = (mission) => {
    const nbVideos = mission.medias.filter((m) => m.isVideo).length;
    const nbPhotos = mission.medias.length - nbVideos;

    const videosDescription = getItemDescription('video', nbVideos);
    const photosDescription = getItemDescription('photo', nbPhotos);

    const date = new Date(mission.creationDate).toLocaleString();

    const description = [videosDescription, photosDescription, date].filter(Boolean).join(' · ');

    return description;
};
