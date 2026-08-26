import { cn } from '../utils';

export function SectionCard(props) {
    const {
        children, className, description, icon: Icon, title,
    } = props;

    return (
        <section className={cn('bg-base-100 shadow-sm border border-base-300 card grow min-h-0', className)}>
            <div className='flex flex-col gap-2 card-body min-h-0'>
                <header className='flex items-start gap-3 mb-2 shrink-0'>
                    <Icon className='mt-0.5 text-primary shrink-0' />
                    <div>
                        <h2 className='font-semibold text-lg'>{title}</h2>
                        {description && (
                            <p className='text-base-content/60 text-sm'>{description}</p>
                        )}
                    </div>
                </header>
                <div className='flex flex-col flex-1 p-0 min-h-0'>
                    {children}
                </div>
            </div>
        </section>
    );
}
