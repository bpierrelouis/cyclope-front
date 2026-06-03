import { useMissionCreationStore } from '../../../../stores';
import { Field } from './Field';

export function ProcessingLevelField(props) {
    const { file, config } = props;

    const { updatePartialConfig } = useMissionCreationStore();

    const handleProcessingLevelChange = (event) => {
        const processingLevel = event.target.value;
        updatePartialConfig(file.id, { processingLevel });
    };

    return (
        <Field label='Niveau de traitement'>
            <select
                className='w-32 select-sm select'
                value={config.processingLevel}
                onChange={handleProcessingLevelChange}
            >
                <option value='low'>Léger</option>
                <option value='medium'>Moyen</option>
                <option value='high'>Lourd</option>
            </select>
        </Field>
    );
}
