import { useState } from 'react';
import { STATUS } from '../../constants';
import { missionsQueries, useFilter } from '../../hooks';
import { MissionListItem } from './MissionListItem';
import { StatusTabs } from './StatusTabs';

export function MissionListScreen() {
    const [status, setStatus] = useState(STATUS[0]);
    const { data: missions } = missionsQueries.useGetAllByStatus(status);
    const { items, search, setSearch } = useFilter(missions ?? [], 'name');

    return (
        <main className='flex flex-col gap-6 m-10'>
            <div className='flex flex-wrap-reverse justify-between items-center gap-1'>
                <StatusTabs statusState={[status, setStatus]} />
                <input
                    type='text'
                    placeholder='Rechercher...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='flex-1 lg:flex-0 w-48 input input-sm input-bordered'
                />
            </div>
            <div className='flex flex-col gap-1 tab-content'>
                {items.map((m) => (
                    <MissionListItem key={m.id} mission={m} />
                ))}
            </div>
        </main>
    );
}