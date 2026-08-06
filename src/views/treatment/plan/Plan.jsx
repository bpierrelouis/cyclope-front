import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map, NavigationControl } from 'react-map-gl/maplibre';
import { useShallow } from 'zustand/react/shallow';
import { Plan as Constants } from '../../../constants';
import { filesQueries, useOpenState } from '../../../hooks';
import { usePlayerStore, useThemeStore } from '../../../stores';
import { buildMapStyle } from '../../../utils';
import { ResultPopup } from '../ResultPopup';
import { DroneMarker } from './DroneMarker';
import { LocateButton } from './LocateButton';
import { Path } from './Path';
import { TargetMarker } from './TargetMarker';

export function Plan() {
    const { results, track } = usePlayerStore(useShallow((state) => ({
        results: state.results,
        track: state.track,
    })));
    const { data: carto } = filesQueries.useCarto();
    const mapRef = useRef(null);
    const isDark = useThemeStore((state) => state.isDark);
    const [selectedResult, setSelectedResult] = useState(null);

    const handleSelectPoint = useCallback((pointId) => {
        const result = (results ?? []).find((r) => r.id === pointId);
        if (result) setSelectedResult(result);
    }, [results]);

    useOpenState('isPlanOpen');

    useEffect(() => {
        const protocol = new Protocol();
        maplibregl.addProtocol('pmtiles', protocol.tile);
        return () => {
            maplibregl.removeProtocol('pmtiles');
        };
    }, []);

    const mapStyle = useMemo(() => {
        if (!carto) return;
        return buildMapStyle(carto, isDark);
    }, [carto, isDark]);

    const pathBounds = useMemo(() => {
        const coordinates = (track ?? []).filter(
            ({ longitude, latitude }) =>
                Number.isFinite(longitude) && Number.isFinite(latitude),
        );
        if (coordinates.length === 0) return null;

        const longitudes = coordinates.map(({ longitude }) => longitude);
        const latitudes = coordinates.map(({ latitude }) => latitude);
        return [
            [Math.min(...longitudes), Math.min(...latitudes)],
            [Math.max(...longitudes), Math.max(...latitudes)],
        ];
    }, [track]);

    const centerMapToPath = useCallback(() => {
        if (!pathBounds) return;
        mapRef.current?.fitBounds(
            pathBounds,
            { padding: 50, duration: 0 },
        );
    }, [pathBounds]);

    return (
        <>
            <Map
                ref={mapRef}
                onLoad={centerMapToPath}
                maxPitch={0}
                minZoom={Constants.MIN_ZOOM}
                maxZoom={Constants.MAX_ZOOM}
                mapStyle={mapStyle}
                style={{ width: '100%', height: '100%', flex: 1, minHeight: 0 }}
            >
                <NavigationControl position='top-right' />
                <LocateButton onClick={centerMapToPath} />
                <Path onSelect={handleSelectPoint} />
                <DroneMarker />
                <TargetMarker />
            </Map>
            {selectedResult && (
                <ResultPopup
                    result={selectedResult}
                    dismiss={() => setSelectedResult(null)}
                />
            )}
        </>
    );
}
