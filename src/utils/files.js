export const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

export const flatTree = (tree) => tree.reduce((acc, node) => {
    if (node.children) {
        return [...acc, ...flatTree(node.children)];
    }
    return [...acc, node];
}, []);

export const isVideoExtension = (extension) => {
    const videoExtensions = new Set([
        'mp4',
        'mkv',
        'avi',
        'mov',
        'wmv',
        'flv',
        'webm',
        'm4v',
        'mpeg',
        'mpg',
        '3gp',
        'ogv',
        'ts',
    ]);

    return videoExtensions.has(extension.toLowerCase());
};
