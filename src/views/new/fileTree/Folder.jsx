import { FolderIcon, ListPlusIcon } from 'lucide-react';
import { useRef } from 'react';
import { useFileDrop } from '../../../hooks';
import { useMissionCreationStore } from '../../../stores';
import { cn, flatTree } from '../../../utils';
import { FileTreeNode } from './FileTreeNode';

export function Folder(props) {
    const { folder, path, onDropToFolder, onDropFolder } = props;
    const { name, children } = folder;

    const { uploadFolder, selectMany } = useMissionCreationStore();

    const detailsRef = useRef(null);

    const { isDragOver, dropProps } = useFileDrop({
        path,
        onDropToFolder,
        onDropFolder,
        onDropStart: () => {
            if (detailsRef.current) detailsRef.current.open = true;
        },
    });

    const isSelected = uploadFolder === path;

    // Ajoute tous les fichiers du dossier (récursivement) à la zone d'attente.
    const handleSelectAllFiles = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const files = flatTree(children).filter((file) => file.id != null);
        selectMany(files);
    };

    const summaryClassName = cn(
        isSelected && 'text-primary',
        isDragOver && 'bg-primary/15 outline outline-primary',
    );

    return (
        <li>
            <details ref={detailsRef}>
                <summary
                    className={summaryClassName}
                    {...dropProps}
                >
                    <FolderIcon className='size-4' />
                    <span className='flex-1'>{name}</span>
                    <div className='flex items-center gap-1'>
                        <button
                            className='transition btn btn-ghost btn-xs btn-circle'
                            title='Ajouter tous les fichiers du dossier à la zone dattente'
                            onClick={handleSelectAllFiles}
                        >
                            <ListPlusIcon className='size-4' />
                        </button>
                    </div>
                </summary>
                <ul>
                    {children.map((node) => (
                        <FileTreeNode
                            key={node.id ?? node.name}
                            node={node}
                            parentPath={path}
                            onDropToFolder={onDropToFolder}
                            onDropFolder={onDropFolder}
                        />
                    ))}
                </ul>
            </details>
        </li>
    );
}
