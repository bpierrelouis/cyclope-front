import { FileListItem } from './FileListItem';

export function FileList(props) {
    const { files } = props;

    if (!files.length) return (
        <p className='opacity-50 text-sm text-center'>
            Aucun fichier sélectionné.
            <br />
            Utilisez l'explorateur pour en ajouter.
        </p>
    );

    return (
        <div className='flex flex-col'>
            {files.map((file) => (
                <FileListItem
                    key={file.id}
                    file={file}
                />
            ))}
        </div>
    );
}
