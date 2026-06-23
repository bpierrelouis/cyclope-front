export function StatusTab(props) {
    const { status, label, setter, isSelected, count } = props;

    const title = `${label} (${count ?? '-'})`;

    return (
        <button
            role='tab'
            onClick={() => setter(status)}
            className={`tab ${isSelected ? 'tab-active text-primary border-primary' : ''}`}
        >
            {title}
        </button>
    );
}
