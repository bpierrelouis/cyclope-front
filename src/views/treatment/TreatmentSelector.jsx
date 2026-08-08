import { useNavigate } from 'react-router';

import { useSelectionContext } from '../../contexts';
import { treatmentsQueries } from '../../hooks';
import { getConfigDescription } from '../../utils';

export function TreatmentSelector() {
    const { media, treatment } = useSelectionContext();
    const navigate = useNavigate();

    const { data: treatments } = treatmentsQueries.useGetAll(
        new URLSearchParams({ media_id: media?.id }),
        { enabled: Boolean(media) },
    );

    const handleTreatmentChange = (event) =>
        navigate(`?treatment=${event.target.value}`);

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

            <option
                value={1}
            >
                autre
            </option>
        </select>
    );
}
