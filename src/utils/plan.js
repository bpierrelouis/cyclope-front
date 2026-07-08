import { layers, namedFlavor } from '@protomaps/basemaps';
import { Plan } from '../constants';
import { sortByKeyPath } from './others';

export const buildMapStyle = (url, isDark) => {
    //'light', 'dark', 'white', 'grayscale', 'black'
    const theme = namedFlavor(isDark ? 'dark' : 'light');

    return {
        version: 8,
        glyphs: Plan.GLYPHS_URL,
        sprite: Plan.SPRITE_URL,
        sources: {
            protomaps: {
                type: 'vector',
                url: `pmtiles://${url}`,
                minzoom: Plan.MIN_ZOOM,
            },
        },
        layers: layers('protomaps', theme, { lang: 'fr' }),
    };
};

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
