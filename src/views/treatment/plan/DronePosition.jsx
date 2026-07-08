import { Navigation2Icon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Marker, useMap } from 'react-map-gl/maplibre';
import { Plan } from '../../../constants';
import { usePlayerStore } from '../../../stores';
import { interpolatePosition, sortAndMapPoints } from '../../../utils';

export function DronePosition() {
    const { results, currentTime, playing } = usePlayerStore();
    const { current: map } = useMap();

    const track = useMemo(() => sortAndMapPoints(results), [results]);

    const [pos, setPos] = useState(() => interpolatePosition(track, currentTime));
    const [mapBearing, setMapBearing] = useState(0);

    const animTimeRef = useRef(currentTime);
    const lastWallRef = useRef(0);
    const rafRef = useRef(0);

    useEffect(() => {
        if (!map) return;
        const update = () => setMapBearing(map.getBearing());
        update();
        map.on('rotate', update);
        return () => map.off('rotate', update);
    }, [map]);

    useEffect(() => {
        if (Math.abs(animTimeRef.current - currentTime) > Plan.RESYNC_THRESHOLD) {
            animTimeRef.current = currentTime;
        }
    }, [currentTime]);

    useEffect(() => {
        if (playing) return;
        animTimeRef.current = currentTime;
        setPos(interpolatePosition(track, currentTime));
    }, [playing, currentTime, track]);

    useEffect(() => {
        if (!playing) return;
        animTimeRef.current = currentTime;
        lastWallRef.current = performance.now();

        const tick = (now) => {
            const dt = (now - lastWallRef.current) / 1000;
            lastWallRef.current = now;
            animTimeRef.current += dt;
            setPos(interpolatePosition(track, animTimeRef.current));
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [playing, track]);

    if (!pos) return null;

    return (
        <Marker
            longitude={pos.longitude}
            latitude={pos.latitude}
            anchor='center'
            style={Plan.MARKER_STYLE}
        >
            <div
                className='drone-marker'
                style={{ transform: `rotate(${pos.bearing - mapBearing}deg)` }}
            >
                <Navigation2Icon color='white' fill='currentColor' />
            </div>
        </Marker>
    );
}
