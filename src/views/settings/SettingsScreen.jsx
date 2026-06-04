import { RangeSettings } from './RangeSettings.jsx';
import { formatForExtractionFrame } from '../../utils/index.js';
import {useLocalStorage} from './useLocalStorage.js';

export function SettingsScreen() {
    const [frameInterval, setFrameInterval] = useLocalStorage('frameInterval', 1 / 30);
    console.log(frameInterval);

    return (
        <div className='flex flex-col gap-4 p-4'>
            <RangeSettings
                title="Taux d'extraction des frames"
                min={1 / 30}
                max={600}
                scale='log'
                value={frameInterval}
                onChange={setFrameInterval}
                format={formatForExtractionFrame}
                ticks={['30 fps', '1 fps', '1/min', '1/10min']}
            />
        </div>
    );
}