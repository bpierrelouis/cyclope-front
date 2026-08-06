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

export const getMarkerClass = (point) => {
    if (point.isStart) {
        return 'marker-start';
    } else if (point.isEnd) {
        return 'marker-end';
    } else if (point.hasDetection) {
        return 'marker-step marker-detection';
    }
    return 'marker-step';
};

const pointMapper = (result, index, array) => ({
    id: result.id,
    index,
    frame: result.index,
    isStart: index === 0,
    isEnd: index === array.length - 1,
    hasDetection: (result.objects?.length ?? 0) > 0,
    isFavorite: result.isFavorite,
    seconds: result.seconds,
    ...result.coordinates,
});

export const sortAndMapPoints = (results) =>
    sortByKeyPath(results, 'index').map(pointMapper);

const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;

const bearing = (a, b) => {
    const phi1 = toRad(a.latitude);
    const phi2 = toRad(b.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const y = Math.sin(dLon) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2)
        - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

export const interpolatePosition = (track, time) => {
    const n = track.length;
    if (n === 0) return null;
    if (n === 1) return { ...track[0], bearing: 0 };

    if (time <= track[0].seconds) {
        return {
            longitude: track[0].longitude,
            latitude: track[0].latitude,
            bearing: bearing(track[0], track[1]),
        };
    }
    if (time >= track[n - 1].seconds) {
        return {
            longitude: track[n - 1].longitude,
            latitude: track[n - 1].latitude,
            bearing: bearing(track[n - 2], track[n - 1]),
        };
    }

    let i = 0;
    while (i < n - 1 && track[i + 1].seconds <= time) i++;
    const a = track[i];
    const b = track[i + 1];
    const span = b.seconds - a.seconds;
    const t = span > 0 ? (time - a.seconds) / span : 0;

    return {
        longitude: a.longitude + (b.longitude - a.longitude) * t,
        latitude: a.latitude + (b.latitude - a.latitude) * t,
        bearing: bearing(a, b),
    };
};
