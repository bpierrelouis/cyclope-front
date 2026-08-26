import { useFileDrop } from '../../hooks';
import { cn } from '../../utils';
import { FileTreeNode } from './FileTreeNode';

export function FileTree(props) {
    const { nodes, ...treeOptions } = props;
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
                'flex flex-col flex-1 w-full h-full min-h-64 overflow-hidden',
                isDragOver && 'outline outline-primary',
            )}
            {...dropProps}
        >
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
