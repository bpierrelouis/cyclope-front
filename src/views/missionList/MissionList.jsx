import { MissionListRow } from './MissionListRow';

export function MissionList(props) {
    const selectedMissions = props.status === 'all' ? props.missions : props.missions.filter((m) => m.status === props.status);

    return (
        <div className='bg-base-100 shadow-md rounded-box list'>
            {selectedMissions.map((m) => (
                <MissionListRow key={m.id} mission={m} />
            ))}
        </div>
    );
}
