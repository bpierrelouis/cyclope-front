import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { useEffect, useMemo, useRef } from 'react';
import { Map, NavigationControl } from 'react-map-gl/maplibre';
import { MAX_ZOOM, MIN_ZOOM } from '../../../constants';
import { filesQueries } from '../../../hooks';
import { usePlayerStore } from '../../../stores';
import { buildMapStyle, sendOpenStateToMaster, sortAndMapPoints } from '../../../utils';
import { Path } from './Path';

export function Plan() {
    const { isMaster, results } = usePlayerStore();
    const { data: carto } = filesQueries.useCarto();
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

    const points = useMemo(() => {
        return sortAndMapPoints(results ?? []);
    }, [results]);

    const mapStyle = useMemo(() => {
        return buildMapStyle(carto?.downloadUrl);
    }, [carto?.downloadUrl]);

    useEffect(() => {
        if (!points.length || !mapRef.current) return;

        const longitudes = points.map(p => p.longitude);
        const latitudes = points.map(p => p.latitude);

        mapRef.current.fitBounds(
            [[Math.min(longitudes), Math.min(latitudes)], [Math.max(longitudes), Math.max(latitudes)]],
            { padding: 50, duration: 0 },
        );
    }, [points]);

    return (
        <Map
            ref={mapRef}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            mapStyle={mapStyle}
            style={{ width: '100%', height: '100%', flex: 1, minHeight: 0 }}
        >
            <NavigationControl position='top-right' />
            <Path points={points} />
        </Map>
    );
}
