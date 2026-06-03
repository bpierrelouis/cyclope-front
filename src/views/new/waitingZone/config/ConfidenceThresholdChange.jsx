import { useMissionCreationStore } from '../../../../stores';
import { Field } from './Field';

export function ConfidenceThresholdChange(props) {
    const { file, config } = props;

    const { updatePartialConfig } = useMissionCreationStore();

    const handleConfidenceChange = (event) => {
        const confidenceThreshold = Number(event.target.value);
        updatePartialConfig(file.id, { confidenceThreshold });
    };

    return (
        <Field label='Seuil de confiance'>
            <span className='tabular-nums'>
                {config.confidenceThreshold}%
            </span>
            <input
                type='range'
                min={0}
                max={100}
                value={config.confidenceThreshold}
                onChange={handleConfidenceChange}
                className='w-32 range range-xs range-primary' />
        </Field>
    );
}
