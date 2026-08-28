import { Field } from './Field';

export function ProcessConfidenceField(props) {
    const { config, setPartialConfig } = props;
    const key = 'confidenceThreshold';
    const value = config[key];

    const handleChange = (event) =>
        setPartialConfig({ [key]: Number(event.target.value) });

    return (
        <Field label='Seuil de confiance'>
            <span className='tabular-nums'>
                {value}%
            </span>
            <input
                type='range'
                min={0}
                max={100}
                value={value}
                onChange={handleChange}
                className='w-32 range range-xs range-primary' />
        </Field>
    );
}
