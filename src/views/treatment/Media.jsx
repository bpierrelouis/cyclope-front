import { useEffect, useRef } from 'react';
import { playerService } from '../../services/player.service';
import { usePlayerStore } from '../../stores/playerStore';
import { sendOpenStateToMaster } from '../../utils/others';

export default function Media(props) {
    const videoRef = useRef();

    const {
        playing,
        currentTime,
        media,
        isMaster,
    } = usePlayerStore();

    useEffect(() => {
        if (isMaster) return;
        return sendOpenStateToMaster('isMediaOpen');
    }, [isMaster]);

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

    if (!media) return (null);

    return media.isVideo ? (
        <video
            ref={videoRef}
            className={`size-full flex-1 min-h-0 object-contain ${props.hidden ? 'hidden' : ''}`}
            onTimeUpdate={handleTimeUpdate}
            src={media.url}
            muted
            loop
        />
    ) : (
        <img
            className={`w-full h-full object-contain ${props.hidden ? 'hidden' : ''}`}
            src={media.url}
            alt={media.name}
        />
    );
}
