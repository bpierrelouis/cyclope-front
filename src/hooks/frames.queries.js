import { useQuery } from '@tanstack/react-query';

import { THUMBNAIL_MAX_WIDTH } from '../constants';
import { filesService, framesService } from '../services';
import { detectionCatalogStore } from '../stores';
import { formatDetectionLabel, getDetectionColor } from '../utils';
import { filesQueries } from './files.queries';

const useFrame = (result, media, maxWidth = null) => {
    const { data: url } = filesQueries.useGetContent(media?.url);

    return useQuery({
        enabled: !!url && (!media.isVideo || result.seconds !== null),
        queryFn: () => framesService.createFrame({
            isVideo: media.isVideo,
            maxWidth,
            time: result.seconds,
            url,
        }),
        queryKey: ['frames', media?.url, result.id, maxWidth, 'raw'],
        retry: 1,
        staleTime: Infinity,
    });
};

const useThumbnail = (result, media) =>
    useFrame(result, media, THUMBNAIL_MAX_WIDTH);

const createDetectionFrame = async (result, media) => {
    if (!media || (media.isVideo && result.seconds === null)) return null;

    const url = await filesService.getContent(media.url);
    const { categories, detections } = detectionCatalogStore.getState();
    const toDraw = (result.objects ?? [])
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
                label: formatDetectionLabel(object),
            };
        });
    return framesService.createFrame({
        detections: toDraw,
        isVideo: media.isVideo,
        time: result.seconds,
        url,
    });
};

export const framesQueries = {
    createDetectionFrame,
    useFrame,
    useThumbnail,
};
