export function HeaderButton({ ariaLabel, children, onClick }) {
    return (
        <button
            type='button'
            aria-label={ariaLabel}
            className='h-full aspect-square btn btn-ghost'
            onClick={onClick}
        >
            {children}
        </button>
    );
}
