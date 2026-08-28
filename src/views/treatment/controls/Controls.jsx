import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon, SnowflakeIcon, SquareBottomDashedScissors } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { CaptureDialog } from '../../../components';
import { iconSizes } from '../../../constants';
import { useSelectionContext } from '../../../contexts';
import { playerService } from '../../../services';
import { usePlayerStore } from '../../../stores';
import {
    cn,
    formatTime,
    getTimelineDetections,
    getTimelineFreezingZones,
} from '../../../utils';
import { ProgressBar } from './ProgressBar';

const EPSILON = 0.05; // secondes, pour ne pas rester bloqué sur le pipe courant

export function Controls({ videoRef }) {
    const { source } = useSelectionContext();
    const {
        playing,
        currentTime,
        duration,
    } = usePlayerStore(useShallow((state) => ({
        currentTime: state.currentTime,
        duration: state.duration,
        playing: state.playing,
    })));

    const [skipFreezing, setSkipFreezing] = useState(false);
    const [capture, setCapture] = useState(null);

    const safeDuration = Math.max(duration, 0);
    const showHours = safeDuration >= 3600;
    const detections = useMemo(
        () => getTimelineDetections(source),
        [source],
    );
    const freezingZones = useMemo(
        () => getTimelineFreezingZones(source),
        [source],
    );

    const togglePlaying = () => {
        playerService.sync({ playing: !playing });
    };

    const seek = useCallback((value, { pause = false } = {}) => {
        playerService.sync({
            currentTime: Math.max(0, Math.min(safeDuration || value, value)),
            ...(pause && { playing: false }),
        });
    }, [safeDuration]);

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

    // Capture la frame courante de la vidéo.
    const handleCapture = () => {
        const video = videoRef?.current;
        if (!video?.videoWidth) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        setCapture({
            dataUrl: canvas.toDataURL('image/png'),
            filename: `capture-${formatTime(currentTime).replaceAll(':', '-')}.png`,
        });
    };

    useEffect(() => {
        if (!skipFreezing || !playing) return;
        const t = currentTime;
        const zone = freezingZones.find((z) => t >= z.start && t < z.end);
        if (!zone) return;
        seek(zone.end);
    }, [currentTime, freezingZones, playing, seek, skipFreezing]);

    return (
        <footer className='flex items-center gap-4 col-span-full bg-base-100 p-4 border-base-300 border-t'>
            <div className='flex items-center gap-2'>
                <button
                    type='button'
                    aria-label='Détection précédente'
                    className='btn btn-square'
                    disabled={!previousDetection}
                    onClick={goToPrevDetection}
                >
                    <SkipBackIcon size={iconSizes.sm} />
                </button>
                <button
                    type='button'
                    aria-label={playing ? 'Mettre en pause' : 'Lire'}
                    className='btn btn-square btn-primary'
                    onClick={togglePlaying}
                >
                    {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                    type='button'
                    aria-label='Détection suivante'
                    className='btn btn-square'
                    disabled={!nextDetection}
                    onClick={goToNextDetection}
                >
                    <SkipForwardIcon size={iconSizes.sm} />
                </button>
                <button
                    type='button'
                    aria-label='Activer ou désactiver le saut des frames figées'
                    aria-pressed={skipFreezing}
                    className={cn('tooltip-top btn btn-square tooltip', skipFreezing && 'btn-primary')}
                    onClick={() => setSkipFreezing((enabled) => !enabled)}
                    data-tip='Sauter les frames figées'
                >
                    <SnowflakeIcon size={iconSizes.sm} />
                </button>
                <button
                    type='button'
                    aria-label='Capturer la frame courante'
                    className='tooltip-top btn btn-square tooltip'
                    onClick={handleCapture}
                    data-tip='Capturer l&#39;écran'
                >
                    <SquareBottomDashedScissors size={iconSizes.sm} />
                </button>
                {capture && (
                    <CaptureDialog
                        capture={capture}
                        onClose={()  => setCapture(null)}
                    />
                )}
            </div>

            <span className='min-w-10 font-semibold tabular-nums'>{formatTime(currentTime, showHours)}</span>

            <ProgressBar
                detections={detections}
                zonesFreezing={freezingZones}
                safeDuration={safeDuration}
                seek={seek}
            />

            <span className='opacity-60 min-w-10 font-semibold tabular-nums text-right'>{formatTime(duration, showHours)}</span>
        </footer>
    );
}
