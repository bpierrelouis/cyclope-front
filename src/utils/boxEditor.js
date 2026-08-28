export const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

export const getObjectBox = (object) => {
    if (object.bbox) {
        return {
            height: object.bbox.height ?? object.bbox.y2 - object.bbox.y1,
            width: object.bbox.width ?? object.bbox.x2 - object.bbox.x1,
            x: object.bbox.x1,
            y: object.bbox.y1,
        };
    }
    return object.box ?? null;
};

export const getPointerPosition = (event, element) => {
    const rect = element.getBoundingClientRect();
    return {
        x: clamp((event.clientX - rect.left) / rect.width),
        y: clamp((event.clientY - rect.top) / rect.height),
    };
};

export const rectFrom = (anchor, point) => ({
    height: Math.abs(point.y - anchor.y),
    width: Math.abs(point.x - anchor.x),
    x: Math.min(anchor.x, point.x),
    y: Math.min(anchor.y, point.y),
});

export const sameName = (left, right) =>
    String(left ?? '').localeCompare(
        String(right ?? ''),
        undefined,
        { sensitivity: 'accent' },
    ) === 0;

export const toBoundingBox = (box, natural) => {
    const height = natural ? box.height * natural.height : box.height;
    const width = natural ? box.width * natural.width : box.width;
    const x1 = natural ? box.x * natural.width : box.x;
    const y1 = natural ? box.y * natural.height : box.y;
    return {
        height,
        width,
        x1,
        x2: x1 + width,
        y1,
        y2: y1 + height,
    };
};

export const toNormalizedBox = (box, natural) => {
    if (!box) return null;
    if ([box.x, box.y, box.width, box.height].every((value) => value <= 1)) return box;
    if (!natural) return null;
    return {
        height: box.height / natural.height,
        width: box.width / natural.width,
        x: box.x / natural.width,
        y: box.y / natural.height,
    };
};

export const updateObjectBox = (objects, index, box, natural) =>
    objects.map((object, position) => {
        if (position !== index) return object;
        const { box: _legacyBox, ...rest } = object;
        return { ...rest, bbox: toBoundingBox(box, natural) };
    });
