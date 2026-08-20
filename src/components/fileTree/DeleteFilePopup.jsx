import { DeletePopup } from '../DeletePopup';

export function DeleteFilePopup(props) {
    const { file, onClose, onDelete } = props;

    return (
        <DeletePopup
            title={file.name}
            onClose={onClose}
            onDelete={() => onDelete(file)}
        >
            Voulez-vous vraiment supprimer ce fichier ?
            <br />
            Cette action est irréversible.
        </DeletePopup>
    );
}
