export function ConfidenceBadge(props) {
    const { type, confidence } = props.object;

    const label = `${type} ${(confidence * 100).toFixed(0)}%`;

    return (
        <span className='badge badge-sm badge-soft badge-primary'>
            {label}
        </span>
    );
}
