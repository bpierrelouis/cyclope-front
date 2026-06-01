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
    const [missionResult] = useMissionSelection();
    const [mediaResult, setMediaId] = useMediaSelection();
    const mediasResult = mediasQueries.useGetAllByMissionId(missionResult.data?.id);

    const { data: mission } = missionResult;
    const { data: media } = mediaResult;
    const { data: medias } = mediasResult;

    useEffect(() => {
        if (mission && medias?.length > 0 && !media) {
            setMediaId(medias[0].id);
        }
    }, [mission, medias, media, setMediaId]);

    return { mission, media, medias };
};
