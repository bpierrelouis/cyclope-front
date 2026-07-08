import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/dist/esm/exports-maplibre';
import { useThemeStore } from '../../../stores';
import { Point } from './Point';

const ROUTE_ON_LIGHT_MAP = '#008398';
const ROUTE_ON_DARK_MAP = '#5ad7d7';

export function Path(props) {
    const { points, onSelect } = props;
    const { isDark } = useThemeStore();

    const routeGeoJson = useMemo(() => ({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: points.map((p) => [p.longitude, p.latitude]),
        },
    }), [points]);

    const lineColor = isDark ? ROUTE_ON_DARK_MAP : ROUTE_ON_LIGHT_MAP;

    return (<>
        <Source id='route-line' type='geojson' data={routeGeoJson}>
            <Layer
                id='route-line-layer'
                type='line'
                paint={{
                    'line-color': lineColor,
                    'line-width': 4,
                    'line-opacity': 0.75,
                    'line-dasharray': [2, 1.5],
                }}
                layout={{
                    'line-cap': 'butt',
                    'line-join': 'round',
                }} />
        </Source>
        {points.map((point) => (
            <Point
                key={point.id}
                point={point}
                onSelect={onSelect} />
        ))}
    </>);
}
