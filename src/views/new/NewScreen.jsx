import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../constants';
import { filesQueries, missionsQueries } from '../../hooks';
import { useMissionCreationStore } from '../../stores';
import { flatTree } from '../../utils';
import { FileTree } from './fileTree';
import { WaitingZone } from './waitingZone';

export function NewScreen() {
    const navigate = useNavigate();

    const { data: fileNodes } = filesQueries.useGetTree();
    const { mutateAsync: createMission } = missionsQueries.useCreate();

    const { fileIds, configs } = useMissionCreationStore();

    const [missionName, setMissionName] = useState('');

    const flattenedFileNodes = useMemo(() => flatTree(fileNodes ?? []), [fileNodes]);
    const files = useMemo(() => {
        return flattenedFileNodes
            .filter((node) => !node.children)
            .filter((file) => fileIds.has(file.id));
    }, [flattenedFileNodes, fileIds]);

    const handleValidate = async () => {
        await createMission({
            name: missionName,
            medias: files.map((file) => ({
                fileId: file.id,
                displayName: file.name,
                config: configs[file.id],
            })),
        });
        navigate(ROUTES.missionList);
    };

    return (
        <main className='flex flex-col gap-4 p-4 min-h-0 size-full'>
            <div className='flex justify-between items-center shrink-0'>
                <p className='opacity-60 text-sm'>
                    Sélectionnez des fichiers dans l'explorateur, ils
                    apparaîtront dans la zone d'import à droite.
                </p>
                <button
                    className='btn btn-primary'
                    disabled={files.length === 0}
                    onClick={handleValidate}
                >
                    Lancer le traitement
                </button>
            </div>

            <div className='flex-1 gap-4 grid grid-cols-1 md:grid-cols-2 min-h-0'>
                <FileTree nodes={fileNodes ?? []} />
                <WaitingZone
                    files={files}
                    missionNameState={[missionName, setMissionName]}
                />
            </div>
        </main>
    );
}
