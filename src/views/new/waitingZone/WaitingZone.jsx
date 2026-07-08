import { useEffect } from 'react';
import { missionsQueries } from '../../../hooks';
import { useMissionCreationStore } from '../../../stores';
import { formatFileSize } from '../../../utils';
import { FileList } from './FileList';
import { MissionNameField } from './MissionNameField';

export function WaitingZone(props) {
    const { files } = props;

    const {
        missionId, setMissionId,
        missionName, setMissionName,
        clearSelection,
    } = useMissionCreationStore();

    const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const fileCount = files.length;

    const { data: missions } = missionsQueries.useGetAll();

    useEffect(() => {
        setMissionId(null);
    }, [setMissionId]);

    return (
        <div className='flex flex-col bg-base-100 shadow-md rounded-box max-h-[calc(100vh-8rem)] size-full overflow-hidden'>
            <h3 className='mx-4 mt-2 font-medium text-lg'>Zone d'attente</h3>

            <div className='flex flex-col gap-2 px-4 shrink-0'>
                <div className='tabs'>
                    <input
                        type='radio'
                        name='mission_media'
                        className='tab'
                        aria-label='Nouvelle mission'
                        defaultChecked
                    />
                    <div className='tab-content'>
                        <MissionNameField
                            value={missionName}
                            setValue={setMissionName}
                        />
                    </div>

                    <input
                        type='radio'
                        name='mission_media'
                        className='tab'
                        aria-label='Mission existante'
                    />
                    <div className='tab-content'>
                        <select
                            className='w-full select-sm select'
                            value={missionId ?? ''}
                            onChange={(e) => setMissionId(Number(e.target.value))}
                        >
                            <option value='' disabled>Sélectionner une mission...</option>
                            {missions?.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {fileCount > 0 && (
                    <div className='flex justify-between items-center'>
                        <button className='btn btn-ghost btn-error btn-sm' onClick={clearSelection}>
                            Tout retirer
                        </button>
                        <p className='opacity-60 text-xs text-right'>
                            Total : {fileCount} fichier{fileCount > 1 ? 's' : ''} - {formatFileSize(totalSize)}
                        </p>
                    </div>
                )}
            </div>

            <div className='my-1 divider shrink-0' />

            <div className='flex-1 px-4 pb-2 min-h-0 overflow-y-auto'>
                <FileList files={files} />
            </div>
        </div>
    );
}