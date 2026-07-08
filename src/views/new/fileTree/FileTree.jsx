import { useFileDrop } from '../../../hooks';
import { FileTreeNode } from './FileTreeNode';

const ROOT_PATH = '';

export function FileTree(props) {
    const { nodes, onDropToFolder, onDropFolder } = props;

    const { isDragOver, dropProps } = useFileDrop({
        path: ROOT_PATH,
        onDropToFolder,
        onDropFolder,
    });

    return (
        <div
            className={`flex flex-col bg-base-100 shadow-md rounded-box max-h-[calc(100vh-8rem)] ${isDragOver ? 'outline outline-primary' : ''}`}
            {...dropProps}
        >
            <h3 className='mx-4 mt-2 font-medium text-lg'>Explorateur de médias</h3>
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
