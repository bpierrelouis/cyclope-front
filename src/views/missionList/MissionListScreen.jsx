import { useState } from 'react';
import { STATUS } from '../../constants';
import { MissionList } from './MissionList';
import { StatusTabs } from './StatusTabs';

export function MissionListScreen() {
    const [status, setStatus] = useState(STATUS[0]);
    const [search, setSearch] = useState('');

    return (
        <main className='flex flex-col gap-6 m-10'>
            <div className='flex items-center justify-between'>
                <StatusTabs statusState={[status, setStatus]} />
                <input
                    type='text'
                    placeholder='Rechercher...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input input-sm input-bordered w-48'
                />
            </div>
            <MissionList status={status} search={search} />
        </main>
    );
}