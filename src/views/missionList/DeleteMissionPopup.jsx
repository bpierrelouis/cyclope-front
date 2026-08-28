import { useMemo } from 'react';

import { DeletePopup } from '../../components';
import { mediasQueries, missionsQueries } from '../../hooks';

export function DeleteMissionPopup(props) {
    const { mission, onClose } = props;

    const { data: medias } = mediasQueries.useGetAllByMissionId(mission.id);
    const deleteMutation = missionsQueries.useDelete();

    const mediaCount = medias?.length ?? 0;

    const content = useMemo(() => {
        let text = 'Cette action entrainera la suppression ';
        if (mediaCount > 1) {
            text += `des ${mediaCount} médias associés.`;
        } else if (mediaCount === 1) {
            text += 'd\'un média associé.';
        } else {
            text += 'd\'aucun média associé.';
        }
        return text;
    }, [mediaCount]);

    const handleDelete = () => deleteMutation.mutate(mission.id);

    return (
        <DeletePopup
            title={mission.name}
            onClose={onClose}
            onDelete={handleDelete}
        >
            Voulez-vous vraiment supprimer cette mission ?<br />{content}
        </DeletePopup>
    );
}
