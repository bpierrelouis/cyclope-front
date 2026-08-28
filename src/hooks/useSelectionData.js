import { useShallow } from 'zustand/react/shallow';

import { usePlayerStore } from '../stores';
import { mediasQueries } from './medias.queries';
import { missionsQueries } from './missions.queries';
import { treatmentsQueries } from './treatments.queries';
import { useSelectionParams } from './useSelectionParams';

export function useSelectionData() {
    const params = useSelectionParams();
    const {
        isMaster,
        missionId: masterMissionId,
    } = usePlayerStore(useShallow((state) => ({
        isMaster: state.isMaster,
        missionId: state.missionId,
    })));
    const synchronizedMissionId = !isMaster && !params.hasSelection
        ? masterMissionId
        : undefined;
    const isMission = params.isMission
        || Number.isInteger(synchronizedMissionId);

    const selectedTreatmentQuery = treatmentsQueries.useGetById(
        params.treatmentId,
    );
    const selectedTreatment = selectedTreatmentQuery.data;
    const selectedMediaId = params.mediaId ?? selectedTreatment?.mediaId;
    const selectedMediaQuery = mediasQueries.useGetById(selectedMediaId);
    const selectedMedia = selectedMediaQuery.data;
    const selectedMissionId = params.missionId
        ?? synchronizedMissionId
        ?? selectedMedia?.missionId;
    const missionQuery = missionsQueries.useGetById(selectedMissionId);
    const mediasQuery = mediasQueries.useGetAllByMissionId(
        selectedMissionId,
    );
    const mission = missionQuery.data;
    const medias = mediasQuery.data;
    const missionVideo = medias?.find((candidate) => candidate.isVideo);
    const media = selectedMedia ?? missionVideo;
    const defaultTreatmentId = params.treatmentId === undefined && !isMission
        ? media?.lastTreatmentId
        : undefined;
    const defaultTreatmentQuery = treatmentsQueries.useGetById(
        defaultTreatmentId,
    );
    const defaultTreatment = defaultTreatmentQuery.data;
    const queries = [
        selectedTreatmentQuery,
        selectedMediaQuery,
        missionQuery,
        mediasQuery,
        defaultTreatmentQuery,
    ];

    return {
        error: queries.find((query) => query.error)?.error ?? null,
        isLoading: queries.some((query) => query.isLoading),
        isMission,
        media,
        medias,
        mission,
        treatment: selectedTreatment ?? defaultTreatment,
    };
}
