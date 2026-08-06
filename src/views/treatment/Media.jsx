import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { filesQueries, useOpenState } from '../../hooks';
import { playerService } from '../../services';
import { usePlayerStore } from '../../stores';
import { cn } from '../../utils';

export function Media(props) {
    const videoRef = useRef();

    const {
        playing,
        currentTime,
        media,
        isMaster,
    } = usePlayerStore(useShallow((state) => ({
        playing: state.playing,
        currentTime: state.currentTime,
        media: state.media,
        isMaster: state.isMaster,
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
    }, [playing]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Math.abs(video.currentTime - currentTime) > 0.3) {
            video.currentTime = currentTime;
        }
    }, [currentTime]);

    const handleTimeUpdate = () => {
        if (!isMaster) return;

        const video = videoRef.current;
        playerService.sync({
            currentTime: video.currentTime,
            duration: video.duration,
            media,
        });
    };

    const handleLoadedMetadata = () => {
        if (!isMaster) return;

        const video = videoRef.current;
        const duration = video?.duration ?? 0;
        const currentTime = video?.currentTime ?? 0;

        playerService.sync({
            duration,
            currentTime,
            media,
        });
    };

    if (!media) return null;

    return media.isVideo ? (
        <video
            ref={videoRef}
            // key force le remontage si l'URL change, sinon impossible de capturer l'écran (non secure).
            key={url}
            crossOrigin='anonymous'
            className={cn('flex-1 min-h-0 size-full object-contain', props.hidden && 'hidden')}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            src={url}
            muted
            loop
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
