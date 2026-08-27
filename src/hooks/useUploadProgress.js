import { useCallback, useRef, useState } from 'react';

export const useUploadProgress = () => {
    const [uploadProgress, setUploadProgress] = useState(null);

    // Chaque appel à trackUpload crée un lot indépendant. La Map permet de suivre
    // simultanément plusieurs dépôts sans que le plus récent remplace les précédents.
    // Une ref est utilisée pour mettre à jour ces données immédiatement entre deux callbacks.
    const batchesRef = useRef(new Map());

    // Recalcule la progression globale affichée à partir de tous les lots connus.
    // Les lots déjà terminés restent inclus tant qu'un autre lot est encore actif :
    // le compteur ne redescend donc jamais pendant une série d'imports simultanés.
    const updateProgress = useCallback(() => {
        const batches = Array.from(batchesRef.current.values());
        if (!batches.length) {
            setUploadProgress(null);
            return;
        }

        setUploadProgress({
            completed: batches.reduce((sum, batch) => sum + batch.completed, 0),
            total: batches.reduce((sum, batch) => sum + batch.total, 0),
        });
    }, []);

    const trackUpload = useCallback(async (payload, upload) => {
        const { onProgress, ...uploadPayload } = payload;

        // Un Symbol garantit un identifiant unique, même si plusieurs lots contenant
        // les mêmes fichiers sont lancés presque au même moment.
        const batchId = Symbol('upload');
        batchesRef.current.set(batchId, {
            active: true,
            completed: 0,
            total: payload.files.length,
        });
        updateProgress();

        try {
            return await upload({
                ...uploadPayload,
                // La progression propre au lot est enregistrée, puis agrégée avec
                // celle des autres imports actuellement suivis.
                onProgress: (completed, total, result) => {
                    batchesRef.current.set(batchId, {
                        active: true,
                        completed,
                        total,
                    });
                    updateProgress();
                    onProgress?.(result);
                },
            });
        } finally {
            // Le finally couvre aussi les imports en erreur. Le lot terminé est conservé
            // jusqu'à la fin des autres lots afin de préserver un total stable à l'écran.
            const batch = batchesRef.current.get(batchId);
            if (batch) batch.active = false;

            const hasActiveBatch = Array.from(batchesRef.current.values())
                .some(({ active }) => active);

            // Lorsque le dernier lot se termine, vider la Map masque l'indicateur.
            if (!hasActiveBatch) batchesRef.current.clear();
            updateProgress();
        }
    }, [updateProgress]);

    return { trackUpload, uploadProgress };
};
