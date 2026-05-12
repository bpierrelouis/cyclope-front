import { useState } from 'react';
import { STATUS } from '../../constants';
import { missionsQueries } from '../../hooks';
import { MissionList } from './MissionList';
import { StatusTabs } from './StatusTabs';

export function MissionListScreen() {
    const [status, setStatus] = useState(STATUS[0]);
    const { data: missions } = missionsQueries.useGetAll();

    return (
        <main className='flex flex-col gap-6 m-10'>
            <h2 className='font-medium text-xl'>Missions</h2>
            <StatusTabs statusState={[status, setStatus]} />
            <MissionList missions={missions || []} status={status} />
        </main>
    );
}
