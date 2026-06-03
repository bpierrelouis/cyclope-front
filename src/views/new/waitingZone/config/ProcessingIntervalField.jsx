import { useMissionCreationStore } from '../../../../stores';
import { Field } from './Field';

export function ProcessingIntervalField(props) {
    const { file, config } = props;

    const { updatePartialConfig } = useMissionCreationStore();

    const handleIntervalChange = (event) => {
        const value = Number(event.target.value);
        const processingInterval = Math.max(1, Math.min(value, file.duration));
        updatePartialConfig(file.id, { processingInterval });
    };

    return (
        <Field label='Nombre de traitements'>
            <span className='text-xs text-base-content/40'>max : {file.duration}</span>
            <input
                type='number'
                min={1}
                max={file.duration}
                value={config.processingInterval}
                onChange={handleIntervalChange}
                className='w-20 input input-sm' />
        </Field>
    );
}
