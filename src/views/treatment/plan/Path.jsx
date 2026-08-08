import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/dist/esm/exports-maplibre';
import { useShallow } from 'zustand/react/shallow';

import { usePlayerStore, useTableStore, useThemeStore } from '../../../stores';
import { filterResultsLikeTable } from '../../../utils';
import { Point } from './Point';

const ROUTE_ON_LIGHT_MAP = '#008398';
const ROUTE_ON_DARK_MAP = '#5ad7d7';

export function Path(props) {
    const { onSelect } = props;
    const isDark = useThemeStore((state) => state.isDark);
    const { results, track } = usePlayerStore(useShallow((state) => ({
        results: state.results,
        track: state.track,
    })));
    const filterModel = useTableStore((state) => state.filterModel);

    const routeGeoJson = useMemo(() => ({
        geometry: {
            coordinates: track.map((p) => [p.longitude, p.latitude]),
            type: 'LineString',
        },
        properties: {},
        type: 'Feature',
    }), [track]);


    const visibleIds = useMemo(() => new Set(
        filterResultsLikeTable(results, filterModel).map((result) => result.id),
    ), [results, filterModel]);

    const lineColor = isDark ? ROUTE_ON_DARK_MAP : ROUTE_ON_LIGHT_MAP;

    return (<>
        <Source id='route-line' type='geojson' data={routeGeoJson}>
            <Layer
                id='route-line-layer'
                type='line'
                paint={{
                    'line-color': lineColor,
                    'line-dasharray': [2, 1.5],
                    'line-opacity': 0.75,
                    'line-width': 4,
                }}
                layout={{
                    'line-cap': 'butt',
                    'line-join': 'round',
                }} />
        </Source>
        {track
            .filter((point) => visibleIds.has(point.id))
            .map((point) => (
                <Point
                    key={point.id}
                    point={point}
                    onSelect={onSelect} />
            ))}
    </>);
}
