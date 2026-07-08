import { useMemo } from 'react';
import { ConfigBadges, MediaIcon } from '../../components';
import { useSelectionContext } from '../../contexts';
import { treatmentsQueries } from '../../hooks';
import { NavItem } from './NavItem';

export function MediaList() {
    const { mission, medias, media } = useSelectionContext();

    const treatmentParams = useMemo(() => {
        const params = new URLSearchParams();
        (medias ?? []).forEach((m) => params.append('media_id', m.id));
        return params;
    }, [medias]);

    const { data: treatments } = treatmentsQueries.useGetAll(treatmentParams, {
        enabled: treatmentParams.has('media_id'),
    });

    const configByMediaId = useMemo(() => {
        const map = new Map();
        (treatments ?? []).forEach((t) => {
            const current = map.get(t.mediaId);
            if (!current || new Date(t.creationDate) > new Date(current.creationDate)) {
                map.set(t.mediaId, t);
            }
        });
        return map;
    }, [treatments]);

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
                badges={<ConfigBadges config={configByMediaId.get(m.id)?.config} />}
            >
                <MediaIcon isVideo={m.isVideo} />
            </NavItem>
        ))}
    </>);
}
