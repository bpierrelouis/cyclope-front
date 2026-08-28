export function MissionNameField(props) {
    const { value, setValue } = props;

    const handleNameChange = (event) =>
        setValue(event.target.value);

    return (
        <input
            type='text'
            className='w-full input input-sm'
            placeholder='Nouvelle mission'
            value={value}
            onChange={handleNameChange}
        />
    );
}
