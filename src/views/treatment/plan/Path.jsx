import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/dist/esm/exports-maplibre';
import { Point } from './Point';

export function Path(props) {
    const { points } = props;

    const routeGeoJson = useMemo(() => ({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: points.map((p) => [p.longitude, p.latitude]),
        },
    }), [points]);

    return (<>
        <Source id='route-line' type='geojson' data={routeGeoJson}>
            <Layer
                id='route-line-layer'
                type='line'
                paint={{
                    'line-color': '#000',
                    'line-width': 4,
                    'line-opacity': 0.75,
                }}
                layout={{
                    'line-cap': 'round',
                    'line-join': 'round',
                }} />
        </Source>
        {points.map((point) => (
            <Point
                key={point.id}
                point={point} />
        ))}
    </>);
}
