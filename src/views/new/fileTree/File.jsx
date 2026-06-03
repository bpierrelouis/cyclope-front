import { useMissionCreationStore } from '../../../stores';

export function File(props) {
    const { file } = props;
    const { id, name } = file;

    const { fileIds, toggle } = useMissionCreationStore();

    const isSelected = fileIds.has(id);
    const className = isSelected ? 'not-hover:bg-primary/10 not-hover:text-primary' : '';

    const handleClick = () => toggle(id);

    return (
        <li>
            <button className={className} onClick={handleClick}>
                {name}
            </button>
        </li>
    );
}
