import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { ERoute } from '../../constants';
import { filesQueries, missionsQueries } from '../../hooks';
import { useMissionCreationStore } from '../../stores';
import { flatTree, openErrorToast } from '../../utils';
import { FileTree } from './fileTree';
import { WaitingZone } from './waitingZone';

export function NewScreen() {
    const navigate = useNavigate();

    const { data: fileNodes, isLoading, isError } = filesQueries.useGetTree();
    const { mutateAsync: createMission, isPending: isCreating } = missionsQueries.useCreate();
    const { mutateAsync: addMedias, isPending: isAdding } = missionsQueries.useAddMedias();
    const { mutateAsync: uploadFiles, isPending: isUploading } = filesQueries.useUploadFiles();

    const { fileIds, configs, missionId, missionName, setMissionName, selectMany, reset } =
        useMissionCreationStore();

    useEffect(() => reset, [reset]);

    const isAddingMode = Number.isInteger(missionId);

    const safeFileNodes = useMemo(
        () => (Array.isArray(fileNodes) ? fileNodes : []),
        [fileNodes],
    );

    const flattenedFileNodes = useMemo(() => flatTree(safeFileNodes), [safeFileNodes]);
    const files = useMemo(() => {
        return flattenedFileNodes.filter((file) => fileIds.has(file.id));
    }, [flattenedFileNodes, fileIds]);

    const isPending = isCreating || isAdding;
    const canValidate = isAddingMode
        ? Number.isInteger(missionId) && files.length > 0
        : !!missionName.trim();

    const handleValidate = async () => {
        const medias = files.map((file) => ({
            fileId: file.id,
            displayName: file.name,
            config: configs[file.id],
        }));

        try {
            if (isAddingMode) {
                await addMedias({ id: missionId, medias });
            } else {
                await createMission({ name: missionName.trim(), medias });
            }
        } catch {
            openErrorToast('La validation a échoué. Veuillez réessayer.');
            return;
        }

        reset();
        navigate(ERoute.MISSION_LIST);
    };

    // Dossier déposé sur l'explorateur : upload des fichiers dans le S3 puis pré-remplissage de la zone de création
    const handleDropFolder = async (droppedFolder, targetPath) => {
        const createdFiles = await uploadFiles({
            files: droppedFolder.files,
            folder: targetPath ? `${targetPath}/${droppedFolder.name}` : droppedFolder.name,
        });
        if (!createdFiles.length) return;

        if (!missionName.trim()) setMissionName(droppedFolder.name);
        selectMany(createdFiles);
    };

    if (isLoading) return (
        <main className='place-items-center grid size-full'>
            <LoaderCircleIcon className='size-8 animate-spin' />
        </main>
    );

    return (
        <main className='flex flex-col gap-4 p-4 min-h-0 size-full'>
            <div className='flex justify-between items-center shrink-0'>
                <p className='opacity-60 text-sm'>
                    Déposez vos vidéos directement sur un dossier de
                    l'explorateur.
                </p>
                <button
                    className='btn btn-primary'
                    disabled={!canValidate || isPending || isUploading}
                    onClick={handleValidate}
                >
                    {isPending && <LoaderCircleIcon className='size-4 animate-spin' />}
                    Lancer le traitement
                </button>
            </div>

            <div className='flex-1 gap-4 grid grid-cols-1 md:grid-cols-2 min-h-0'>
                <FileTree
                    nodes={safeFileNodes}
                    isError={isError}
                    onDropToFolder={uploadFiles}
                    onDropFolder={handleDropFolder}
                />
                <WaitingZone files={files} />
            </div>
        </main>
    );
}
