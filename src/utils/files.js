export const joinPath = (parentPath, name) =>
    parentPath ? `${parentPath}/${name}` : name;

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

export const ACCEPTED_VIDEO_EXTENSIONS = ['mp4', 'ts', 'flv', 'mkv'];
export const ACCEPTED_IMAGE_EXTENSIONS = ['jpg', 'png', 'tiff', 'bmp'];
export const ACCEPTED_FILES_EXTENSIONS = [
    ...ACCEPTED_VIDEO_EXTENSIONS,
    ...ACCEPTED_IMAGE_EXTENSIONS,
];

export const isVideoExtension = (extension) =>
    ACCEPTED_VIDEO_EXTENSIONS.includes(extension?.toLowerCase());

export const isAcceptedFileExtension = (extension) =>
    ACCEPTED_FILES_EXTENSIONS.includes(extension?.toLowerCase());

export const getExtension = (fileName) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const suppressExtension = (fileName) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.slice(0, -1).join('.') : fileName;
};

export const getVideoDuration = (file) =>
    new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve(Math.round(video.duration));
        };
        video.onerror = () => {
            URL.revokeObjectURL(video.src);
            resolve(undefined);
        };
        video.src = URL.createObjectURL(file);
    });

// Lit un dossier
const readEntry = (entry) =>
    new Promise((resolve) => {
        if (entry.isFile) {
            entry.file((file) => resolve([file]));
        } else if (entry.isDirectory) {
            const reader = entry.createReader();
            const files = [];
            const readBatch = () => {
                reader.readEntries(async (entries) => {
                    if (!entries.length) {
                        resolve(files);
                        return;
                    }
                    for (const child of entries) {
                        files.push(...(await readEntry(child)));
                    }
                    readBatch();
                });
            };
            readBatch();
        } else {
            resolve([]);
        }
    });

// renvoie les fichiers déposés à la racine + la liste des dossiers déposés (chacun avec son nom et ses fichiers).
export const parseDroppedItems = async (dataTransfer) => {
    const entries = Array.from(dataTransfer.items ?? [])
        .map((item) => item.webkitGetAsEntry?.())
        .filter(Boolean);

    if (!entries.length) {
        return { folders: [], rootFiles: Array.from(dataTransfer.files) };
    }

    const rootFiles = [];
    const folders = [];

    for (const entry of entries) {
        if (entry.isDirectory) {
            folders.push({ files: await readEntry(entry), name: entry.name });
        } else {
            rootFiles.push(...(await readEntry(entry)));
        }
    }

    return { folders, rootFiles };
};

export const downloadDataUrl = (dataUrl, filename)  => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
};
