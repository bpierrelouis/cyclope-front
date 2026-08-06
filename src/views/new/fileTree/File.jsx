import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { MediaIcon } from '../../../components';
import { useMissionCreationStore } from '../../../stores';
import { cn, isVideoExtension } from '../../../utils';
import { DeleteFilePopup } from './DeleteFilePopup';

export function File(props) {
    const { file } = props;
    const { id, name } = file;

    const { fileIds, toggle } = useMissionCreationStore(useShallow((state) => ({
        fileIds: state.fileIds,
        toggle: state.toggle,
    })));
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const isVideo = isVideoExtension(file.extension);
    const isSelected = fileIds.has(id);
    const className = cn(isSelected && 'not-hover:bg-primary/10 not-hover:text-primary');

    const handleClick = () => toggle(file);

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        setIsPopupOpen(true);
    };

    return (
        <li className='group/file relative'>
            <button className={`${className} pr-8`} onClick={handleClick}>
                <MediaIcon isVideo={isVideo} className='size-4' />
                <span className='flex-1'>{name}</span>
            </button>
            <button
                aria-label={`Supprimer ${name}`}
                className='top-1/2 right-2 absolute hover:bg-error/15 opacity-0 focus-visible:opacity-100 group-hover/file:opacity-100 p-1 rounded text-error transition -translate-y-1/2'
                onClick={handleDeleteClick}
            >
                <XIcon className='size-4' />
            </button>
            <DeleteFilePopup file={file} openState={[isPopupOpen, setIsPopupOpen]} />
        </li>
    );
}
