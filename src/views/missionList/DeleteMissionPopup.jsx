import { useEffect, useRef } from 'react';
import { preventDefault } from '../../utils';

export function DeleteMissionPopup({ open, onClose, onConfirm, missionName, mediaCount }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open) dialog.showModal();
        else dialog.close();
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            className='modal'
            onClose={onClose}
            onClick={preventDefault(() => {
            })}
        >
            <div className='modal-box'>
                <h3 className='font-bold text-lg'>Supprimer la mission</h3>

                <div className='py-4'>
                    <p>
                        Voulez-vous vraiment supprimer la mission{' '}
                        <span className='font-semibold'>{missionName}</span> ?
                    </p>
                    <p className='opacity-70 text-sm'>
                        {mediaCount} média{mediaCount > 1 ? 's' : ''} associé
                        {mediaCount > 1 ? 's' : ''}.
                    </p>
                </div>

                <div className='modal-action'>
                    <button className='btn btn-soft' onClick={preventDefault(onClose)}>
                        Annuler
                    </button>
                    <button className='btn btn-error' onClick={preventDefault(onConfirm)}>
                        Supprimer
                    </button>
                </div>
            </div>

            <form method='dialog' className='modal-backdrop'>
                <button onClick={preventDefault(onClose)}>close</button>
            </form>
        </dialog>
    );
}