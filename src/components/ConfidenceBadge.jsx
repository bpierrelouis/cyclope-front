import { useDetectionCatalogStore } from '../stores';

export function ConfidenceBadge(props) {
    const { type, confidence } = props.object;
    const color = useDetectionCatalogStore((state) => {
        const detection = state.detections.find(
            (item) => item.name.localeCompare(type, undefined, { sensitivity: 'accent' }) === 0,
        );
        return state.categories.find((category) => category.id === detection?.categoryId)?.color;
    });

    const label = Number.isFinite(confidence)
        ? `${type} ${(confidence * 100).toFixed(0)}%`
        : type;

    return (
        <span
            className='badge badge-sm badge-soft badge-primary'
            style={color ? {
                backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} 55%, transparent)`,
                color,
            } : undefined}
        >
            {label}
        </span>
    );
}
