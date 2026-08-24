import { XIcon } from 'lucide-react';
import { useState } from 'react';

import { cn, isVideoExtension } from '../../utils';
import { MediaIcon } from '../MediaIcon';
import { DeleteFilePopup } from './DeleteFilePopup';
import { FileTreeActionButton } from './FileTreeActionButton';

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
                    <FileTreeActionButton
                        aria-label={`Supprimer ${name}`}
                        className='top-1/2 right-2 absolute hover:bg-error/15 text-error/70 hover:text-error -translate-y-1/2'
                        onClick={handleDeleteClick}
                    >
                        <XIcon className='size-4' />
                    </FileTreeActionButton>
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
