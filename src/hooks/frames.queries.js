import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { framesService } from '../services';
import { useDetectionCatalogStore } from '../stores';
import { getDetectionColor } from '../utils';
import { filesQueries } from './files.queries';

/**
 * Extrait de la vidéo courante la frame du résultat et y dessine
 * les rectangles de détection envoyés par le back (objects[].bbox),
 * colorés selon le catalogue de détections.
 * Avec `options.raw`, la frame est extraite sans rectangles (mode édition).
 * Retourne une query dont data est une blob URL affichable dans un <img>.
 */
const useResultFrame = (result, options = {}) => {
    const raw = options.raw ?? false;
    const media = options.media;
    const { data: videoUrl } = filesQueries.useGetContent(media?.isVideo ? media.url : null);

    const { categories, detections } = useDetectionCatalogStore(useShallow((state) => ({
        categories: state.categories,
        detections: state.detections,
    })));

    const toDraw = useMemo(() => (raw ? [] : result.objects ?? [])
        .filter((object) => object.bbox ?? object.box)
        .map((object) => {
            const bbox = object.bbox;
            return {
                box: bbox ? {
                    height: bbox.height ?? bbox.y2 - bbox.y1,
                    width: bbox.width ?? bbox.x2 - bbox.x1,
                    x: bbox.x1,
                    y: bbox.y1,
                } : object.box,
                color: getDetectionColor(object.type, detections, categories),
                label: object.type,
            };
        }), [categories, detections, raw, result]);

    // La signature fait partie de la clé : un changement de couleur régénère la frame.
    const signature = JSON.stringify(toDraw);

    return useQuery({
        enabled: (options.enabled ?? true) && !!videoUrl && result.seconds !== null,
        queryFn: () => framesService.captureFrame({
            detections: toDraw,
            seconds: result.seconds,
            signature,
            videoUrl,
        }),
        queryKey: ['frames', media?.url, result.id, signature],
        retry: 1,
        staleTime: Infinity,
    });
};

export const framesQueries = {
    useResultFrame,
};
