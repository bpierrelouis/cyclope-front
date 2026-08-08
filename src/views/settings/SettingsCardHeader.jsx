export function SettingsCardHeader(props) {
    const { icon: Icon, title, children } = props;

    return (
        <div className='flex items-start gap-3 mb-2'>
            <Icon className='mt-0.5 text-primary shrink-0' />
            <div>
                <h2 className='font-semibold text-lg'>{title}</h2>
                <p className='text-base-content/60 text-sm'>{children}</p>
            </div>
        </div>
    );
}
