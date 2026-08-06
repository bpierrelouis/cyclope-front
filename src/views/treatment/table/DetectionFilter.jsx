import { useMemo } from 'react';
import { usePlayerStore } from '../../../stores';
import { SelectionMenu } from './SelectionMenu';

/**
 * Filtre de la colonne Détection : coche les types d'objets à conserver.
 * Une ligne passe si elle contient au moins un des types cochés.
 */
export function DetectionFilter(props) {
    const { model, onModelChange } = props;

    const results = usePlayerStore((state) => state.results);
    const selectedTypes = useMemo(() => model?.values ?? [], [model]);

    const availableTypes = useMemo(() => {
        const types = (results ?? []).flatMap(
            (result) => result.objects?.map(({ type }) => type) ?? [],
        );
        return [...new Set(types)].sort();
    }, [results]);

    const options = useMemo(
        () => availableTypes.map((type) => ({ value: type, label: type })),
        [availableTypes],
    );

    const toggleType = (type) => {
        const types = selectedTypes.includes(type)
            ? selectedTypes.filter((selected) => selected !== type)
            : [...selectedTypes, type];
        onModelChange(types.length > 0
            ? { filterType: 'detection', values: types }
            : null);
    };

    return (
        <SelectionMenu
            options={options}
            selectedValues={selectedTypes}
            onToggle={toggleType}
            emptyLabel='Aucune détection'
            resetLabel='Réinitialiser'
            onReset={() => onModelChange(null)}
            className='min-w-40'
        />
    );
}
