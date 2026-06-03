import { FileTreeNode } from './FileTreeNode';

export function FileTree(props) {
    const { nodes } = props;

    return (
        <div className='bg-base-100 shadow-md rounded-box'>
            <h3 className='mx-4 mt-2 font-medium text-lg'>Explorateur de médias</h3>
            <ul className='size-full menu'>
                {nodes.map((node) => (
                    <FileTreeNode key={node.id ?? node.name} node={node} />
                ))}
            </ul>
        </div>
    );
}
