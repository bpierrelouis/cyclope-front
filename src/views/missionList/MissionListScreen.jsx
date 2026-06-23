import { useState } from 'react';
import { missionsQueries, useFilter } from '../../hooks';
import { filterMissionsByStatus } from '../../utils';
import { MissionListItem } from './MissionListItem';
import { StatusTabs } from './StatusTabs';

export function MissionListScreen() {
    const [status, setStatus] = useState(null);
    const { data: missions } = missionsQueries.useGetAll();
    const { items: searchedMissions, search, setSearch } = useFilter(missions ?? [], 'name');

    const filteredMissions = filterMissionsByStatus(searchedMissions, status);

    return (
        <main className='flex flex-col gap-6 m-10'>
            <div className='flex flex-wrap-reverse justify-between items-center gap-1'>
                <StatusTabs
                    state={[status, setStatus]}
                    missions={searchedMissions}
                />
                <input
                    type='text'
                    placeholder='Rechercher...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='flex-1 lg:flex-0 w-48 input input-sm input-bordered'
                />
            </div>
            <div className='flex flex-col gap-1 tab-content'>
                {filteredMissions?.map((m) => (
                    <MissionListItem key={m.id} mission={m} />
                ))}
            </div>
        </main>
    );
}