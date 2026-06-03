import { useMissionCreationStore } from '../../../../stores';
import { Field } from './Field';

export function ObjectDetectionField(props) {
    const { file, config } = props;

    const { updatePartialConfig } = useMissionCreationStore();

    const handleObjectDetectionChange = (event) => {
        const objectDetectionEnabled = event.target.checked;
        updatePartialConfig(file.id, { objectDetectionEnabled });
    };
    return (
        <Field label={'Détection d\'objets'}>
            <input
                type='checkbox'
                className='toggle toggle-sm toggle-primary'
                checked={config.objectDetectionEnabled}
                onChange={handleObjectDetectionChange} />
        </Field>
    );
}
