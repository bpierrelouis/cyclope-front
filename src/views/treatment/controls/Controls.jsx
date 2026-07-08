import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react';
import { useMemo } from 'react';
import { iconSizes } from '../../../constants';
import { useSelectionContext } from '../../../contexts';
import { playerService } from '../../../services';
import { usePlayerStore } from '../../../stores';
import { formatTime } from '../../../utils';
import { ProgressBar } from './ProgressBar';

const EPSILON = 0.05; // secondes, pour ne pas rester bloqué sur le pipe courant

export function Controls() {
    const { results } = useSelectionContext();
    const {
        playing,
        currentTime,
        duration,
    } = usePlayerStore();

    const safeDuration = Math.max(duration, 0);

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

    const seek = (value, { pause = false } = {}) => {
        playerService.sync({
            currentTime: Math.max(0, Math.min(safeDuration || value, value)),
            ...(pause && { playing: false }),
        });
    };

    const previousDetection = detections.findLast(
        (d) => d.seconds < currentTime - EPSILON,
    );

    const nextDetection = detections.find(
        (d) => d.seconds > currentTime + EPSILON,
    );

    // Navigation de pipe en pipe.
    const goToPrevDetection = () => {
        if (!previousDetection) return;
        seek(previousDetection.seconds, { pause: true });
    };

    const goToNextDetection = () => {
        if (!nextDetection) return;
        seek(nextDetection.seconds, { pause: true });
    };

    return (
        <footer className='col-span-full cyc-transport'>
            <div className='flex items-center gap-2'>
                <button className='btn btn-square' onClick={goToPrevDetection} disabled={!previousDetection}>
                    <SkipBackIcon size={iconSizes.sm} />
                </button>
                <button className='btn btn-square btn-primary' onClick={togglePlaying}>
                    {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button className='btn btn-square' onClick={goToNextDetection} disabled={!nextDetection}>
                    <SkipForwardIcon size={iconSizes.sm} />
                </button>
            </div>

            <span className='cyc-tp-time'>{formatTime(currentTime)}</span>

            <ProgressBar
                detections={detections}
                safeDuration={safeDuration}
                seek={seek}
            />

            <span className='cyc-tp-time muted'>{formatTime(duration)}</span>
        </footer>
    );
}
