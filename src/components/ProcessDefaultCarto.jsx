import { useDefaultCartoStore } from '../stores';
import { Field } from './Field';
import { SelectCarto } from './SelectCarto';

export function ProcessDefaultCarto() {
    const { setDefaultCarto, defaultCarto } = useDefaultCartoStore();

    return (
        <Field label='Fond de carte par défaut'>
            <SelectCarto
                onChange={setDefaultCarto}
                value={defaultCarto}
            />
        </Field>
    );
}
