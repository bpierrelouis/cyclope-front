import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { ELevelLabel, iconSizes } from '../../constants';

export function ConfigBadges(props) {
    const { config } = props;
    if (!config) return;

    const { frameStep, objectDetectionEnabled, processingLevel } = config;

    return (
        <span className='flex items-center gap-1 opacity-70 tabular-nums text-xs leading-none'>
            <span>{frameStep}s</span>
            {!objectDetectionEnabled ? (
                <EyeIcon size={iconSizes.xs} />
            ) : (
                <EyeOffIcon size={iconSizes.xs} className='opacity-40' />
            )}
            <span>
                {ELevelLabel[processingLevel]}
            </span>
        </span>
    );
}
