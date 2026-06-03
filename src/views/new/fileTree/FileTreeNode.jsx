import { File } from './File';
import { Folder } from './Folder';

export function FileTreeNode(props) {
    const { node } = props;

    if (node.children) return (
        <Folder folder={node} />
    );
    return (
        <File file={node} />
    );
}
