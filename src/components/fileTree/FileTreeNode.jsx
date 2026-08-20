import { joinPath } from '../../utils';
import { File } from './File';
import { Folder } from './Folder';

export function FileTreeNode(props) {
    const { node, parentPath = '', treeOptions } = props;
    const {
        onDelete, onFileSelect, selectedFileIds,
    } = treeOptions;

    if (node.children) {
        return (
            <Folder
                folder={node}
                path={joinPath(parentPath, node.name)}
                treeOptions={treeOptions}
            />
        );
    }
    return (
        <File
            file={node}
            onDelete={onDelete}
            onSelect={onFileSelect}
            selected={selectedFileIds?.has(node.id)}
        />
    );
}
