import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react';
import { SquareButton } from '../../components';
import { playerService } from '../../services';
import { usePlayerStore } from '../../stores';
import { formatTime } from '../../utils';

export function Controls() {
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
            <Button label='Frame précédente'>
                <SkipBackIcon />
            </Button>
            <Button
                label={playing ? 'Pause' : 'Lecture'}
                onClick={togglePlaying}
            >
                {playing ? <PauseIcon /> : <PlayIcon />}
            </Button>
            <Button label='Frame suivante'>
                <SkipForwardIcon />
            </Button>

            <input
                type='range'
                min='0'
                max={rangeMaxValue || 1}
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

function Button(props) {
    return (
        <SquareButton
            {...props}
            className='tooltip-top'
        />
    );
}
