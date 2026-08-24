import { useFileDrop } from '../../hooks';
import { cn } from '../../utils';
import { FileTreeNode } from './FileTreeNode';

export function FileTree(props) {
    const { nodes, title, ...treeOptions } = props;
    const {
        onDropError, onDropFolder, onDropToFolder, onTargetPathChange,
    } = treeOptions;

    const { isDragOver, dropProps } = useFileDrop({
        onDropError,
        onDropFolder,
        onDropToFolder,
        onTargetPathChange,
        path: '',
    });

    return (
        <div
            className={cn(
                'bg-base-100 border border-base-300 shadow-sm card w-full h-full min-h-0 overflow-hidden',
                isDragOver && 'outline outline-primary',
            )}
            {...dropProps}
        >
            <h2 className='px-4 pt-4 card-title'>{title}</h2>
            <ul className='flex-nowrap flex-1 w-full min-h-0 overflow-y-auto menu'>
                {nodes.map((node) => (
                    <FileTreeNode
                        key={node.id ?? node.name}
                        node={node}
                        parentPath=''
                        treeOptions={treeOptions}
                    />
                ))}
            </ul>
        </div>
    );
}
