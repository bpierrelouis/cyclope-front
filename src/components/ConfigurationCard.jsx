import { cn } from '../utils';

export function ConfigurationCard(props) {
    const { children, className } = props;

    return (
        <section className={cn('bg-base-100 shadow-sm border border-base-300 card grow', className)}>
            <div className='gap-2 card-body'>
                <fieldset className='p-0 fieldset'>
                    {children}
                </fieldset>
            </div>
        </section>
    );
}
