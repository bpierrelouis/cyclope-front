import { missionsQueries } from '../../hooks';
import { MissionListItem } from './MissionListItem';

export function MissionList(props) {
    const { status } = props;

    const { data: missions } = missionsQueries.useGetAllByStatus(status);

    return (
        <div className='flex flex-col gap-1 tab-content'>
            {missions?.map((m) => (
                <MissionListItem key={m.id} mission={m} />
            ))}
        </div>
    );
}
