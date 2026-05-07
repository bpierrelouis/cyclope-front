import { useSearchParams } from 'react-router';
import { mediasQueries } from './medias.queries';
import { missionsQueries } from './missions.queries';

const useSelection = (name, getter) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get(name);
    const result = getter(id);
    return [result, (id) => setSearchParams({ [name]: id })];
};

const useMissionSelection = () =>
    useSelection('missionId', missionsQueries.useGetById);
const useMediaSelection = () =>
    useSelection('mediaId', mediasQueries.useGetById);

export const useGlobalSelection = () => {
    const [missionResult] = useMissionSelection();
    const [mediaResult] = useMediaSelection();
    const mediasResult = missionsQueries.useGetAllMediasByMissionId(missionResult.data?.id);

    const { data: mission } = missionResult;
    const { data: media } = mediaResult;
    const { data: medias } = mediasResult;

    return { mission, media, medias };
};
