export function MissionNameField(props) {
    const { state } = props;
    const [missionName, setMissionName] = state;

    const handleNameChange = (event) =>
        setMissionName(event.target.value);

    return (
        <fieldset className='fieldset'>
            <legend className='fieldset-legend'>Nom de la nouvelle mission</legend>
            <input
                type='text'
                className='input'
                placeholder='Nouvelle mission'
                value={missionName}
                onChange={handleNameChange}
            />
        </fieldset>
    );
}
