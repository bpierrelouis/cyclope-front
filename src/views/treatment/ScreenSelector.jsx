import { MapIcon, TableIcon } from 'lucide-react';

import { MediaIcon } from '../../components';
import { ERoute } from '../../constants';
import { HeaderButton } from './HeaderButton';

export function ScreenSelector({ disabledComponents, media, state }) {
    const [selected, setSelected] = state;

    const modes = [
        [ERoute.PLAN, 'Carte', <MapIcon key='map' />],
        [ERoute.TABLE, 'Tableau', <TableIcon key='table' />],
        [
            ERoute.MEDIA,
            media?.isVideo ? 'Vidéo' : 'Image',
            <MediaIcon isVideo={media?.isVideo} key='media' />,
        ],
    ];

    const allowedModes = modes.filter(([route]) => !disabledComponents[route]);
    const selectedMode = modes.find(([route]) => route === selected);

    return (
        <div className='block p-0 dropdown-down dropdown dropdown-hover stat'>
            <HeaderButton ariaLabel='Changer de vue'>
                {selectedMode?.[2]}
            </HeaderButton>
            <ul className='bg-base-100 shadow-sm p-0 rounded-box dropdown-content menu'>
                {allowedModes.map(([route, label, icon]) => (
                    <li key={route} className='w-full aspect-square'>
                        <HeaderButton
                            ariaLabel={`Afficher la vue ${label.toLowerCase()}`}
                            onClick={() => setSelected(route)}
                        >
                            {icon}
                        </HeaderButton>
                    </li>
                ))}
            </ul>
        </div>
    );
}
