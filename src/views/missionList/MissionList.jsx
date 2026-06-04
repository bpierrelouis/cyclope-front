import { missionsQueries, useFilteredList } from '../../hooks';
import { MissionListItem } from './MissionListItem';

export function MissionList(props) {
    const { status, search } = props;

    const { data: missions } = missionsQueries.useGetAllByStatus(status);
    const { filtered } = useFilteredList(missions, 'name', search);

    return (
        <div className='flex flex-col gap-1 tab-content'>
            {filtered.map((m) => (
                <MissionListItem key={m.id} mission={m} />
            ))}
        </div>
    );
}
