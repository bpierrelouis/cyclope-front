import { MediaIcon } from '../../../components';
import { useMissionCreationStore } from '../../../stores';
import { isVideoExtension } from '../../../utils';

export function File(props) {
    const { file } = props;
    const { id, name } = file;

    const { fileIds, toggle } = useMissionCreationStore();

    const isVideo = isVideoExtension(file.extension);
    const isSelected = fileIds.has(id);
    const className = isSelected ? 'not-hover:bg-primary/10 not-hover:text-primary' : '';

    const handleClick = () => toggle(id);

    return (
        <li>
            <button className={className} onClick={handleClick}>
                <MediaIcon isVideo={isVideo} className='size-4' />
                {name}
            </button>
        </li>
    );
}
