import { CogIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useMissionCreationStore } from '../../../stores';
import { formatFileSize } from '../../../utils/index';
import { FileConfig } from './FileConfig';

export function FileListItem(props) {
    const { file } = props;

    const [showSettings, setShowSettings] = useState(false);

    const { toggle } = useMissionCreationStore();

    const toggleSettings = () =>
        setShowSettings((prev) => !prev);

    const handleRemove = () => toggle(file.id);

    return (
        <div>
            <div className='flex items-center py-2 text-sm'>
                <span className='flex-1 mr-2 truncate'>{file.name}</span>
                <div className='flex items-center gap-2 shrink-0'>
                    <span className='opacity-60'>
                        {formatFileSize(file.size)}
                    </span>
                    <CogIcon
                        className='opacity-60 hover:opacity-100 size-4 cursor-pointer'
                        onClick={toggleSettings}
                    />
                    <XIcon
                        className='opacity-60 hover:opacity-100 size-4 cursor-pointer'
                        onClick={handleRemove}
                    />
                </div>
            </div>
            {showSettings && (
                <FileConfig file={file} />
            )}
        </div>
    );
}
