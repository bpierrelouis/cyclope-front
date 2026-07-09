import { MediaIcon } from '../../components';
import { useSelectionContext } from '../../contexts';
import { NavItem } from './NavItem';

export function MediaList() {
    const { mission, medias, media } = useSelectionContext();

    if (!mission || !medias) return null;

    return (<>
        <div className='divider'></div>
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
