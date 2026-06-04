import { useEffect, useMemo, useRef } from 'react';
import { mediasQueries, missionsQueries } from '../../hooks';
import { preventDefault } from '../../utils';

export function DeleteMissionPopup(props) {
    const { mission, openState } = props;
    const [isModalOpen, setIsModalOpen] = openState;

    const dialogRef = useRef(null);
    const { data: medias } = mediasQueries.useGetAllByMissionId(mission.id);
    const deleteMutation = missionsQueries.useDelete();

    const mediaCount = medias?.length ?? 0;

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isModalOpen) dialogRef.current.showModal();
        else dialog.close();
    }, [isModalOpen]);

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

    const handleClose = () => setIsModalOpen(false);
    const handleDelete = () => deleteMutation.mutate(mission.id);

    return (
        <dialog
            ref={dialogRef}
            className='modal'
        >
            <div className='modal-box'>
                <h3 className='font-bold text-lg'>{mission.name}</h3>
                <div className='py-4'>
                    <p>Voulez-vous vraiment supprimer cette mission ?<br />{content}</p>
                </div>
                <div className='modal-action'>
                    <button className='btn btn-soft' onClick={preventDefault(handleClose)}>
                        Annuler
                    </button>
                    <button className='btn btn-error' onClick={preventDefault(handleDelete)}>
                        Supprimer
                    </button>
                </div>
            </div>
        </dialog>
    );
}