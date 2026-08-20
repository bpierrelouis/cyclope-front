const CAPTURE_TIMEOUT = 15000;
const MAX_WIDTH = 1280;
let video = null;
let videoUrl = null;
let queue = Promise.resolve();
const captures = new Map();

const getVideo = (url) => {
    if (video && videoUrl === url) return video;

    video?.removeAttribute('src');
    video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'auto';
    video.src = url;
    videoUrl = url;
    return video;
};

const once = (target, eventName) => new Promise((resolve, reject) => {
    let timer = null;

    const cleanup = () => {
        clearTimeout(timer);
        target.removeEventListener(eventName, onEvent);
        target.removeEventListener('error', onError);
    };

    function onEvent() {
        cleanup();
        resolve();
    }

    function onError() {
        cleanup();
        reject(new Error(`Erreur vidéo en attendant '${eventName}'`));
    }

    timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Timeout en attendant '${eventName}'`));
    }, CAPTURE_TIMEOUT);

    target.addEventListener(eventName, onEvent);
    target.addEventListener('error', onError);
});

const enqueue = (task) => {
    const run = queue.then(task, task);
    queue = run.catch(() => {});
    return run;
};

/**
 * Dessine les rectangles de détection sur le canvas.
 * Chaque box est { x, y, width, height }, en coordonnées normalisées (0-1)
 * ou en pixels de la frame native (auto-détecté).
 */
const drawDetections = (context, detections, width, height, scale) => {
    for (const { box, color, label } of detections) {
        if (!box) continue;

        const normalized = [box.x, box.y, box.width, box.height].every((value) => value <= 1);
        const x = normalized ? box.x * width : box.x * scale;
        const y = normalized ? box.y * height : box.y * scale;
        const w = normalized ? box.width * width : box.width * scale;
        const h = normalized ? box.height * height : box.height * scale;

        const lineWidth = Math.max(2, Math.round(width / 400));
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.strokeRect(x, y, w, h);

        if (!label) continue;

        const fontSize = Math.max(12, Math.round(width / 60));
        const padding = Math.round(fontSize / 3);
        context.font = `${fontSize}px sans-serif`;

        const labelHeight = fontSize + 2 * padding;
        // Libellé au-dessus de la boîte, ou à l'intérieur si elle touche le bord haut.
        const labelTop = y - labelHeight < 0 ? y : y - labelHeight;

        const labelWidth = context.measureText(label).width + 2 * padding;
        context.fillStyle = color;
        context.fillRect(x - lineWidth / 2, labelTop, labelWidth, labelHeight);
        context.fillStyle = '#ffffff';
        context.textBaseline = 'top';
        context.fillText(label, x - lineWidth / 2 + padding, labelTop + padding);
    }
};

const capture = async (url, seconds, detections) => {
    const element = getVideo(url);
    if (element.readyState < 2) await once(element, 'canplay');

    const target = Math.max(0, Math.min(seconds, (element.duration || 0) - 0.001));
    if (Math.abs(element.currentTime - target) > 0.01) {
        element.currentTime = target;
        await once(element, 'seeked');
    }

    const scale = Math.min(1, MAX_WIDTH / element.videoWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(element.videoWidth * scale);
    canvas.height = Math.round(element.videoHeight * scale);

    const context = canvas.getContext('2d');
    context.drawImage(element, 0, 0, canvas.width, canvas.height);
    drawDetections(context, detections, canvas.width, canvas.height, scale);

    const blob = await new Promise((resolve, reject) => canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('Échec de la capture'))),
        'image/jpeg',
        0.85,
    ));
    return URL.createObjectURL(blob);
};

/**
 * Extrait la frame de la vidéo à `seconds`, y dessine les détections,
 * et retourne une blob URL affichable dans un <img>.
 * Les demandes sont sérialisées et mises en cache par (vidéo, seconde, signature).
 */
const captureFrame = ({
    detections = [], seconds, signature = '', videoUrl: url,
}) => {
    // Variantes séparées : la frame brute (éditeur) et la frame annotée (vignettes,
    // popup) coexistent pour la même seconde sans s'invalider mutuellement.
    const key = `${url}|${seconds}|${detections.length > 0 ? 'annotated' : 'raw'}`;
    const cached = captures.get(key);
    if (cached && cached.signature === signature) return cached.promise;

    // Les couleurs ont changé : l'ancienne variante ne sera plus affichée.
    if (cached) cached.promise.then((blobUrl) => URL.revokeObjectURL(blobUrl)).catch(() => {});

    const promise = enqueue(() => capture(url, seconds, detections));
    const entry = { promise, signature };
    promise.catch(() => {
        if (captures.get(key) === entry) captures.delete(key);
    });
    captures.set(key, entry);
    return promise;
};

export const framesService = {
    captureFrame,
};
