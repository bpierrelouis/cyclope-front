import { CogIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useMissionCreationStore } from '../../../stores';
import { formatFileSize } from '../../../utils';
import { FileConfig } from './FileConfig';

export function FileListItem(props) {
    const { file } = props;

    const [showSettings, setShowSettings] = useState(false);

    const { deselect } = useMissionCreationStore();

    const toggleSettings = () =>
        setShowSettings((prev) => !prev);

    const handleRemove = () => deselect(file.id);

    return (
        <div>
            <div className='flex items-center py-2 text-sm'>
                <span className='flex-1 mr-2 truncate'>{file.name}</span>
                <div className='flex items-center gap-2 shrink-0'>
                    <span className='opacity-60'>
                        {formatFileSize(file.size)}
                    </span>
                    <button
                        aria-label={`Configurer ${file.name}`}
                        className='opacity-60 hover:opacity-100 transition'
                        onClick={toggleSettings}
                    >
                        <CogIcon className='size-4' />
                    </button>
                    <button
                        aria-label={`Retirer ${file.name}`}
                        className='opacity-60 hover:opacity-100 transition'
                        onClick={handleRemove}
                    >
                        <XIcon className='size-4' />
                    </button>
                </div>
            </div>
            {showSettings && (
                <FileConfig file={file} />
            )}
        </div>
    );
}
