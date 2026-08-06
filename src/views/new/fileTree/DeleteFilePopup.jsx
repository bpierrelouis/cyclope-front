import { DeletePopup } from '../../../components';
import { useShallow } from 'zustand/react/shallow';
import { filesQueries } from '../../../hooks';
import { useMissionCreationStore } from '../../../stores';
import { openErrorToast } from '../../../utils';

export function DeleteFilePopup(props) {
    const { file, openState } = props;

    const { fileIds, deselect } = useMissionCreationStore(useShallow((state) => ({
        fileIds: state.fileIds,
        deselect: state.deselect,
    })));
    const deleteMutation = filesQueries.useDelete();

    const handleDelete = () => deleteMutation.mutate(file.id, {
        onError: () => openErrorToast(`Le fichier ${file.name} n'a pas pu être supprimé.`),
        onSuccess: () => {
            if (fileIds.has(file.id)) deselect(file.id);
        },
    });

    return (
        <DeletePopup
            title={file.name}
            onDelete={handleDelete}
            openState={openState}
        >
            Voulez-vous vraiment supprimer ce fichier ?
            <br />
            Cette action est irréversible.
        </DeletePopup>
    );
}
