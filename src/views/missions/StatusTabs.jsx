import { STATUS_LABELS } from '../../constants/labels';
import { STATUS } from '../../constants/others';

export default function StatusTabs(props) {
    const [status, setStatus] = props.statusState;

    return (
        <div role='tablist' className='tabs tabs-border'>
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