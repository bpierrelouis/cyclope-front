import { FileListItem } from './FileListItem';

export function FileList(props) {
    const { files } = props;

    const fileCount = files.length;

    if (!fileCount) return (
        <p className='opacity-50 text-sm text-center'>
            Aucun fichier sélectionné.
            <br />
            Utilisez l'explorateur pour en ajouter.
        </p>
    );

    return (
        <div className='flex flex-col flex-1 overflow-hidden'>
            {files.map((file, index) => (
                <FileListItem
                    key={`${file.name}-${index}`}
                    file={file}
                />
            ))}
        </div>
    );
}
