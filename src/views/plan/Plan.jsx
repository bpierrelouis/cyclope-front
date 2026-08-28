import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map, NavigationControl } from 'react-map-gl/maplibre';

import { SelectCarto } from '../../components';
import { Plan as Constants } from '../../constants';
import { useMapStyle, useOpenState, useResults } from '../../hooks';
import { defaultCartoStore } from '../../stores';
import { hasValidCoordinates } from '../../utils';
import { ResultPopup } from '../resultModal';
import { DroneMarker } from './DroneMarker';
import { LocateButton } from './LocateButton';
import { Path } from './Path';
import { TargetMarker } from './TargetMarker';

export function Plan() {
    const results = useResults();
    const [cartoSelected, setCartoSelected] = useState(defaultCartoStore.getState().defaultCarto);

    const mapRef = useRef(null);
    const [selectedResultId, setSelectedResultId] = useState(null);
    const selectedResult = useMemo(
        () => results.find((result) => result.id === selectedResultId) ?? null,
        [results, selectedResultId],
    );

    const handleSelectPoint = useCallback((pointId) => {
        setSelectedResultId(pointId);
    }, []);

    useOpenState('isPlanOpen');

    useEffect(() => {
        const protocol = new Protocol();
        maplibregl.addProtocol('pmtiles', protocol.tile);
        return () => {
            maplibregl.removeProtocol('pmtiles');
        };
    }, []);

    const mapStyle = useMapStyle(cartoSelected);

    const pathBounds = useMemo(() => {
        const coordinates = results
            .filter(hasValidCoordinates)
            .map((result) => result.coordinates);
        if (coordinates.length === 0) return null;

        const longitudes = coordinates.map(({ longitude }) => longitude);
        const latitudes = coordinates.map(({ latitude }) => latitude);
        return [
            [Math.min(...longitudes), Math.min(...latitudes)],
            [Math.max(...longitudes), Math.max(...latitudes)],
        ];
    }, [results]);

    const centerMapToPath = useCallback(() => {
        if (!pathBounds) return;
        mapRef.current?.fitBounds(
            pathBounds,
            { duration: 0, padding: 50 },
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
                style={{
                    flex: 1, height: '100%', minHeight: 0, width: '100%',
                }}
            >
                <NavigationControl position='top-right' />
                <LocateButton onClick={centerMapToPath} />
                <Path onSelect={handleSelectPoint} />
                <DroneMarker />
                <TargetMarker />
            </Map>
            <SelectCarto
                className='absolute inset-2'
                onChange={setCartoSelected}
                value={cartoSelected}
            />
            {selectedResult && (
                <ResultPopup
                    result={selectedResult}
                    dismiss={() => setSelectedResultId(null)}
                />
            )}
        </>
    );
}
