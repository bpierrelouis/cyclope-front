import { ExternalLinkIcon, MapIcon, TableIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MediaIcon } from '../../components';
import { ROUTES } from '../../constants';
import { useSelectionContext } from '../../contexts';
import { playerService } from '../../services';
import { usePlayerStore } from '../../stores';
import { Controls } from './Controls';
import { Media } from './Media';
import { Plan } from './plan';
import { Table } from './table';
import { TreatmentHeader } from './TreatmentHeader';

export function TreatmentScreen() {
    const { media, treatment, results } = useSelectionContext();
    const [selected, setSelected] = useState(ROUTES.media);
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
        [ROUTES.media]: isMediaOpen || selected === ROUTES.media,
        [ROUTES.table]: isTableOpen || selected === ROUTES.table,
        [ROUTES.plan]: isPlanOpen || selected === ROUTES.plan,
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
        [ROUTES.plan, 'Carte', <MapIcon size={18} key={'MapIcon'} />],
        [ROUTES.table, 'Tableau', <TableIcon size={18} key={'TableIcon'} />],
        [ROUTES.media, media.isVideo ? 'Vidéo' : 'Image', <MediaIcon isVideo={media.isVideo} size={18} key={'MediaIcon'} />],
    ].filter(([route]) => route === selected || !disabledComponents[route]);

    return (
        <div className='grid grid-cols-[max-content_1fr] grid-rows-[max-content_1fr_max-content] bg-base-200 h-screen max-h-screen size-full'>
            <TreatmentHeader />
            <aside className='cyc-rail'>
                {modes.map(([route, label, icon]) => (
                    <button
                        key={route}
                        type='button'
                        onClick={() => setSelected(route)}
                        className={`cyc-mode-btn ${selected === route ? 'active' : ''}`}
                    >
                        {icon}
                        {label}
                    </button>
                ))}

                <button
                    type='button'
                    onClick={handleExtract}
                    className='cyc-mode-btn-bottom cyc-mode-btn'
                >
                    <ExternalLinkIcon size={18} />
                    Extraire
                </button>
            </aside>

            <main className='relative flex flex-col flex-1 bg-base-300 min-w-0 overflow-hidden'>
                <Media hidden={selected !== ROUTES.media} />
                {selected === ROUTES.plan && <Plan />}
                {selected === ROUTES.table && <Table />}
            </main>

            {media.isVideo && (
                <Controls />
            )}
        </div>
    );
}