import { useDetectionCatalogStore } from '../../stores';
import { getDetectionColor } from '../../utils';

export function DetectionCell(props) {
    const result = props.data;

    return (
        <div className='flex flex-wrap items-center gap-1'>
            {result.objects?.map((obj, i) => (
                <ConfidenceBadge
                    key={`${result.id}-${i}-${obj.type}`}
                    object={obj}
                />
            ))}
        </div>
    );
}

function ConfidenceBadge(props) {
    const { type, confidence } = props.object;
    const color = useDetectionCatalogStore((state) =>
        getDetectionColor(type, state.detections, state.categories));

    const label = Number.isFinite(confidence)
        ? `${type} ${confidence.toFixed(0)}%`
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
