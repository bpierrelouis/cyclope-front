import { StarIcon } from 'lucide-react';
import { Marker } from 'react-map-gl/maplibre';

import { cn, getMarkerClass } from '../../utils';

export function Point(props) {
    const {
        isEnd, isStart, number, onSelect, result,
    } = props;
    const { latitude, longitude } = result.coordinates;

    const markerClass = getMarkerClass(result, { isEnd, isStart });
    const isWaypoint = !isStart && !isEnd;
    const baseTitle = isStart ? 'Depart' : isEnd ? 'Arrivee' : `Point ${number}`;
    const title = result.isFavorite ? `${baseTitle} — Favori` : baseTitle;

    return (
        <Marker
            longitude={longitude}
            latitude={latitude}
            anchor='center'
        >
            <button
                type='button'
                className={cn('marker-pin', markerClass, result.isFavorite && 'is-favorite')}
                title={title}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(result.id);
                }}
            >
                {isWaypoint ? (
                    <>
                        {result.isFavorite && (
                            <StarIcon className='marker-fav-shape' fill='currentColor' aria-hidden='true' />
                        )}
                        <span className='marker-label'>{number}</span>
                    </>
                ) : (
                    <>
                        <span className='marker-core' aria-hidden='true' />
                        {result.isFavorite && (
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
