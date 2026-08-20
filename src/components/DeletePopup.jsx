import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { preventDefault } from '../utils';

export function DeletePopup(props) {
    const {
        title, children, onClose, onDelete,
    } = props;
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    return createPortal(
        <dialog
            ref={dialogRef}
            className='modal'
            onClose={onClose}
        >
            <div className='modal-box'>
                <h3 className='font-bold text-lg'>{title}</h3>
                <p className='py-4'>{children}</p>
                <div className='modal-action'>
                    <button className='btn btn-soft' onClick={preventDefault(onClose)}>
                        Annuler
                    </button>
                    <button className='btn btn-error' onClick={preventDefault(onDelete)}>
                        Supprimer
                    </button>
                </div>
            </div>
            <form method='dialog' className='modal-backdrop'>
                <button onClick={onClose}>Fermer</button>
            </form>
        </dialog>,
        document.body,
    );
}
