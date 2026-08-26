import { FolderTreeIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import {
    FileTree,
    SectionCard,
} from '../../components';
import { filesQueries } from '../../hooks';
import { useMissionCreationStore } from '../../stores';
import { openErrorToast } from '../../utils';

export function MediaFileTree() {
    const { data: fileNodes = [] } = filesQueries.useGetTreeMedia();
    const { mutateAsync: deleteFile } = filesQueries.useDelete();
    const { mutateAsync: uploadFilesMedias } = filesQueries.useUploadFilesMedias();

    const {
        deselect,
        fileIds,
        missionName,
        selectMany,
        setMissionName,
        setUploadFolder,
        toggle,
        uploadFolder,
    } =
        useMissionCreationStore(useShallow((state) => ({
            deselect: state.deselect,
            fileIds: state.fileIds,
            missionName: state.missionName,
            selectMany: state.selectMany,
            setMissionName: state.setMissionName,
            setUploadFolder: state.setUploadFolder,
            toggle: state.toggle,
            uploadFolder: state.uploadFolder,
        })));

    const uploadAndSelect = async (payload) => {
        const createdFiles = await uploadFilesMedias(payload);
        selectMany(createdFiles);
        return createdFiles;
    };

    // Dossier déposé sur l'explorateur : upload des fichiers dans le S3 puis pré-remplissage de la zone de création
    const handleDropFolder = async (droppedFolder) => {
        const createdFiles = await uploadAndSelect({
            files: droppedFolder.files,
            folder: droppedFolder.folder,
        });
        if (!createdFiles.length) return;
        if (!missionName.trim()) setMissionName(droppedFolder.name);
    };

    const handleDelete = async (file) => {
        try {
            await deleteFile(file.id);
            if (fileIds.has(file.id)) deselect(file.id);
        } catch {
            openErrorToast(`Le fichier ${file.name} n'a pas pu être supprimé.`);
        }
    };

    const handleDropError = (error) => {
        if (error) {
            openErrorToast(error.message);
        } else {
            openErrorToast('Le dépôt des fichiers a échoué. Veuillez réessayer.');
        }
    };

    return (
        <SectionCard
            className='h-full min-h-64'
            description="Déposez vos vidéos directement sur un dossier de l'explorateur."
            icon={FolderTreeIcon}
            title='Explorateur de médias'
        >
            <FileTree
                activeDropPath={uploadFolder}
                nodes={fileNodes}
                onDelete={handleDelete}
                onDropError={handleDropError}
                onDropToFolder={uploadAndSelect}
                onDropFolder={handleDropFolder}
                onFileSelect={toggle}
                onFilesSelect={selectMany}
                onTargetPathChange={setUploadFolder}
                selectedFileIds={fileIds}
            />
        </SectionCard>
    );
}
