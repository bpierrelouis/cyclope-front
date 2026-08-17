import { useSearchParams } from 'react-router';

import { useSelectionContext } from '../../contexts';
import { treatmentsQueries } from '../../hooks';
import { getConfigDescription } from '../../utils';

export function TreatmentSelector() {
    const { activeItem } = useSelectionContext();
    const media = activeItem?.media;
    const treatment = activeItem?.treatment;
    const [searchParams, setSearchParams] = useSearchParams();

    const { data: treatments } = treatmentsQueries.useGetAllByMediaId(media?.id);

    const handleTreatmentChange = (event) => {
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.set('treatment', event.target.value);
        setSearchParams(nextSearchParams);
    };

    if (!treatment || !treatments) return null;

    if (treatments.length === 1) {
        return (<>
            {getConfigDescription(treatment.config)}
        </>);
    }

    return (
        <select
            className='w-3xs select-sm select'
            value={treatment.id}
            onChange={handleTreatmentChange}
        >
            {treatments.map((t) => (
                <option
                    key={t.id}
                    value={t.id}
                >
                    {getConfigDescription(t.config)}
                </option>
            ))}
        </select>
    );
}
