import { useState } from 'react';
import { createPortal } from 'react-dom';

import { downloadDataUrl, preventDefault } from '../utils';

export function CaptureDialog(props) {
    const { capture, onClose } = props;

    const [name, setName] = useState(() => capture.filename.replace(/\.png$/i, '') ?? '');

    const handleConfirm = () => {
        const filename = `${name.trim() || 'capture'}.png`;
        downloadDataUrl(capture.dataUrl, filename);
        onClose();
    };

    return createPortal (
        <dialog className='modal modal-open'>
            <div className='modal-box'>
                <h3 className='font-bold text-lg'>Enregistrer la capture</h3>

                <div className='flex flex-col gap-3 py-4'>
                    {capture && (
                        <img
                            src={capture.dataUrl}
                            alt='capture'
                            className='rounded-lg w-full max-h-[55vh] object-contain'
                        />
                    )}

                    <label className='flex items-center gap-2'>
                        <span className='text-sm shrink-0'>Nom</span>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full input input-sm'
                        />
                        <span className='text-sm text-base-content/50 shrink-0'>.png</span>
                    </label>
                </div>

                <div className='modal-action'>
                    <button className='btn btn-soft' onClick={preventDefault(onClose)}>
                        Annuler
                    </button>
                    <button className='btn btn-primary' onClick={preventDefault(handleConfirm)}>
                        Télécharger
                    </button>
                </div>
            </div>
        </dialog>,
        document.body,
    );
}
