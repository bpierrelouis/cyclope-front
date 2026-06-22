export function MissionNameField(props) {
    const { state } = props;
    const [missionName, setMissionName] = state;

    const handleNameChange = (event) =>
        setMissionName(event.target.value);

    return (
        <input
            type='text'
            className='w-full input input-sm'
            placeholder='Nouvelle mission'
            value={missionName}
            onChange={handleNameChange}
        />
    );
}
