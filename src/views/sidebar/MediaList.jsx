import { ListVideoIcon } from 'lucide-react';

import { MediaIcon } from '../../components';
import { ERoute } from '../../constants';
import { useSelectionContext } from '../../contexts';
import { useSelectionParams } from '../../hooks';
import { NavItem } from './NavItem';

export function MediaList() {
    const { mission, medias, media } = useSelectionContext();
    const { missionId } = useSelectionParams();
    const isMissionSelected = missionId !== undefined;

    if (!mission || !medias) return null;

    return (<>
        <NavItem
            to={`${ERoute.TREATMENT}?mission=${mission.id}`}
            title='Toute la mission'
            isActive={isMissionSelected}
        >
            <ListVideoIcon />
        </NavItem>
        {medias.map((m) => (
            <NavItem
                to={`${ERoute.TREATMENT}?media=${m.id}`}
                key={m.id}
                title={m.name}
                isActive={!isMissionSelected && m.id === media?.id}
            >
                <MediaIcon isVideo={m.isVideo} />
            </NavItem>
        ))}
    </>);
}
