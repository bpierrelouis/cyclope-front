import { Marker } from 'react-map-gl/maplibre';
import { useShallow } from 'zustand/react/shallow';
import { usePlayerStore } from '../../../stores';
import { getCurrentResult } from '../../../utils';

export function TargetMarker() {
    const { currentTime, results } = usePlayerStore(useShallow((state) => ({
        currentTime: state.currentTime,
        results: state.results,
    })));

    const target = getCurrentResult(results, currentTime)?.target;

    if (!target) return null;

    return (
        <Marker
            longitude={target.longitude}
            latitude={target.latitude}
            anchor='center'
        >
            <div className='marker-target' title='Cible de vision'>
                <span className='marker-target-core' aria-hidden='true' />
            </div>
        </Marker>
    );
}
