import { FolderTreeIcon } from 'lucide-react';

import { filesQueries, useUploadProgress } from '../hooks';
import { openErrorToast } from '../utils';
import { FileTree } from './fileTree';
import { SectionCard } from './SectionCard';

export function CartoFileTreeCard() {
    const { trackUpload, uploadProgress } = useUploadProgress();
    const { data: fileNodes = [] } = filesQueries.useGetTreeCarto();
    const { mutateAsync: deleteFile } = filesQueries.useDelete();
    const { mutateAsync: uploadFilesCarto } = filesQueries.useUploadFilesCarto();

    const handleDelete = async (file) => {
        try {
            await deleteFile(file.id);
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

    const handleUpload = (payload) => trackUpload(payload, uploadFilesCarto);

    return (
        <SectionCard
            className='min-h-64'
            description="Déposez vos fonds de carte directement dans l'explorateur."
            icon={FolderTreeIcon}
            title='Explorateur de fond de carte'
        >
            <FileTree
                nodes={fileNodes}
                onDelete={handleDelete}
                onDropError={handleDropError}
                onDropToFolder={handleUpload}
                onDropFolder={handleUpload}
                uploadProgress={uploadProgress}
            />
        </SectionCard>
    );
}
