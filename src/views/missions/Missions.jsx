import Mission from './Mission';

export default function Missions(props) {
    const selectedMissions = props.status === 'all' ? props.missions : props.missions.filter((m) => m.status === props.status);

    return (
        <div className='bg-base-100 shadow-md rounded-box list'>
            {selectedMissions.map((m) => (
                <Mission key={m.id} mission={m} />
            ))}
        </div>
    );
}
