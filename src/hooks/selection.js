import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { mediasQueries } from './medias.queries';
import { missionsQueries } from './missions.queries';

const useSelection = (name, getter) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get(name);
    const result = getter(id);

    const setId = (id) => setSearchParams((prev) => {
        prev.set(name, id);
        return prev;
    });

    return [result, setId];
};

const useMissionSelection = () =>
    useSelection('missionId', missionsQueries.useGetById);
const useMediaSelection = () =>
    useSelection('mediaId', mediasQueries.useGetById);

export const useGlobalSelection = () => {
    const [missionResult, setMissionSelection] = useMissionSelection();
    const { data: mission } = missionResult;

    const [mediaResult, setMediaId] = useMediaSelection();
    const { data: media } = mediaResult;

    const mediasResult = mediasQueries.useGetAllByMissionId(mission?.id);
    const { data: medias } = mediasResult;

    // Sélection d'un media par défaut si une mission est sélectionnée sans media
    useEffect(() => {
        if (mission && medias?.length > 0 && !media) {
            setMediaId(medias[0].id);
        }
    }, [mission, medias, media, setMediaId]);

    // Sélection d'une mission si un media est sélectionnée sans mission
    useEffect(() => {
        if (!mission && media) {
            setMissionSelection(media.missionId);
        }
    }, [mission, media, setMissionSelection]);

    return { mission, media, medias };
};
