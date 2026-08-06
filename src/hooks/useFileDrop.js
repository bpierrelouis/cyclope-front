import { useState } from 'react';
import { useMissionCreationStore } from '../stores';
import { parseDroppedItems } from '../utils';

export const useFileDrop = ({ path, onDropToFolder, onDropFolder, onDropStart }) => {
    const setUploadFolder = useMissionCreationStore((state) => state.setUploadFolder);
    const [isDragOver, setIsDragOver] = useState(false);

    const hasFiles = (event) =>
        Array.from(event.dataTransfer?.types ?? []).includes('Files');

    const handleDragOver = (event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (event) => {
        event.stopPropagation();
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setIsDragOver(false);
    };

    const handleDrop = async (event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);

        const { rootFiles, folders } = await parseDroppedItems(event.dataTransfer);
        if (!rootFiles.length && !folders.length) return;

        setUploadFolder(path);
        onDropStart?.();

        if (rootFiles.length) {
            await onDropToFolder?.({
                files: rootFiles,
                folder: path,
            });
        }

        for (const droppedFolder of folders) {
            await onDropFolder?.(droppedFolder, path);
        }
    };

    return {
        isDragOver,
        dropProps: {
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onDrop: handleDrop,
        },
    };
};
