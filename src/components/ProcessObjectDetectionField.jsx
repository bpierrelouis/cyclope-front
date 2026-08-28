import { Field } from './Field';

export function ProcessObjectDetectionField(props) {
    const { config, setPartialConfig } = props;
    const key = 'objectDetectionEnabled';
    const value = config[key];

    const handleChange = (event) =>
        setPartialConfig({ [key]: event.target.checked });

    return (
        <Field label={'Détection d\'objets'}>
            <input
                type='checkbox'
                className='toggle toggle-sm toggle-primary'
                checked={value}
                onChange={handleChange} />
        </Field>
    );
}
