import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon, SnowflakeIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { iconSizes } from '../../../constants';
import { useSelectionContext } from '../../../contexts';
import { playerService } from '../../../services';
import { usePlayerStore } from '../../../stores';
import { buildLowConfidenceZones, cn, formatTime } from '../../../utils';
import { ProgressBar } from './ProgressBar';

const EPSILON = 0.05; // secondes, pour ne pas rester bloqué sur le pipe courant

export function Controls() {
    const { results } = useSelectionContext();
    const {
        playing,
        currentTime,
        duration,
    } = usePlayerStore();

    const [skipFreezing, setSkipFreezing] = useState(false);

    const safeDuration = Math.max(duration, 0);
    const zonesFreezing = buildLowConfidenceZones(results, duration);

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

    useEffect(() => {
        if (!skipFreezing || !playing) return;
        const t = currentTime;
        const zone = zonesFreezing.find((z) => t >= z.start && t < z.end);
        if (!zone) return;
        seek(zone.end);
    }, [currentTime, playing, skipFreezing, zonesFreezing]);

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
                <button
                    className={cn('tooltip-top btn btn-square tooltip', skipFreezing && 'btn-primary')}
                    onClick={() => setSkipFreezing((enabled) => !enabled)}
                    data-tip='Sauter les frames figées'
                >
                    <SnowflakeIcon size={iconSizes.sm} />
                </button>
            </div>

            <span className='cyc-tp-time'>{formatTime(currentTime)}</span>

            <ProgressBar
                detections={detections}
                zonesFreezing={zonesFreezing}
                safeDuration={safeDuration}
                seek={seek}
            />

            <span className='cyc-tp-time muted'>{formatTime(duration)}</span>
        </footer>
    );
}
