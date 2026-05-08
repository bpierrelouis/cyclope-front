import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { playerService } from '../../services/player.service';
import { usePlayerStore } from '../../stores/playerStore';
import { formatTime } from '../../utils/labels';

export default function Controls() {
    const {
        playing,
        currentTime,
        duration,
    } = usePlayerStore();

    const rangeMaxValue = duration;
    const rangeValue = currentTime;

    const togglePlaying = () => {
        playerService.sync({
            playing: !playing,
        });
    };

    const onRangeChange = (e) => {
        playerService.sync({
            currentTime:
                Number(e.target.value),
        });
    };

    return (
        <div className='flex items-center gap-1 mx-4 my-1'>
            <button className='btn-shadow btn btn-circle'>
                <SkipBack />
            </button>
            <button
                className='btn-shadow btn btn-circle'
                onClick={togglePlaying}
            >
                {playing ? <Pause /> : <Play />}
            </button>
            <button className='btn-shadow btn btn-circle'>
                <SkipForward />
            </button>

            <input
                type='range'
                min='0'
                max={rangeMaxValue}
                value={rangeValue}
                onChange={onRangeChange}
                className='flex-1 range range-primary range-xs'
            />

            <span className='w-24 text-sm text-right'>
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>
        </div>
    );
}