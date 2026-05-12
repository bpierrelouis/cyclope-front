import { STATUS, STATUS_LABELS } from '../../constants';

export function StatusTabs(props) {
    const [status, setStatus] = props.statusState;

    return (
        <div role='tablist' className='tabs-border tabs'>
            {STATUS.map((s) => (
                <button
                    key={s}
                    role='tab'
                    onClick={() => setStatus(s)}
                    className={`tab ${s === status ? 'tab-active text-primary border-primary' : ''}`}
                >
                    {STATUS_LABELS[s]}
                </button>
            ))}
        </div>
    );
}