import { EStatusLabel } from '../../constants';
import { filterMissionsByStatus } from '../../utils';
import { StatusTab } from './StatusTab';

export function StatusTabs(props) {
    const { state, missions } = props;

    const getStatusNumber = (status) =>
        filterMissionsByStatus(missions, status)?.length;

    const tabs = [
        [null, 'Toutes', missions?.length],
        ...Object.entries(EStatusLabel).map(([value, label]) => (
            [value, label, getStatusNumber(value)]
        )),
    ];

    return (
        <div role='tablist' className='tabs-border tabs'>
            {tabs.map(([value, label, count]) => (
                <StatusTab
                    key={value}
                    status={value}
                    label={label}
                    setter={state[1]}
                    isSelected={value === state[0]}
                    count={count}
                />
            ))}
        </div>
    );
}
