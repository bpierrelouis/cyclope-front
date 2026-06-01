import { STATUS_LABELS } from '../../constants';
import { missionsQueries } from '../../hooks';

export function StatusTab(props) {
    const { status, setter, isSelected } = props;

    const { data } = missionsQueries.useGetAllByStatus(status);

    const count = data === undefined ? '-' : Number(data.length);
    const label = `${STATUS_LABELS[status]} (${count})`;

    return (
        <button
            role='tab'
            onClick={() => setter(status)}
            className={`tab ${isSelected ? 'tab-active text-primary border-primary' : ''}`}
        >
            {label}
        </button>
    );
}
