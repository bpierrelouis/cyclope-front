import { StarIcon } from 'lucide-react';
import { Marker } from 'react-map-gl/maplibre';
import { cn, getMarkerClass } from '../../../utils';

export function Point(props) {
    const { point, onSelect } = props;
    const { frame, isStart, isEnd, isFavorite } = point;

    const markerClass = getMarkerClass(point);
    const isWaypoint = !isStart && !isEnd;
    const baseTitle = isStart ? 'Depart' : isEnd ? 'Arrivee' : `Frame ${frame}`;
    const title = isFavorite ? `${baseTitle} — Favori` : baseTitle;

    return (
        <Marker
            longitude={point.longitude}
            latitude={point.latitude}
            anchor='center'
        >
            <button
                type='button'
                className={cn('marker-pin', markerClass, isFavorite && 'is-favorite')}
                title={title}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(point.id);
                }}
            >
                {isWaypoint ? (
                    <>
                        {isFavorite && (
                            <StarIcon className='marker-fav-shape' fill='currentColor' aria-hidden='true' />
                        )}
                        <span className='marker-label'>{frame}</span>
                    </>
                ) : (
                    <>
                        <span className='marker-core' aria-hidden='true' />
                        {isFavorite && (
                            <span className='marker-fav' aria-hidden='true'>
                                <StarIcon fill='currentColor' />
                            </span>
                        )}
                    </>
                )}
            </button>
        </Marker>
    );
}
