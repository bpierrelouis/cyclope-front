import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useSelectionContext } from '../../contexts';
import {
    filesQueries,
    useCurrentTime,
    useOpenState,
} from '../../hooks';
import { getGlobalTimelineTime } from '../../models';
import { playerService } from '../../services';
import { usePlayerStore } from '../../stores';
import { cn } from '../../utils';

export function Media(props) {
    const localVideoRef = useRef(null);
    const videoRef = props.videoRef ?? localVideoRef;
    const { activeItem, source } = useSelectionContext();
    const media = activeItem?.media;
    const currentTime = useCurrentTime();

    const {
        playing,
        isMaster,
    } = usePlayerStore(useShallow((state) => ({
        isMaster: state.isMaster,
        playing: state.playing,
    })));

    const { data: url } = filesQueries.useGetContent(media?.url);

    useOpenState('isMediaOpen');

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (playing) {
            video.play();
        } else {
            video.pause();
        }
    }, [media?.id, playing, url, videoRef]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Math.abs(video.currentTime - currentTime) > 0.3) {
            video.currentTime = currentTime;
        }
    }, [currentTime, media?.id, url, videoRef]);

    const handleVideoUpdate = (event) => {
        if (!isMaster) return;

        const video = event.currentTarget;
        playerService.sync({
            currentTime: getGlobalTimelineTime(activeItem, video.currentTime),
            ...(event.type === 'loadedmetadata' && {
                duration: source.items.length === 1
                    ? video.duration
                    : source.duration,
            }),
        });
    };

    const handleEnded = () => {
        if (!isMaster) return;

        const nextTime = activeItem.offset + activeItem.duration;
        if (nextTime < source.duration) {
            playerService.sync({ currentTime: nextTime });
            return;
        }

        playerService.sync({ currentTime: 0 });
        if (playing) videoRef.current?.play();
    };

    if (!media) return null;

    return media.isVideo ? (
        <video
            ref={videoRef}
            // Force le remontage entre deux segments utilisant éventuellement le même fichier.
            key={media.id}
            crossOrigin='anonymous'
            className={cn('flex-1 min-h-0 size-full object-contain', props.hidden && 'hidden')}
            onEnded={handleEnded}
            onLoadedMetadata={handleVideoUpdate}
            onTimeUpdate={handleVideoUpdate}
            src={url}
            muted
        />
    ) : (
        <img
            crossOrigin='anonymous'
            className={cn('w-full h-full object-contain', props.hidden && 'hidden')}
            src={url}
            alt={media.name}
        />
    );
}
