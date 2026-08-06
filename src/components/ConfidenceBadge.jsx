export function ConfidenceBadge(props) {
    const { type, confidence } = props.object;

    const label = Number.isFinite(confidence)
        ? `${type} ${(confidence * 100).toFixed(0)}%`
        : type;

    return (
        <span className='badge badge-sm badge-soft badge-primary'>
            {label}
        </span>
    );
}
