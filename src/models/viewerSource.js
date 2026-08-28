const getDuration = (media) => Number.isFinite(media?.duration)
    ? Math.max(media.duration, 0)
    : 0;

export function createViewerItem({
    error, media, offset = 0, results = [], treatment = null,
}) {
    return {
        duration: getDuration(media),
        error,
        media,
        offset,
        results,
        treatment,
    };
}

const createViewerSource = (id, items, mission) => {
    const source = {
        duration: items.reduce((total, item) => total + item.duration, 0),
        errors: items.flatMap(({ error }) => error ? [error] : []),
        id,
        items,
        mission,
        results: items.flatMap(({ results }) => results),
    };

    return {
        ...source,
        timelineResults: getTimelineResults(source),
    };
};

export function createMediaViewerSource({
    error, media, mission, results, treatment,
}) {
    const items = media
        ? [createViewerItem({
            error,
            media,
            results,
            treatment,
        })]
        : [];

    const id = media
        ? `media:${media.id}:treatment:${treatment?.id ?? 'none'}`
        : null;

    return createViewerSource(id, items, mission);
}

export function createMissionViewerSource({ items = [], mission }) {
    let offset = 0;
    const timelineItems = items
        .filter(({ media }) => media?.isVideo && getDuration(media) > 0)
        .map((item) => {
            const timelineItem = createViewerItem({
                ...item,
                offset,
            });
            offset += timelineItem.duration;
            return timelineItem;
        });

    return createViewerSource(
        mission ? `mission:${mission.id}` : null,
        timelineItems,
        mission,
    );
}

export function getLocalTimelinePosition(source, globalTime) {
    if (!source.items.length) return null;

    const time = Math.min(
        Math.max(Number(globalTime) || 0, 0),
        source.duration,
    );
    const item = source.items.find(
        (candidate) => time < candidate.offset + candidate.duration,
    ) ?? source.items.at(-1);

    return {
        item,
        time: Math.min(time - item.offset, item.duration),
    };
}

export function getGlobalTimelineTime(item, localTime) {
    const time = Math.min(
        Math.max(Number(localTime) || 0, 0),
        item.duration,
    );

    return item.offset + time;
}

export function getTimelineResults(source) {
    return source.items.flatMap((item) => (item.results ?? []).map((result) => {
        const hasTime = Number.isFinite(result.seconds);
        const globalTime = hasTime
            ? getGlobalTimelineTime(item, result.seconds)
            : null;

        return {
            globalTime,
            item,
            localTime: hasTime ? globalTime - item.offset : null,
            media: item.media,
            result,
            treatment: item.treatment,
        };
    })).sort((left, right) => {
        if (left.globalTime === null && right.globalTime === null) return 0;
        if (left.globalTime === null) return 1;
        if (right.globalTime === null) return -1;
        return left.globalTime - right.globalTime;
    });
}
