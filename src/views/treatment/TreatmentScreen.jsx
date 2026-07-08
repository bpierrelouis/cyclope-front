import { ExternalLinkIcon, MapIcon, TableIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MediaIcon } from '../../components';
import { ERoute } from '../../constants';
import { useSelectionContext } from '../../contexts';
import { playerService } from '../../services';
import { usePlayerStore } from '../../stores';
import { cn } from '../../utils';
import { Controls } from './controls';
import { Media } from './Media';
import { Plan } from './plan';
import { Table } from './table';
import { TreatmentHeader } from './TreatmentHeader';

export function TreatmentScreen() {
    const { media, treatment, results } = useSelectionContext();
    const [selected, setSelected] = useState(ERoute.MEDIA);
    const { isMediaOpen, isTableOpen, isPlanOpen } = usePlayerStore();

    useEffect(() => {
        playerService.setLocalState({
            isMaster: true,
        });
    }, []);

    useEffect(() => {
        playerService.sync({
            media,
            playing: false,
        });
    }, [media]);

    useEffect(() => {
        playerService.sync({ treatment });
    }, [treatment]);

    useEffect(() => {
        playerService.sync({ results });
    }, [results]);

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
        const next = entry[0];
        setSelected(next);
    };

    if (!media) return null;

    const modes = [
        [ERoute.PLAN, 'Carte', <MapIcon key={'MapIcon'} />],
        [ERoute.TABLE, 'Tableau', <TableIcon key={'TableIcon'} />],
        [ERoute.MEDIA, media.isVideo ? 'Vidéo' : 'Image', <MediaIcon isVideo={media.isVideo} key={'MediaIcon'} />],
    ].filter(([route]) => route === selected || !disabledComponents[route]);

    return (
        <div className='grid grid-cols-[max-content_1fr] grid-rows-[max-content_1fr_max-content] bg-base-200 h-screen max-h-screen size-full'>
            <TreatmentHeader />
            <aside className='cyc-rail'>
                {modes.map(([route, label, icon]) => (
                    <button
                        key={route}
                        onClick={() => setSelected(route)}
                        className={cn('cyc-mode-btn', selected === route && 'active')}
                    >
                        {icon}
                        {label}
                    </button>
                ))}

                <button
                    onClick={handleExtract}
                    className='cyc-mode-btn-bottom cyc-mode-btn'
                >
                    <ExternalLinkIcon />
                    Extraire
                </button>
            </aside>

            <main className='relative flex flex-col flex-1 bg-base-300 min-w-0 overflow-hidden'>
                <Media hidden={selected !== ERoute.MEDIA} />
                {selected === ERoute.PLAN && <Plan />}
                {selected === ERoute.TABLE && <Table />}
            </main>

            {media.isVideo && (
                <Controls />
            )}
        </div>
    );
}