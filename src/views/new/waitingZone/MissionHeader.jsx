import { useMissionCreationStore } from '../../../stores';

export function MissionHeader(props) {
    const { missionNameState } = props;
    const [missionName, setMissionName] = missionNameState;
    const { fileIds, clear } = useMissionCreationStore();

    const fileCount = fileIds.size;

    const handleNameChange = (event) =>
        setMissionName(event.target.value);

    return (
        <div className='flex justify-between items-end'>
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
            {fileCount > 0 && (
                <button className='btn btn-ghost btn-error btn-sm' onClick={clear}>
                    Tout retirer
                </button>
            )}
        </div>
    );
}
