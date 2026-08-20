import { FolderIcon, ListPlusIcon } from 'lucide-react';
import { useRef } from 'react';

import { useFileDrop } from '../../hooks';
import { cn, flatTree } from '../../utils';
import { FileTreeNode } from './FileTreeNode';

export function Folder(props) {
    const { folder, path, treeOptions } = props;
    const {
        activeDropPath,
        onDropError,
        onDropFolder,
        onDropToFolder,
        onFilesSelect,
        onTargetPathChange,
    } = treeOptions;
    const { name, children } = folder;

    const detailsRef = useRef(null);

    const { isDragOver, dropProps } = useFileDrop({
        onDropError,
        onDropFolder,
        onDropStart: () => {
            if (detailsRef.current) detailsRef.current.open = true;
        },
        onDropToFolder,
        onTargetPathChange,
        path,
    });

    const isSelected = activeDropPath === path;

    const handleSelectAllFiles = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const files = flatTree(children).filter((file) => file.id != null);
        onFilesSelect(files);
    };

    const summaryClassName = cn(
        isSelected && 'text-primary',
        isDragOver && 'bg-primary/15 outline outline-primary',
    );

    return (
        <li className='group/folder'>
            <details ref={detailsRef}>
                <summary
                    className={summaryClassName}
                    {...dropProps}
                >
                    <FolderIcon className='size-4' />
                    <span className='flex-1'>{name}</span>

                    <div className='flex items-center gap-1'>
                        {onFilesSelect && (
                            <button
                                className='transition btn btn-ghost btn-xs btn-circle'
                                title='Ajouter tous les fichiers du dossier à la zone dattente'
                                onClick={handleSelectAllFiles}
                            >
                                <ListPlusIcon className='size-4' />
                            </button>
                        )}
                    </div>

                </summary>
                <ul>
                    {children.map((node) => (
                        <FileTreeNode
                            key={node.id ?? node.name}
                            node={node}
                            parentPath={path}
                            treeOptions={treeOptions}
                        />
                    ))}
                </ul>
            </details>
        </li>
    );
}
