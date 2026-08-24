import { cn } from '../../utils';

export function FileTreeActionButton(props) {
    const { className, ...buttonProps } = props;

    return (
        <button
            {...buttonProps}
            type={buttonProps.type ?? 'button'}
            className={cn(
                'text-base-content/60 hover:bg-base-200 hover:text-base-content btn btn-circle btn-ghost btn-xs transition-colors',
                className,
            )}
        />
    );
}
