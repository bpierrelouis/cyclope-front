import { cn } from '../../utils';

export function StatusBadge(props) {
    const { color, count } = props;

    if (!count) return;

    return (
        <span className={cn('badge badge-sm badge-soft', color)}>
            {count}
        </span>
    );
}
