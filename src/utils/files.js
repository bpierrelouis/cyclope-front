export const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const postMediaMapper = (file) => ({
    id: file.id,
    name: file.name,
    config: file.config,
});

export const postMissionMapper = (missionName, files) => ({
    name: missionName,
    medias: files.map(postMediaMapper),
});

export const flatTree = (tree) => tree.reduce((acc, node) => {
    if (node.children) {
        return [...acc, ...flatTree(node.children)];
    }
    return [...acc, node];
}, []);
