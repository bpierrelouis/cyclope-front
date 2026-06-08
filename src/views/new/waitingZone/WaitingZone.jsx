import { useMissionCreationStore } from '../../../stores';
import { formatFileSize } from '../../../utils';
import { FileList } from './FileList';
import { MissionNameField } from './MissionNameField';

export function WaitingZone(props) {
    const { files, missionNameState } = props;

    const { clear } = useMissionCreationStore();

    const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const fileCount = files.length;

    return (
        <div className='bg-base-100 shadow-md rounded-box size-full overflow-hidden'>
            <h3 className='mx-4 mt-2 font-medium text-lg'>Mission en attente d'import</h3>
            <div className='flex flex-col px-4 min-h-0 overflow-hidden'>
                <div className='flex justify-between items-end'>
                    <MissionNameField state={missionNameState} />
                    {fileCount > 0 && (
                        <div className='flex flex-col items-end'>
                            <button className='btn btn-ghost btn-error btn-sm' onClick={clear}>
                                Tout retirer
                            </button>
                            <p className='opacity-60 mt-2 border-base-200 text-xs text-right'>
                                Total : {fileCount} fichier{fileCount > 1 ? 's' : ''} - {formatFileSize(totalSize)}
                            </p>
                        </div>
                    )}
                </div>
                <div className='my-1 divider' />
                <FileList files={files} />
            </div>
        </div>
    );
}
