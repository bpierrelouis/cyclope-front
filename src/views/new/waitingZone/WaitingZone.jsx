import { useMissionCreationStore } from '../../../stores';
import { formatFileSize } from '../../../utils';
import { FileList } from './FileList';
import { MissionHeader } from './MissionHeader';

export function WaitingZone(props) {
    const { files, missionNameState } = props;

    const { clear } = useMissionCreationStore();

    const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const fileCount = files.length;

    return (
        <div className='bg-base-100 shadow-md rounded-box size-full overflow-hidden'>
            <h3 className='mx-4 mt-2 font-medium text-lg'>Mission en attente d'import</h3>
            <div className='flex flex-col px-4 min-h-0 overflow-hidden'>
                <MissionHeader
                    missionNameState={missionNameState}
                    onClearAll={clear}
                    fileCount={files.length}
                />
                <div className='my-1 divider' />
                <FileList files={files} />
                {fileCount > 0 && (
                    <p className='opacity-60 mt-2 border-base-200 text-xs text-right'>
                        Total : {fileCount} fichier{fileCount > 1 ? 's' : ''} - {formatFileSize(totalSize)}
                    </p>
                )}
            </div>
        </div>
    );
}
