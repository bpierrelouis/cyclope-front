import { useState } from 'react';
import { STATUS } from '../../constants/others';
import { missionsQueries } from '../../hooks';
import Missions from './Missions';
import StatusTabs from './StatusTabs';

export default function MissionsScreen() {
    const [status, setStatus] = useState(STATUS[0]);
    const { data: missions } = missionsQueries.useGetAll();

    return (
        <main className='m-10 flex flex-col gap-6'>
            <h2 className='text-xl font-medium'>Missions</h2>
            <StatusTabs statusState={[status, setStatus]} />
            <Missions missions={missions || []} status={status} />
        </main>
    );
}
