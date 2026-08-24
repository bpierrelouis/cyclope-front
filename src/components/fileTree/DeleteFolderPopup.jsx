import { useShallow } from 'zustand/react/shallow';

import { filesQueries } from '../../hooks';
import { useMissionCreationStore } from '../../stores';
import {
    flatTree,
    getFolderDeletionConfirmationMessage,
    getFolderDeletionFailureMessage,
    openErrorToast,
} from '../../utils';
import { DeletePopup } from '../DeletePopup';

export function DeleteFolderPopup(props) {
    const { folder, onClose } = props;

    const { fileIds, deselect } = useMissionCreationStore(useShallow((state) => ({
        deselect: state.deselect,
        fileIds: state.fileIds,
    })));
    const deleteManyMutation = filesQueries.useDeleteMany();

    const files = flatTree(folder.children).filter((file) => file.id != null);
    const fileCount = files.length;

    const handleDeleteError = () =>
        openErrorToast(getFolderDeletionFailureMessage(folder.name));

    const handleDeleteSuccess = ({ deleted, failed }) => {
        deleted
            .filter((file) => fileIds.has(file.id))
            .forEach((file) => deselect(file.id));

        if (failed.length > 0) {
            openErrorToast(getFolderDeletionFailureMessage(folder.name, failed.length));
        }
    };

    const handleDelete = () => deleteManyMutation.mutate(files, {
        onError: handleDeleteError,
        onSettled: onClose,
        onSuccess: handleDeleteSuccess,
    });

    return (
        <DeletePopup
            title={folder.name}
            onClose={onClose}
            onDelete={handleDelete}
        >
            {getFolderDeletionConfirmationMessage(fileCount)}
            <br />
            Cette action est irréversible.
        </DeletePopup>
    );
}
