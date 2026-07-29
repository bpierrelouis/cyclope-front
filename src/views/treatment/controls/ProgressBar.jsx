import { usePlayerStore } from '../../../stores';
import { formatTime } from '../../../utils';

export function ProgressBar(props) {
    const { detections, zonesFreezing, safeDuration, seek } = props;

    const { currentTime } = usePlayerStore();

    // Repères affichés : seulement ceux positionnables (durée connue + dans la plage).
    const ticks = safeDuration > 0
        ? detections.filter((d) => d.seconds <= safeDuration)
        : [];

    const progress = safeDuration > 0 ? (currentTime / safeDuration) * 100 : 0;

    const onRangeChange = (e) => seek(Number(e.target.value));

    return (
        <div className='cyc-scrub'>
            <div className='cyc-scrub-rail' />
            <div className='cyc-scrub-fill' style={{ width: `${progress}%` }} />
            {ticks.map((t) => (
                <div
                    key={t.id}
                    className='cyc-scrub-tick'
                    style={{
                        left: `${(t.seconds / safeDuration) * 100}%`,
                        background: 'var(--color-warning)',
                    }}
                    title={`Détection · ${formatTime(t.seconds)}`} />
            ))}
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
            <div className='cyc-scrub-head' style={{ left: `${progress}%` }} />
            <div className='cyc-scrub-dot' style={{ left: `${progress}%` }} />
            <input
                type='range'
                min='0'
                max={safeDuration || 1}
                step='0.01'
                value={currentTime}
                onChange={onRangeChange}
                className='absolute inset-0 opacity-0 w-full h-full cursor-pointer' />
        </div>
    );
}
