import { MediaIcon } from '../../components/MediaIcon';
import { useSelectionContext } from '../../contexts';
import { NavItem } from './NavItem';

export function MediaList() {
    const { mission, medias, media } = useSelectionContext();

    if (!mission || !medias) return null;

    return (<>
        <div className='divider'></div>
        <span className='is-drawer-close:hidden opacity-50 text-sm'>{mission.name}</span>
        {medias.map((m) => (
            <NavItem
                to={`?media=${m.id}`}
                key={m.id}
                title={m.name}
                isActive={m.id === media?.id}
            >
                <MediaIcon isVideo={m.isVideo} />
            </NavItem>
        ))}
    </>);
}
