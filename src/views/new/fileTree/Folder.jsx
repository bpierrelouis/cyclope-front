import { FolderIcon } from 'lucide-react';
import { FileTreeNode } from './FileTreeNode';

export function Folder(props) {
    const { folder } = props;
    const { name, children } = folder;

    return (
        <li>
            <details>
                <summary>
                    <FolderIcon className='size-4' />
                    {name}
                </summary>
                <ul>
                    {children.map((node) => (
                        <FileTreeNode key={node.id} node={node} />
                    ))}
                </ul>
            </details>
        </li>
    );
}
