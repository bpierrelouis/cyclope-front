import { layers, namedFlavor } from '@protomaps/basemaps';

import { Plan } from '../constants';

export const buildMapStyle = (url, isDark) => {
    //'light', 'dark', 'white', 'grayscale', 'black'
    const theme = namedFlavor(isDark ? 'dark' : 'light');

    return {
        glyphs: Plan.GLYPHS_URL,
        layers: layers('protomaps', theme, { lang: 'fr' }),
        sources: {
            protomaps: {
                minzoom: Plan.MIN_ZOOM,
                type: 'vector',
                url: `pmtiles://${url}`,
            },
        },
        sprite: Plan.SPRITE_URL,
        version: 8,
    };
};

export const getMarkerClass = (result, { isEnd, isStart }) => {
    if (isStart) {
        return 'marker-start';
    }
    if (isEnd) {
        return 'marker-end';
    }
    if ((result.objects?.length ?? 0) > 0) {
        return 'marker-step marker-detection';
    }
    return 'marker-step';
};

export const getSequentiallyNumberedResults = (results) => results.map(
    (result, number) => ({ number, result }),
);

export const hasValidCoordinates = (result) =>
    Number.isFinite(result.coordinates?.longitude)
    && Number.isFinite(result.coordinates?.latitude);

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

export const interpolatePosition = (results, time) => {
    const n = results.length;
    if (n === 0) return null;
    if (n === 1) return { ...results[0].coordinates, bearing: 0 };

    if (time <= results[0].seconds) {
        return {
            bearing: bearing(results[0].coordinates, results[1].coordinates),
            ...results[0].coordinates,
        };
    }
    if (time >= results[n - 1].seconds) {
        return {
            bearing: bearing(
                results[n - 2].coordinates,
                results[n - 1].coordinates,
            ),
            ...results[n - 1].coordinates,
        };
    }

    let i = 0;
    while (i < n - 1 && results[i + 1].seconds <= time) i++;
    const a = results[i];
    const b = results[i + 1];
    const span = b.seconds - a.seconds;
    const t = span > 0 ? (time - a.seconds) / span : 0;

    return {
        bearing: bearing(a.coordinates, b.coordinates),
        latitude: a.coordinates.latitude
            + (b.coordinates.latitude - a.coordinates.latitude) * t,
        longitude: a.coordinates.longitude
            + (b.coordinates.longitude - a.coordinates.longitude) * t,
    };
};
