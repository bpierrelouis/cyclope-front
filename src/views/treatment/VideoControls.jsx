import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { formatTime } from '../../utils/labels';

export default function VideoControls({
    isPlaying,
    progress,
    duration,
    onPlayPause,
    onSeek,
}) {
    return (
        <div className='flex items-center gap-1 mx-4 my-1'>
            <button className='btn-shadow btn btn-circle'>
                <SkipBack />
            </button>
            <button
                className='btn-shadow btn btn-circle'
                onClick={onPlayPause}
            >
                {isPlaying ? <Pause /> : <Play />}
            </button>
            <button className='btn-shadow btn btn-circle'>
                <SkipForward />
            </button>

            <input
                type='range'
                min='0'
                max={duration || 0}
                value={progress}
                onChange={(e) => onSeek(Number(e.target.value))}
                className='flex-1 range range-primary range-xs'
            />

            <span className='w-24 text-sm text-right'>
                {formatTime(progress)} / {formatTime(duration)}
            </span>
        </div>
    );
}