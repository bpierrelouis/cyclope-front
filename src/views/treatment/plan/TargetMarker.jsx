import { Marker } from 'react-map-gl/maplibre';

import { useCurrentResult } from '../../../hooks';

export function TargetMarker() {
    const target = useCurrentResult()?.target;

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
