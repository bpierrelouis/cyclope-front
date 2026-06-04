export function StatusBadge(props) {
    const { color, label } = props;

    return (
        <span className={`badge badge-sm badge-soft ${color}`}>
            {label}
        </span>
    );
}
