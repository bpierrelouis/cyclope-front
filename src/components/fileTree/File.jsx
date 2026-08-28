import { useState } from 'react';

import { cn, isVideoExtension } from '../../utils';
import { DeleteButton } from '../DeleteButton';
import { MediaIcon } from '../MediaIcon';
import { DeleteFilePopup } from './DeleteFilePopup';

export function File(props) {
    const {
        file, onDelete, onSelect, selected,
    } = props;
    const { name } = file;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const isVideo = isVideoExtension(file.extension);
    const handleClick = () => onSelect(file);

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        setIsPopupOpen(true);
    };

    const content = (
        <>
            <MediaIcon isVideo={isVideo} className='size-4' />
            <span className='flex-1'>{name}</span>
        </>
    );

    return (
        <li className='group/file relative'>
            {onSelect ? (
                <button
                    className={cn(
                        'pr-8',
                        selected && 'not-hover:bg-primary/10 not-hover:text-primary',
                    )}
                    onClick={handleClick}
                    type='button'
                >
                    {content}
                </button>
            ) : (
                <div className='flex items-center gap-2 px-3 py-2 pr-8'>
                    {content}
                </div>
            )}
            {onDelete && (
                <>
                    <DeleteButton
                        aria-label={`Supprimer ${name}`}
                        className='top-1/2 right-2 absolute -translate-y-1/2'
                        title={`Supprimer ${name}`}
                        onClick={handleDeleteClick}
                    />
                    {isPopupOpen && (
                        <DeleteFilePopup
                            file={file}
                            onClose={() => setIsPopupOpen(false)}
                            onDelete={onDelete}
                        />
                    )}
                </>
            )}
        </li>
    );
}
