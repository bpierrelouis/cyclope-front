import { Trash2Icon } from 'lucide-react';

import { cn } from '../utils';

export function DeleteButton(props) {
    const { className, ...buttonProps } = props;

    return (
        <button
            {...buttonProps}
            type='button'
            className={cn(
                'btn btn-circle btn-ghost btn-xs text-error/70 hover:bg-error/15 hover:text-error transition-colors',
                className,
            )}
        >
            <Trash2Icon className='size-4' />
        </button>
    );
}
