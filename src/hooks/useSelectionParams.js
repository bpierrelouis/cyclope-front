import { useSearchParams } from 'react-router';

const parseId = (value) => {
    const id = Number(value);

    return Number.isInteger(id) && id > 0 ? id : undefined;
};

export function useSelectionParams() {
    const [searchParams] = useSearchParams();
    const mediaId = parseId(searchParams.get('media'));
    const missionId = parseId(searchParams.get('mission'));
    const treatmentId = parseId(searchParams.get('treatment'));

    return {
        hasSelection: [mediaId, missionId, treatmentId].some(
            (id) => id !== undefined,
        ),
        isMission: missionId !== undefined,
        mediaId,
        missionId,
        treatmentId,
    };
}
