import { LocateIcon } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import { useEffect, useMemo, useRef } from 'react';
import { Map, NavigationControl } from 'react-map-gl/maplibre';
import { MAX_ZOOM, MIN_ZOOM } from '../../../constants';
import { filesQueries } from '../../../hooks';
import { usePlayerStore, useThemeStore } from '../../../stores';
import { buildMapStyle, sendOpenStateToMaster, sortAndMapPoints } from '../../../utils';
import { Path } from './Path';

export function Plan() {
    const { isMaster, results } = usePlayerStore();
    const { data: carto } = filesQueries.useCarto();
    const mapRef = useRef(null);
    const { isDark } = useThemeStore();


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
        return buildMapStyle(carto, isDark);
    }, [carto, isDark]);

    const centerMapToPath = async () => {
        if (!points?.length) return;

        const longitudes = points.map(p => p.longitude).filter(Boolean);
        const latitudes = points.map(p => p.latitude).filter(Boolean);

        const min = [Math.min(...longitudes), Math.min(...latitudes)];
        const max = [Math.max(...longitudes), Math.max(...latitudes)];

        mapRef.current?.fitBounds(
            [min, max],
            { padding: 50, duration: 0 },
        );
    };

    return (
        <Map
            ref={mapRef}
            onLoad={centerMapToPath}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            mapStyle={mapStyle}
            style={{ width: '100%', height: '100%', flex: 1, minHeight: 0 }}
        >
            <NavigationControl />
            <div className='top-25 right-[10px] z-10 absolute'>
                <button
                    className='maplibregl-ctrl-group size-[29px] maplibregl-ctrl btn btn-square'
                    onClick={centerMapToPath}
                >
                    <LocateIcon size={18} />
                </button>
            </div>
            <Path points={points} />
        </Map>
    );
}
