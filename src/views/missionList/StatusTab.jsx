import { cn } from '../../utils';

export function StatusTab(props) {
    const { status, label, setter, isSelected, count } = props;

    const title = `${label} (${count ?? '-'})`;
    const className = cn(
        'tab',
        isSelected && 'tab-active text-primary border-primary',
    );

    return (
        <button
            role='tab'
            onClick={() => setter(status)}
            className={className}
        >
            {title}
        </button>
    );
}
