import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useSelectionContext } from '../../contexts';
import { playerService } from '../../services';
import { usePlayerStore } from '../../stores';
import { formatTime } from '../../utils';

const EPSILON = 0.05; // secondes, pour ne pas rester bloqué sur le pipe courant

export function Controls() {
    const { results } = useSelectionContext();
    const {
        playing,
        currentTime,
        duration,
    } = usePlayerStore();

    const safeDuration = Math.max(duration, 0);
    const progress = safeDuration > 0 ? (currentTime / safeDuration) * 100 : 0;

    // Frames porteuses de détections (objects non vide), avec leur instant en
    // secondes. Calculées dès que les résultats sont là (au montage), sans
    // dépendre de la lecture ni de la durée.
    const detections = useMemo(() => (
        (results ?? [])
            .filter((r) => (r.objects?.length ?? 0) > 0 && r.seconds !== null)
            .sort((a, b) => a.seconds - b.seconds)
    ), [results]);

    const togglePlaying = () => {
        playerService.sync({ playing: !playing });
    };

    const seek = (value) => {
        playerService.sync({
            currentTime: Math.max(0, Math.min(safeDuration || value, value)),
        });
    };

    const onRangeChange = (e) => seek(Number(e.target.value));

    // Navigation de pipe en pipe.
    const goToPrevDetection = () => {
        const prev = [...detections].reverse().find((d) => d.seconds < currentTime - EPSILON);
        if (prev) seek(prev.seconds);
    };
    const goToNextDetection = () => {
        const next = detections.find((d) => d.seconds > currentTime + EPSILON);
        if (next) seek(next.seconds);
    };

    // Repères affichés : seulement ceux positionnables (durée connue + dans la plage).
    const ticks = safeDuration > 0
        ? detections.filter((d) => d.seconds <= safeDuration)
        : [];

    return (
        <footer className='col-span-full cyc-transport'>
            <div className='flex items-center gap-2'>
                <button type='button' className='cyc-tp-btn' onClick={goToPrevDetection} title='Détection précédente'>
                    <SkipBackIcon size={15} />
                </button>
                <button type='button' className='cyc-tp-play' onClick={togglePlaying} title={playing ? 'Pause' : 'Lecture'}>
                    {playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                </button>
                <button type='button' className='cyc-tp-btn' onClick={goToNextDetection} title='Détection suivante'>
                    <SkipForwardIcon size={15} />
                </button>
            </div>

            <span className='cyc-tp-time'>{formatTime(currentTime)}</span>

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
                        title={`Détection · ${formatTime(t.seconds)}`}
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
                    className='absolute inset-0 opacity-0 w-full h-full cursor-pointer'
                />
            </div>

            <span className='cyc-tp-time muted'>{formatTime(duration)}</span>
        </footer>
    );
}
