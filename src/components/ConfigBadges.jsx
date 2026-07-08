import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { ELevelLabel, iconSizes } from '../constants';

export function ConfigBadges(props) {
    const { config } = props;
    if (!config) return;

    const { frameStep, objectDetectionEnabled, processingLevel } = config;

    return (
        <span className='flex items-center gap-1.5 opacity-70 font-mono tabular-nums text-[10px] leading-none'>
            <span>{frameStep}s</span>
            {objectDetectionEnabled ? (
                <EyeIcon size={iconSizes.xs} className='text-primary' />
            ) : (
                <EyeOffIcon size={iconSizes.xs} className='opacity-40' />
            )}
            <span>
                {ELevelLabel[processingLevel]}
            </span>
        </span>
    );
}
