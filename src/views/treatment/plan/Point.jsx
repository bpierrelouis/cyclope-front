import { Marker } from 'react-map-gl/maplibre';
import { getMarkerClass, getPointLabel } from '../../../utils';

export function Point(props) {
    const { point } = props;
    const { index } = point;

    const markerClass = getMarkerClass(point);
    const label = getPointLabel(point);

    return (
        <Marker
            key={point.id}
            longitude={point.longitude}
            latitude={point.latitude}
            anchor='bottom'
        >
            <div
                className={`marker-pin ${markerClass}`}
                title={`Point ${index + 1}`}
            >
                {label}
            </div>
        </Marker>
    );
}
