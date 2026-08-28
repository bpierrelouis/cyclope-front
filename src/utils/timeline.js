import { hasValidCoordinates } from './plan';
import { buildLowConfidenceZones } from './results';

export const getTimelineDetections = (source) => source.timelineResults
    .filter(({ globalTime, result }) =>
        globalTime !== null && (result.objects?.length ?? 0) > 0)
    .map(({ globalTime, result, treatment }) => ({
        id: `${treatment?.id ?? 'media'}:${result.id}`,
        seconds: globalTime,
    }));

export const getTimelineFreezingZones = (source) => source.items.flatMap((item) => (
    buildLowConfidenceZones(item.results, item.duration).map((zone) => ({
        ...zone,
        end: item.offset + zone.end,
        id: `${item.treatment?.id ?? item.media.id}:${zone.id}`,
        start: item.offset + zone.start,
    }))
));

export const getTimelineResultsById = (source) => new Map(
    source.timelineResults.map((timelineResult) => [
        timelineResult.result.id,
        timelineResult,
    ]),
);

export const getTimelinePositions = (source) => source.timelineResults
    .filter(({ globalTime, result }) =>
        globalTime !== null && hasValidCoordinates(result))
    .map(({ globalTime, result }) => ({
        coordinates: result.coordinates,
        seconds: globalTime,
    }));
