import { useFileDrop } from '../../../hooks';
import { FileTreeNode } from './FileTreeNode';

const ROOT_PATH = '';

export function FileTree(props) {
    const { nodes, onDropToFolder, onDropFolder } = props;

    const { isDragOver, dropProps } = useFileDrop({
        onDropFolder,
        onDropToFolder,
        path: ROOT_PATH,
    });

    return (
        <div
            className={`bg-base-100 border border-base-300 shadow-sm card max-h-[calc(100vh-8rem)] overflow-hidden ${isDragOver ? 'outline outline-primary' : ''}`}
            {...dropProps}
        >
            <h2 className='px-4 pt-4 card-title'>Explorateur de médias</h2>
            <ul className='flex-nowrap flex-1 size-full overflow-y-auto menu'>
                {nodes.map((node) => (
                    <FileTreeNode
                        key={node.id ?? node.name}
                        node={node}
                        parentPath={ROOT_PATH}
                        onDropToFolder={onDropToFolder}
                        onDropFolder={onDropFolder}
                    />
                ))}
            </ul>
        </div>
    );
}
