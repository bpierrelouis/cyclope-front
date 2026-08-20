import { useDetectionCatalogStore } from '../stores';
import { getDetectionColor } from '../utils';

export function ConfidenceBadge(props) {
    const { type, confidence } = props.object;
    const color = useDetectionCatalogStore((state) =>
        getDetectionColor(type, state.detections, state.categories));

    const label = Number.isFinite(confidence)
        ? `${type} ${(confidence * 100).toFixed(0)}%`
        : type;
    const style = {
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
        borderColor: `color-mix(in srgb, ${color} 55%, transparent)`,
        color,
    };

    return (
        <span
            className='badge badge-sm badge-soft badge-primary'
            style={style}
        >
            {label}
        </span>
    );
}
