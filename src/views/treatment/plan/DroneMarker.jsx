import { Navigation2Icon } from 'lucide-react';
import {
    useEffect, useMemo, useRef, useState,
} from 'react';
import { Marker, useMap } from 'react-map-gl/maplibre';
import { useShallow } from 'zustand/react/shallow';

import { Plan } from '../../../constants';
import { useSelectionContext } from '../../../contexts';
import { usePlayerStore } from '../../../stores';
import { getTimelinePositions, interpolatePosition } from '../../../utils';

export function DroneMarker() {
    const { source } = useSelectionContext();
    const results = useMemo(
        () => getTimelinePositions(source),
        [source],
    );
    const { currentTime, playing } = usePlayerStore(useShallow((state) => ({
        currentTime: state.currentTime,
        playing: state.playing,
    })));
    const { current: map } = useMap();

    const [animatedPos, setAnimatedPos] = useState(() => interpolatePosition(results, currentTime));
    const [mapBearing, setMapBearing] = useState(0);

    const animTimeRef = useRef(currentTime);
    const currentTimeRef = useRef(currentTime);
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
        currentTimeRef.current = currentTime;
        if (Math.abs(animTimeRef.current - currentTimeRef.current) > Plan.RESYNC_THRESHOLD) {
            animTimeRef.current = currentTimeRef.current;
        }
    }, [currentTime]);

    useEffect(() => {
        if (!playing) return;
        animTimeRef.current = currentTimeRef.current;
        lastWallRef.current = performance.now();

        const tick = (now) => {
            const dt = (now - lastWallRef.current) / 1000;
            lastWallRef.current = now;
            animTimeRef.current += dt;
            setAnimatedPos(interpolatePosition(results, animTimeRef.current));
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [playing, results]);

    const pos = playing
        ? animatedPos
        : interpolatePosition(results, currentTime);

    if (!pos) return null;

    return (
        <Marker
            longitude={pos.longitude}
            latitude={pos.latitude}
            anchor='center'
            style={Plan.MARKER_STYLE}
        >
            <div
                className='flex justify-center items-center drop-shadow-[0_0_6px_color-mix(in_oklch,var(--color-primary)_55%,transparent)] text-primary transition-transform duration-75 pointer-events-none'
                style={{ transform: `rotate(${pos.bearing - mapBearing}deg)` }}
            >
                <Navigation2Icon color='white' fill='currentColor' />
            </div>
        </Marker>
    );
}
