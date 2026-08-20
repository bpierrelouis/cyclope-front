import { useEffect, useMemo } from 'react';

import { SUPPORTED_CARTO_EXTENSIONS } from '../constants';
import { filesQueries } from '../hooks';
import { cn, flatTree } from '../utils';

function findCartoById(cartos, id) {
    return cartos.find((carto) => Number(carto.id) === Number(id));
}

export function SelectCarto(props) {
    const { className, onChange, value } = props;
    const { data: cartoTree = [] } = filesQueries.useGetTreeCarto();
    const cartoFiles = useMemo(
        () => flatTree(Array.isArray(cartoTree) ? cartoTree : [])
            .filter((file) =>
                file.url && SUPPORTED_CARTO_EXTENSIONS.includes(file.extension),
            ),
        [cartoTree],
    );

    useEffect(() => {
        if (cartoFiles.length === 0) return;

        const selectedCarto = findCartoById(cartoFiles, value?.id);
        if (selectedCarto !== value) onChange(selectedCarto ?? cartoFiles[0]);
    }, [cartoFiles, onChange, value]);

    const handleChange = ({ target }) => {
        const selectedCarto = findCartoById(cartoFiles, target.value);
        if (selectedCarto) onChange(selectedCarto);
    };

    if (!cartoFiles.length) return null;

    return (
        <select
            aria-label='Fond de carte'
            className={cn('w-3xs text-base-content select', className)}
            onChange={handleChange}
            value={value?.id ?? ''}
        >
            {cartoFiles.map((cartoFile) => (
                <option
                    key={cartoFile.id}
                    value={cartoFile.id}
                >
                    {cartoFile.name}
                </option>
            ))}
        </select>
    );
}
