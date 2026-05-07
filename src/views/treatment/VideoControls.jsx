import { PauseIcon, PlayIcon } from '../../assets/icons';
import { formatTime } from '../../utils/labels';

export default function VideoControls({
    isPlaying,
    progress,
    duration,
    onPlayPause,
    onSeek,
}) {
    return (
        <div className='flex items-center gap-4 mx-4 my-1'>
            <button
                className='btn btn-circle btn-primary btn-soft'
                onClick={onPlayPause}
            >
                {(isPlaying ? PauseIcon : PlayIcon)({ className: 'size-5' })}
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