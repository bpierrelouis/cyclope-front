export const getMissionDescription = (mission) => {
    return new Date(mission.creationDate).toLocaleString();
};
