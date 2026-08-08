import { CogIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { useMissionCreationStore } from '../../../stores';
import { formatFileSize } from '../../../utils';
import { FileConfig } from './FileConfig';

export function FileListItem(props) {
    const { file } = props;

    const [showSettings, setShowSettings] = useState(false);

    const deselect = useMissionCreationStore((state) => state.deselect);

    const toggleSettings = () =>
        setShowSettings((prev) => !prev);

    const handleRemove = () => deselect(file.id);

    return (
        <li className='block px-0 list-row'>
            <div className='flex items-center text-sm'>
                <span className='flex-1 mr-2 truncate'>{file.name}</span>
                <div className='flex items-center gap-2 shrink-0'>
                    <span className='opacity-60'>
                        {formatFileSize(file.size)}
                    </span>
                    <button
                        aria-label={`Configurer ${file.name}`}
                        className='btn btn-ghost btn-circle btn-xs'
                        onClick={toggleSettings}
                    >
                        <CogIcon className='size-4' />
                    </button>
                    <button
                        aria-label={`Retirer ${file.name}`}
                        className='btn btn-ghost btn-circle btn-xs'
                        onClick={handleRemove}
                    >
                        <XIcon className='size-4' />
                    </button>
                </div>
            </div>
            {showSettings && (
                <FileConfig file={file} />
            )}
        </li>
    );
}
