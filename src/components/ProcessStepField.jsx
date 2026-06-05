import { Field } from './Field';

export function ProcessStepField(props) {
    const { config, setPartialConfig, max } = props;
    const key = 'processingInterval';
    const value = config[key];

    const handleChange = (event) =>
        setPartialConfig({ [key]: event.target.value });

    return (
        <Field label='Pas (en secondes)'>
            {max > 0 && (
                <span className='text-xs text-base-content/40'>max : {max}</span>
            )}
            <input
                type='number'
                min={1}
                max={max}
                value={value}
                onChange={handleChange}
                className='w-20 input input-sm' />
        </Field>
    );
}
