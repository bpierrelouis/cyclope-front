import { Field } from './Field';

export function ProcessLevelField(props) {
    const { config, setPartialConfig } = props;
    const key = 'processingLevel';
    const value = config[key];

    const handleChange = (event) =>
        setPartialConfig({ [key]: Number(event.target.value) });

    return (
        <Field label='Niveau de traitement'>
            <select
                className='w-32 select-sm select'
                value={value}
                onChange={handleChange}
            >
                <option value={2}>Léger</option>
                <option value={3}>Moyen</option>
                <option value={5}>Lourd</option>
            </select>
        </Field>
    );
}
