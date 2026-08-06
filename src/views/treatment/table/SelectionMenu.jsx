import { cn } from '../../../utils';

/**
 * Liste commune d'options cochables utilisée par les menus du tableau.
 */
export function SelectionMenu(props) {
    const {
        options,
        selectedValues,
        onToggle,
        emptyLabel,
        resetLabel,
        onReset,
        alwaysShowReset = false,
        className,
    } = props;

    const selected = new Set(selectedValues);

    return (
        <div className={cn(
            'flex flex-col gap-2 bg-base-100 p-2 text-base-content',
            className,
        )}>
            {options.length === 0 && emptyLabel && (
                <span className='opacity-60 text-xs'>{emptyLabel}</span>
            )}

            {options.map(({ value, label }) => (
                <label
                    key={`${label}${value}`}
                    className='flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer'
                >
                    <input
                        type='checkbox'
                        className='checkbox checkbox-xs checkbox-primary'
                        checked={selected.has(value)}
                        onChange={() => onToggle(value)}
                    />
                    {label}
                </label>
            ))}

            {onReset && resetLabel && (alwaysShowReset || selectedValues.length > 0) && (
                <button
                    type='button'
                    onClick={onReset}
                    className='self-start p-0 uppercase btn btn-link btn-sm'
                >
                    {resetLabel}
                </button>
            )}
        </div>
    );
}
