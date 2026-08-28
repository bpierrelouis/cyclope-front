import { useState } from 'react';

import { parseDroppedItems } from '../utils';

export const useFileDrop = ({
    path, onDropError, onDropToFolder, onDropFolder, onDropStart, onTargetPathChange,
}) => {
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

        try {
            const { rootFiles, folders } = await parseDroppedItems(event.dataTransfer);
            if (!rootFiles.length && !folders.length) return;

            onTargetPathChange?.(path);
            onDropStart?.();

            if (rootFiles.length) {
                await onDropToFolder?.({
                    files: rootFiles,
                    folder: path,
                });
            }

            for (const droppedFolder of folders) {
                await onDropFolder?.({
                    ...droppedFolder,
                    folder: path,
                });
            }
        } catch (error) {
            onDropError?.(error);
        }
    };

    return {
        dropProps: {
            onDragLeave: handleDragLeave,
            onDragOver: handleDragOver,
            onDrop: handleDrop,
        },
        isDragOver,
    };
};
