import { layers } from '@protomaps/basemaps';
import { GLYPHS_URL, MAP_THEME, MIN_ZOOM, SPRITE_URL } from '../constants';

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
    layers: layers('protomaps', MAP_THEME),
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

const compilePath = (path) => {
    const keys = path.split('.');
    return new Function('obj', `return obj?.${keys.join('?.')}`);
};

const sortByKeyPath = (arr, path, dir = 'asc') => {
    const get = compilePath(path);

    return arr.toSorted((a, b) => {
        const va = get(a);
        const vb = get(b);

        if (va === vb) return 0;

        const res = va > vb ? 1 : -1;
        return dir === 'asc' ? res : -res;
    });
};

const pointMapper = (result, index, array) => {
    const { longitude, latitude } = result.response_json.coordinates[0];
    return {
        id: result.id,
        index,
        isStart: index === 0,
        isEnd: index === array.length - 1,
        longitude,
        latitude,
    };
};

export const sortAndMapPoints = (results) =>
    sortByKeyPath(results, 'index').map(pointMapper);
