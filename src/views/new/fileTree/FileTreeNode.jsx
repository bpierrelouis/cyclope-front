import { File } from './File';
import { Folder } from './Folder';

export function FileTreeNode(props) {
    const {
        node, parentPath = '', onDropToFolder, onDropFolder,
    } = props;

    const path = parentPath ? `${parentPath}/${node.name}` : node.name;

    if (node.children) {
        return (
            <Folder
                folder={node}
                path={path}
                onDropToFolder={onDropToFolder}
                onDropFolder={onDropFolder}
            />
        );
    }
    return (
        <File file={node} />
    );
}
