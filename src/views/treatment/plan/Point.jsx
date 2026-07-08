import { Marker } from 'react-map-gl/maplibre';
import { getMarkerClass } from '../../../utils';

export function Point(props) {
    const { point, onSelect } = props;
    const { frame, isStart, isEnd } = point;

    const markerClass = getMarkerClass(point);
    const isWaypoint = !isStart && !isEnd;
    const title = isStart ? 'Depart' : isEnd ? 'Arrivee' : `Frame ${frame}`;

    return (
        <Marker
            longitude={point.longitude}
            latitude={point.latitude}
            anchor='center'
        >
            <button
                type='button'
                className={`marker-pin ${markerClass}`}
                title={title}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(point.id);
                }}
            >
                {isWaypoint
                    ? <span className='marker-label'>{frame}</span>
                    : <span className='marker-core' aria-hidden='true' />}
            </button>
        </Marker>
    );
}
