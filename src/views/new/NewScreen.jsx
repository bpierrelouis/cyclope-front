import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { ERoute } from '../../constants';
import { filesQueries, missionsQueries } from '../../hooks';
import { useMissionCreationStore } from '../../stores';
import { flatTree, openErrorToast } from '../../utils';
import { MediaFileTreeCard } from './MediaFileTreeCard';
import { WaitingZone } from './waitingZone';

export function NewScreen() {
    const navigate = useNavigate();

    const { data: fileNodes = [], isLoading } = filesQueries.useGetTreeMedia();
    const { mutateAsync: createMission, isPending: isCreating } = missionsQueries.useCreate();
    const { mutateAsync: addMedias, isPending: isAdding } = missionsQueries.useAddMedias();
    const isUploading = filesQueries.useIsUploadingMedias();

    const {
        configs,
        fileIds,
        missionId,
        missionName,
        reset,
    } =
        useMissionCreationStore(useShallow((state) => ({
            configs: state.configs,
            fileIds: state.fileIds,
            missionId: state.missionId,
            missionName: state.missionName,
            reset: state.reset,
        })));

    useEffect(() => reset, [reset]);

    const isAddingMode = Number.isInteger(missionId);

    const flattenedFileNodes = useMemo(() => flatTree(fileNodes), [fileNodes]);
    const files = useMemo(() => {
        return flattenedFileNodes.filter((file) => fileIds.has(file.id));
    }, [flattenedFileNodes, fileIds]);

    const isPending = isCreating || isAdding;
    const canValidate = isAddingMode
        ? Number.isInteger(missionId) && files.length > 0
        : !!missionName.trim() && files.length > 0;

    const handleValidate = async () => {
        const medias = files.map((file) => ({
            config: configs[file.id],
            displayName: file.name,
            fileId: file.id,
        }));

        try {
            if (isAddingMode) {
                await addMedias({ id: missionId, medias });
            } else {
                await createMission({ medias, name: missionName.trim() });
            }
        } catch {
            openErrorToast('La validation a échoué. Veuillez réessayer.');
            return;
        }

        reset();
        navigate(ERoute.MISSION_LIST);
    };

    if (isLoading) {
        return (
            <main className='place-items-center grid size-full'>
                <LoaderCircleIcon className='size-8 animate-spin' />
            </main>
        );
    }

    return (
        <main className='flex flex-col gap-4 p-4 min-h-0 size-full'>
            <div className='flex justify-end items-center shrink-0'>
                <button
                    type='button'
                    className='btn btn-primary'
                    disabled={!canValidate || isPending || isUploading}
                    onClick={handleValidate}
                >
                    {(isPending || isUploading) && (
                        <LoaderCircleIcon className='size-4 animate-spin' />
                    )}
                    Lancer le traitement
                </button>
            </div>

            <div className='flex-1 gap-4 grid grid-cols-1 md:grid-cols-2 min-h-0'>
                <MediaFileTreeCard />
                <WaitingZone files={files} />
            </div>
        </main>
    );
}
