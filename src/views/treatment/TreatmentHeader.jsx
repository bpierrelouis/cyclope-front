import { ExternalLinkIcon, MapIcon, TableIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { MediaIcon } from '../../components';
import { ERoute } from '../../constants';
import { useSelectionContext } from '../../contexts';
import { usePlayerStore } from '../../stores';
import { getCurrentResult } from '../../utils';
import { TreatmentSelector } from './TreatmentSelector';

export function TreatmentHeader(props) {
    const { state } = props;
    const [selected, setSelected] = state;
    const { mission } = useSelectionContext();
    const {
        currentTime, results, isMediaOpen, isTableOpen, isPlanOpen,
    } = usePlayerStore(useShallow((store) => ({
        currentTime: store.currentTime,
        isMediaOpen: store.isMediaOpen,
        isPlanOpen: store.isPlanOpen,
        isTableOpen: store.isTableOpen,
        results: store.results,
    })));

    const current = getCurrentResult(results, currentTime);

    const position = current?.coordinates
        ? `${current.coordinates.latitude} · ${current.coordinates.longitude}`
        : '—';

    const disabledComponents = {
        [ERoute.MEDIA]: isMediaOpen || selected === ERoute.MEDIA,
        [ERoute.TABLE]: isTableOpen || selected === ERoute.TABLE,
        [ERoute.PLAN]: isPlanOpen || selected === ERoute.PLAN,
    };

    /**
     * Méthode permettant d'extraire la vue courante dans une nouvelle fenêtre.
     * Change la vue courante vers une non visible.
     */
    const handleExtract = () => {
        window.open(
            selected,
            undefined,
            'width=900,height=700',
        );

        const entries = Object.entries(disabledComponents);
        const entry = entries.find(([route, disabled]) => route !== selected && !disabled);
        if (entry) setSelected(entry[0]);
    };

    return (
        <header className='grid-cols-[max-content_minmax(18rem,1fr)_repeat(5,max-content)] col-span-full bg-base-100 overflow-visible stats'>
            <ItemText title='MISSION' value={mission?.name} />
            <Item title='TRAITEMENT'>
                <TreatmentSelector />
            </Item>
            <ItemText title='FRAME' value={current?.index} />
            <ItemText title='ALT' value={current?.altitudeLabel} />
            <ItemText title='VITESSE' value={current?.speedLabel} />
            <ItemText title='POSITION' value={position} />
            <ScreenSelector
                state={state}
                disabledComponents={disabledComponents}
            />
            <Button
                onClick={handleExtract}
            >
                <ExternalLinkIcon />
            </Button>
        </header>
    );
}

function ItemText(props) {
    const { title, value } = props;
    return (
        <Item title={title}>
            {value ?? '-'}
        </Item>
    );
}

function Item(props) {
    const { title, children } = props;
    return (
        <div className='px-4 py-2 stat'>
            <span className='stat-title'>{title}</span>
            <span className='text-sm stat-value'>{children}</span>
        </div>
    );
}

function ScreenSelector(props) {
    const { state, disabledComponents } = props;
    const [selected, setSelected] = state;
    const media = usePlayerStore((store) => store.media);

    const modes = [
        [ERoute.PLAN, 'Carte', <MapIcon key={'MapIcon'} />],
        [ERoute.TABLE, 'Tableau', <TableIcon key={'TableIcon'} />],
        [ERoute.MEDIA, media?.isVideo ? 'Vidéo' : 'Image', <MediaIcon isVideo={media?.isVideo} key={'MediaIcon'} />],
    ];

    const allowed = modes.filter(([r]) => !disabledComponents[r]);

    return (
        <div className='block p-0 dropdown-down dropdown dropdown-hover stat'>
            <Button>
                {modes.find(([r]) => r === selected)[2]}
            </Button>
            <ul className='bg-base-100 shadow-sm p-0 rounded-box dropdown-content menu'>
                {allowed.map(([route, , Icon]) => (
                    <li
                        key={route}
                        className='w-full aspect-square'
                    >
                        <Button onClick={() => setSelected(route)}>
                            {Icon}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Button(props) {
    return (
        <button
            type='button'
            className='h-full aspect-square btn btn-ghost'
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}
