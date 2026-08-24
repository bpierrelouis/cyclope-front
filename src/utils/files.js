import { createSHA256 } from 'hash-wasm';

import { ACCEPTED_VIDEO_EXTENSIONS } from '../constants';

export const joinPath = (...parts) => parts
    .filter((part) => part != null && part !== '')
    .map((part) => String(part).replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');

const HASH_CHUNK_SIZE = 64 * 1024 * 1024;

export const computeChecksum = async (file) => {
    const hasher = await createSHA256();
    for (let offset = 0; offset < file.size; offset += HASH_CHUNK_SIZE) {
        const chunk = await file.slice(offset, offset + HASH_CHUNK_SIZE).arrayBuffer();
        hasher.update(new Uint8Array(chunk));
    }
    return hasher.digest('hex');
};

export const computeXyzChecksum = async (results) => {

    const entries = results
        .filter(result => result.status === 'fulfilled')
        .map(result => ({
            checksum: result.value.checksum,
            path: result.value.url,
        }))
        .sort((a, b) => a.path.localeCompare(b.path));

    const hasher = await createSHA256();

    for (const entry of entries) {
        const data = `${entry.path}\0${entry.checksum}\n`;

        hasher.update(
            new TextEncoder().encode(data),
        );
    }

    return hasher.digest('hex');
};

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

export const getFolderDeletionConfirmationMessage = (fileCount) => {
    const message = 'Voulez-vous vraiment supprimer ce dossier';

    if (fileCount === 0) return `${message} ?`;
    if (fileCount === 1) return `${message} et le fichier qu'il contient ?`;
    return `${message} et les ${fileCount} fichiers qu'il contient ?`;
};

export const getFolderDeletionFailureMessage = (folderName, failedFileCount) => {
    if (failedFileCount == null) return `Le dossier ${folderName} n'a pas pu être supprimé.`;
    if (failedFileCount === 1) return `Un fichier du dossier ${folderName} n'a pas pu être supprimé.`;
    return `${failedFileCount} fichiers du dossier ${folderName} n'ont pas pu être supprimés.`;
};

export const isVideoExtension = (extension) =>
    ACCEPTED_VIDEO_EXTENSIONS.includes(extension?.toLowerCase());

export const isAcceptedFileExtension = (acceptedExtensions, extension) =>
    acceptedExtensions.includes(extension?.toLowerCase());

export const getRelativeFilePath = (file) =>
    file.relativePath || file.webkitRelativePath || file.name;

const getRelativeFilePathParts = (file) =>
    getRelativeFilePath(file).split('/').filter(Boolean);

export const isFilesInXyzFolder = (files) => {

    if (!files?.length) return false;

    const rootFolder = getRelativeFilePathParts(files[0])[0];

    return files.every(file => {
        const parts = getRelativeFilePathParts(file);

        if (parts.length !== 4) return false;

        const [root, z, x, y] = parts;

        return (
            root === rootFolder &&
            /^\d+$/.test(z) &&
            /^\d+$/.test(x) &&
            /^\d+\.png$/i.test(y)
        );
    });
};

export const getExtension = (fileName) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const suppressExtension = (fileName) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.slice(0, -1).join('.') : fileName;
};

export const getRootFolderName = (files) => {
    if (!files?.length) return null;

    return getRelativeFilePathParts(files[0])[0] ?? null;
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
const readEntry = (entry, parentPath = '') =>
    new Promise((resolve) => {
        if (entry.isFile) {
            entry.file((file) => {
                const relativePath = joinPath(parentPath, entry.name);
                Object.defineProperty(file, 'relativePath', {
                    configurable: true,
                    value: relativePath,
                });
                resolve([file]);
            });
        } else if (entry.isDirectory) {
            const reader = entry.createReader();
            const files = [];
            const directoryPath = joinPath(parentPath, entry.name);
            const readBatch = () => {
                reader.readEntries(async (entries) => {
                    if (!entries.length) {
                        resolve(files);
                        return;
                    }
                    for (const child of entries) {
                        files.push(...(await readEntry(child, directoryPath)));
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
