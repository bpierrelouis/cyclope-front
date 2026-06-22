import { layers } from '@protomaps/basemaps';
import { GLYPHS_URL, MAP_THEME, MIN_ZOOM, SPRITE_URL } from '../constants';
import { sortByKeyPath } from './others';

export const buildMapStyle = (url) => ({
    version: 8,
    glyphs: GLYPHS_URL,
    sprite: SPRITE_URL,
    sources: {
        protomaps: {
            type: 'vector',
            url: `pmtiles://${url}`,
            minzoom: MIN_ZOOM,
        },
    },
    layers: layers('protomaps', MAP_THEME, { lang: 'fr' }),
});

export const getPointLabel = (point) => {
    const { index, isStart, isEnd } = point;
    if (isStart) {
        return '🚩';
    } else if (isEnd) {
        return '🏁';
    }
    return String(index + 1);
};

export const getMarkerClass = (point) => {
    if (point.isStart) {
        return 'marker-start';
    } else if (point.isEnd) {
        return 'marker-end';
    }
    return 'marker-step';
};

const pointMapper = (result, index, array) => ({
    id: result.id,
    index,
    isStart: index === 0,
    isEnd: index === array.length - 1,
    ...result.coordinates,
});

export const sortAndMapPoints = (results) =>
    sortByKeyPath(results, 'index').map(pointMapper);
