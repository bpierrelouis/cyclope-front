import { BOX_HANDLES } from '../../../constants';
import { cn, getDetectionBackgroundStyle } from '../../../utils';

export function DetectionBox(props) {
    const {
        box, color, isSelected, object, onBoxDown, onHandleDown,
    } = props;

    return (
        <div
            className={cn('absolute border-2 cursor-move', !object.type && 'border-dashed')}
            style={{
                borderColor: color,
                height: `${box.height * 100}%`,
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
            }}
            onPointerDown={onBoxDown}
        >
            <span
                className='-top-5 -left-0.5 absolute px-1 rounded-sm text-white text-xs whitespace-nowrap'
                style={getDetectionBackgroundStyle(color)}
            >
                {object.type ?? '?'}
            </span>
            {isSelected && BOX_HANDLES.map((handle) => (
                <span
                    key={handle.className}
                    className={cn(
                        'absolute bg-base-100 border-2 rounded-full w-3 h-3',
                        handle.className,
                    )}
                    style={{ borderColor: color }}
                    onPointerDown={onHandleDown(handle)}
                />
            ))}
        </div>
    );
}
