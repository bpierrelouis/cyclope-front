import { HEALTH } from '../../constants';
import { useGetHealth } from '../../hooks';
import { cn, hasFalseValue } from '../../utils';

export function Health() {
    const { data, isLoading, error } = useGetHealth();

    const isError = error || !data?.[HEALTH.LIMITING_KEYPATH];
    const isWarning = hasFalseValue(data);

    if (isLoading) return (<Loading />);
    if (isError) return (<Status label='Services indisponibles' className='status-error' />);
    if (!isWarning) return (<Status label='Services disponibles' className='status-success' />);

    return (
        <>
            <Statuses
                keypaths={HEALTH.BACK_LABEL_BY_KEYPATH}
                data={data}
            />
            {data[HEALTH.IA_MAIN_KEYPATH] ? (
                <Statuses
                    keypaths={HEALTH.IA_LABEL_BY_KEYPATH}
                    data={data[HEALTH.IA_RESPONSE_KEYPATH]}
                />
            ) : (
                <Status
                    label='IA indisponible'
                    className='status-error'
                />
            )}
        </>
    );
}

function Loading() {
    return (
        <div>
            <div className='inline-grid mr-2 *:[grid-area:1/1]'>
                <div className='animate-ping status'></div>
                <div className='status'></div>
            </div>
            En attente du serveur
        </div>
    );
}

function Status(props) {
    const { label, className } = props;

    return (
        <div data-tip={label} className='is-drawer-close:tooltip-right is-drawer-close:tooltip'>
            <div className={cn('mr-2 status status-lg', className)}></div>
            <span className='is-drawer-close:hidden'>{label}</span>
        </div>
    );
}

function Statuses(props) {
    const { keypaths, data } = props;

    return (<>
        {keypaths.map(([keypath, label]) => (
            <Status
                key={keypath}
                label={label}
                className={data[keypath] ? 'status-success' : 'status-error'}
            />
        ))}
    </>);
}
