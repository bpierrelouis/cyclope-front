export function HeaderItem({ children, title }) {
    return (
        <div className='px-4 py-2 stat'>
            <span className='stat-title'>{title}</span>
            <span className='text-sm stat-value'>{children ?? '-'}</span>
        </div>
    );
}
