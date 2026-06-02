import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { useEffect, useMemo, useRef } from 'react';
import { Layer, Map, NavigationControl, Source } from 'react-map-gl/maplibre';
import { INIT_ZOOM, MAX_ZOOM, MIN_ZOOM } from '../../../constants';
import { filesQueries, resultsQueries } from '../../../hooks';
import { usePlayerStore } from '../../../stores';
import { buildMapStyle, sendOpenStateToMaster } from '../../../utils';
import { Point } from './Point';

export function Plan() {
    const {
        isMaster,
    } = usePlayerStore();

    const { data: carto } = filesQueries.useCarto();
    const { data: points } = resultsQueries.useGetAllPointsByTreatmentId(1);
    const mapRef = useRef(null);

    useEffect(() => {
        if (isMaster) return;
        return sendOpenStateToMaster('isPlanOpen');
    }, [isMaster]);

    useEffect(() => {
        const protocol = new Protocol();
        maplibregl.addProtocol('pmtiles', protocol.tile);
        return () => {
            maplibregl.removeProtocol('pmtiles');
        };
    }, []);

    const mapStyle = useMemo(() => {
        return buildMapStyle(carto?.download_url);
    }, [carto?.download_url]);

    const routeGeoJson = useMemo(() => ({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: (points ?? []).map((p) => [p.longitude, p.latitude]),
        },
    }), [points]);

    const initialViewState = useMemo(() => ({
        longitude: points?.[0]?.longitude ?? 0,
        latitude: points?.[0]?.latitude ?? 0,
        zoom: INIT_ZOOM.zoom,
    }), [points]);

    return (
        <Map
            ref={mapRef}
            initialViewState={initialViewState}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            mapStyle={mapStyle}
            style={{ width: '100%', height: '100%', flex: 1, minHeight: 0 }}
        >
            <NavigationControl position='top-right' />
            {points?.length >= 2 && (
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
                        }}
                    />
                </Source>
            )}

            {points?.map((point) => (
                <Point
                    key={point.id}
                    point={point}
                />
            ))}
        </Map>
    );
}
