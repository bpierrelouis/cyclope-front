export const filterMissionsByStatus = (missions, status) => {
    if (!status) return missions;
    return missions?.filter((m) => Boolean(m.statuses[status]));
};
