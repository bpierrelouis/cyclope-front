import { FilmIcon, ImageIcon } from 'lucide-react';
import { useGlobalSelection } from '../../hooks/selection';
import NavItem from './NavItem';

export default function Medias() {
    const { mission, medias, media } = useGlobalSelection();

    if (!mission || !medias) return null;

    return (<>
        <div className='divider'></div>
        <span className='is-drawer-close:hidden opacity-50 text-sm'>{mission.name}</span>
        {medias.map((m) => (
            <NavItem
                to={`?missionId=${mission.id}&mediaId=${m.id}`}
                key={m.id}
                title={m.name}
                Icon={m.isVideo ? FilmIcon : ImageIcon}
                isActive={m.id === media?.id}
            />
        ))}
    </>);
}
