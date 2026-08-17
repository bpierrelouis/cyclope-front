import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/dist/esm/exports-maplibre';

import { useResults } from '../../../hooks';
import { useTableStore, useThemeStore } from '../../../stores';
import {
    filterResultsLikeTable,
    getSequentiallyNumberedResults,
    hasValidCoordinates,
} from '../../../utils';
import { Point } from './Point';

const ROUTE_ON_LIGHT_MAP = '#008398';
const ROUTE_ON_DARK_MAP = '#5ad7d7';

export function Path(props) {
    const { onSelect } = props;
    const results = useResults();
    const isDark = useThemeStore((state) => state.isDark);
    const filterModel = useTableStore((state) => state.filterModel);
    const positionedResults = useMemo(
        () => results.filter(hasValidCoordinates),
        [results],
    );

    const routeGeoJson = useMemo(() => positionedResults.length > 1
        ? {
            geometry: {
                coordinates: positionedResults.map(({ coordinates }) => [
                    coordinates.longitude,
                    coordinates.latitude,
                ]),
                type: 'LineString',
            },
            properties: {},
            type: 'Feature',
        }
        : null, [positionedResults]);


    const visibleIds = useMemo(() => new Set(
        filterResultsLikeTable(results, filterModel).map((result) => result.id),
    ), [results, filterModel]);
    const numberedResults = useMemo(
        () => getSequentiallyNumberedResults(positionedResults),
        [positionedResults],
    );

    const lineColor = isDark ? ROUTE_ON_DARK_MAP : ROUTE_ON_LIGHT_MAP;

    return (<>
        {routeGeoJson && (
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
        )}
        {numberedResults
            .filter(({ result }) => visibleIds.has(result.id))
            .map(({ number, result }) => (
                <Point
                    key={result.id}
                    isEnd={result === positionedResults.at(-1)}
                    isStart={result === positionedResults[0]}
                    number={number}
                    onSelect={onSelect}
                    result={result}
                />
            ))}
    </>);
}
