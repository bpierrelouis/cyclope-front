import { STATUS } from '../../constants';
import { StatusTab } from './StatusTab';

export function StatusTabs(props) {
    const [status, setStatus] = props.statusState;

    return (
        <div role='tablist' className='tabs-border tabs'>
            {STATUS.map((s) => (
                <StatusTab
                    key={s}
                    status={s}
                    setter={setStatus}
                    isSelected={s === status}
                />
            ))}
        </div>
    );
}
