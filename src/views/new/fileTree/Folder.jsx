import { FileTreeNode } from './FileTreeNode';

export function Folder(props) {
    const { folder } = props;
    const { name, children } = folder;

    return (
        <li>
            <details>
                <summary>{name}</summary>
                <ul>
                    {children.map((node) => (
                        <FileTreeNode key={node.id} node={node} />
                    ))}
                </ul>
            </details>
        </li>
    );
}
