import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function Modal(props) {
    const { children, openState, onClose } = props;

    const [dialog, setDialog] = useState(null);
    const isControlled = Array.isArray(openState);
    const isOpen = isControlled ? openState[0] : true;

    useEffect(() => {
        if (!dialog) return;
        if (isOpen) dialog.showModal();
        else dialog.close();
    }, [dialog, isOpen]);

    const handleClose = () => {
        if (isControlled) openState[1](false);
        onClose?.();
    };

    return createPortal(
        <dialog
            ref={setDialog}
            className='modal'
            onClose={handleClose}
        >
            {typeof children === 'function' ? children(dialog) : children}
            <form method='dialog' className='modal-backdrop'>
                <button>Fermer</button>
            </form>
        </dialog>,
        document.body,
    );
}
