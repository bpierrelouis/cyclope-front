import { useRef, useState } from 'react';
import { useGlobalSelection } from '../../hooks';
import VideoControls from './VideoControls';

export default function Treatment() {
    const { media } = useGlobalSelection();

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const videoRef = useRef(null);

    const handleSeek = (value) => {
        const video = videoRef.current;
        video.currentTime = value;
        setProgress(value);
    };

    const togglePlay = () => {
        const video = videoRef.current;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;

        setProgress(video.currentTime);
        setDuration(video.duration);
    };

    if (!media) return (null);

    return (
        <div className='flex flex-col size-full'>
            <MediaPlayer
                media={media}
                onTimeUpdate={handleTimeUpdate}
                videoRef={videoRef}
            />
            {media.isVideo && (
                <VideoControls
                    isPlaying={isPlaying}
                    progress={progress}
                    duration={duration}
                    onPlayPause={togglePlay}
                    onSeek={handleSeek}
                />
            )}
        </div>
    );
}

function MediaPlayer(props) {
    const { media, videoRef, onTimeUpdate } = props;

    return media.isVideo ? (
        <video
            ref={videoRef}
            className='flex-1 min-h-0 object-contain'
            onTimeUpdate={onTimeUpdate}
            src={media.url}
        />
    ) : (
        <img
            className='w-full h-full object-contain'
            src={media.url}
            alt={media.name}
        />
    );
}
