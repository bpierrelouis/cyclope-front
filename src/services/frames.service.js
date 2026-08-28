import { FRAME_CAPTURE_TIMEOUT } from '../constants';

const waitFor = (element, eventName) => new Promise((resolve, reject) => {
    const cleanup = () => {
        clearTimeout(timeout);
        element.removeEventListener(eventName, onReady);
        element.removeEventListener('error', onError);
    };
    const onReady = () => {
        cleanup();
        resolve();
    };
    const onError = () => {
        cleanup();
        reject(new Error(`Impossible de charger le média (${eventName})`));
    };
    const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`Chargement du média trop long (${eventName})`));
    }, FRAME_CAPTURE_TIMEOUT);

    element.addEventListener(eventName, onReady);
    element.addEventListener('error', onError);
});

const waitForVideoFrame = (video) => new Promise((resolve) => {
    if (typeof video.requestVideoFrameCallback !== 'function') {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
        return;
    }

    let settled = false;
    const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        resolve();
    };
    const callbackId = video.requestVideoFrameCallback(() => {
        finish();
    });
    const timeout = setTimeout(() => {
        video.cancelVideoFrameCallback?.(callbackId);
        finish();
    }, 100);
});

const getDimensions = (element, isVideo) => isVideo
    ? { height: element.videoHeight, width: element.videoWidth }
    : { height: element.naturalHeight, width: element.naturalWidth };

const getScale = (width, maxWidth) =>
    maxWidth ? Math.min(1, maxWidth / width) : 1;

const isNormalizedBox = (box) =>
    [box.x, box.y, box.width, box.height].every((value) => value <= 1);

const drawDetections = (context, detections, width, height, scale) => {
    for (const { box, color, label } of detections) {
        if (!box) continue;

        const normalized = isNormalizedBox(box);
        const x = normalized ? box.x * width : box.x * scale;
        const y = normalized ? box.y * height : box.y * scale;
        const boxWidth = normalized ? box.width * width : box.width * scale;
        const boxHeight = normalized ? box.height * height : box.height * scale;
        const lineWidth = Math.max(2, Math.round(width / 400));

        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.strokeRect(x, y, boxWidth, boxHeight);

        if (!label) continue;

        const fontSize = Math.max(12, Math.round(width / 60));
        const padding = Math.round(fontSize / 3);
        const labelHeight = fontSize + 2 * padding;
        const labelTop = y - labelHeight < 0 ? y : y - labelHeight;

        context.font = `${fontSize}px sans-serif`;
        const labelWidth = context.measureText(label).width + 2 * padding;
        context.fillStyle = color;
        context.fillRect(x - lineWidth / 2, labelTop, labelWidth, labelHeight);
        context.fillStyle = '#ffffff';
        context.textBaseline = 'top';
        context.fillText(label, x - lineWidth / 2 + padding, labelTop + padding);
    }
};

const canvasToUrl = (canvas) => new Promise((resolve, reject) => {
    canvas.toBlob(
        (blob) => blob
            ? resolve(URL.createObjectURL(blob))
            : reject(new Error('Échec de la création de la frame')),
        'image/jpeg',
    );
});

const createFramesService = () => {
    let activeVideo = null;
    let activeVideoUrl = null;
    let queue = Promise.resolve();
    const cache = new Map();

    const enqueue = (task) => {
        const current = queue.then(task, task);
        queue = current.catch(() => {});
        return current;
    };

    const loadImage = async (url) => {
        const image = document.createElement('img');
        image.crossOrigin = 'anonymous';
        image.src = url;
        if (!image.complete) await waitFor(image, 'load');
        return image;
    };

    const loadVideo = async (url) => {
        if (!activeVideo || activeVideoUrl !== url) {
            activeVideo?.removeAttribute('src');
            activeVideo = document.createElement('video');
            activeVideo.crossOrigin = 'anonymous';
            activeVideo.muted = true;
            activeVideo.preload = 'auto';
            activeVideo.src = url;
            activeVideoUrl = url;
        }
        if (activeVideo.readyState < 2) await waitFor(activeVideo, 'canplay');
        return activeVideo;
    };

    const seek = async (video, time) => {
        const target = Math.max(0, Math.min(time, (video.duration || 0) - 0.001));
        if (Math.abs(video.currentTime - target) <= 0.01) return;
        video.currentTime = target;
        await waitFor(video, 'seeked');
    };

    const render = async ({
        detections, isVideo, maxWidth, time, url,
    }) => {
        const source = isVideo ? await loadVideo(url) : await loadImage(url);
        if (isVideo) {
            await seek(source, time);
            // `canplay`/`seeked` can fire before some browsers have submitted the
            // decoded frame for painting. Drawing at that point yields a black
            // canvas, most often for the initial frame at t=0.
            await waitForVideoFrame(source);
        }

        const sourceSize = getDimensions(source, isVideo);
        const scale = getScale(sourceSize.width, maxWidth);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(sourceSize.width * scale);
        canvas.height = Math.round(sourceSize.height * scale);

        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas 2D indisponible');
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        drawDetections(context, detections, canvas.width, canvas.height, scale);
        return canvasToUrl(canvas);
    };

    const createFrame = ({
        detections = [], isVideo = false, maxWidth = null, time = null, url,
    }) => {
        const variant = detections.length > 0 ? 'annotated' : 'raw';
        const cacheKey = `${url}|${isVideo ? time : 'image'}|${maxWidth ?? 'native'}|${variant}`;
        const signature = JSON.stringify(detections);
        const cached = cache.get(cacheKey);
        if (cached?.signature === signature) return cached.promise;

        if (cached) {
            cached.promise
                .then((objectUrl) => URL.revokeObjectURL(objectUrl))
                .catch(() => {});
        }

        const promise = enqueue(() => render({
            detections, isVideo, maxWidth, time, url,
        }));
        const entry = { promise, signature };
        cache.set(cacheKey, entry);
        promise.catch(() => {
            if (cache.get(cacheKey) === entry) cache.delete(cacheKey);
        });
        return promise;
    };

    return { createFrame };
};

export const framesService = createFramesService();
