import { usePlayerStore } from '../../../stores';
import { formatTime } from '../../../utils';

export function ProgressBar(props) {
    const { detections, zonesFreezing, safeDuration, seek } = props;

    const { currentTime } = usePlayerStore();

    // Repères affichés : seulement ceux positionnables (durée connue + dans la plage).
    const ticks = safeDuration > 0
        ? detections.filter((d) => d.seconds <= safeDuration)
        : [];

    const onRangeChange = (e) => seek(Number(e.target.value));

    const getTickPosition = (seconds) => {
        const ratio = seconds / safeDuration;
        // Le thumb de range-xs mesure 1rem : son centre se déplace entre
        // 0.5rem et la largeur totale moins 0.5rem.
        return `calc(${ratio * 100}% + ${0.5 - ratio}rem)`;
    };

    return (
        <div className='relative flex flex-1 items-center h-10'>
            <input
                type='range'
                min='0'
                max={safeDuration || 1}
                step='0.01'
                value={currentTime}
                onChange={onRangeChange}
                aria-label='Position de lecture'
                className='z-10 w-full range range-primary range-xs'
            />
            {zonesFreezing.map((zone) => (
                <div
                    key={zone.id}
                    className='cyc-scrub-dead'
                    style={{
                        left: `${(zone.start / safeDuration) * 100}%`,
                        width: `${((zone.end - zone.start) / safeDuration) * 100}%`,
                    }}
                    title='Freezing'
                />
            ))}
            {ticks.map((t) => (
                <button
                    type='button'
                    key={t.id}
                    className='top-0 z-10 absolute flex justify-center items-center w-6 h-full -translate-x-1/2 cursor-pointer'
                    style={{
                        left: getTickPosition(t.seconds),
                    }}
                    onClick={() => seek(t.seconds, { pause: true })}
                    aria-label={`Aller à la détection à ${formatTime(t.seconds)}`}
                    title={`Détection · ${formatTime(t.seconds)}`}
                >
                    <span className='bg-warning rounded-full w-1 h-8' />
                </button>
            ))}
        </div>
    );
}
