import { PhotoIcon, PlayCircleIcon } from '../../assets/icons';
import { useGlobalSelection } from '../../hooks/selection';
import NavItem from './NavItem';

export default function Medias() {
    const { mission, medias } = useGlobalSelection();

    if (!mission || !medias) return null;

    return (<>
        <div className='divider'></div>
        <span className='is-drawer-close:hidden opacity-50 text-sm'>{mission.name}</span>
        {medias.map((media) => (
            <NavItem
                to={`?missionId=${mission.id}&mediaId=${media.id}`}
                key={media.id}
                title={media.name}
                Icon={media.isVideo ? PlayCircleIcon : PhotoIcon}
            />
        ))}
    </>);
}
