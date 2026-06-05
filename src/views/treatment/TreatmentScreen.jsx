import { ExternalLinkIcon, MapIcon, TableIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MediaIcon, SquareButton } from '../../components';
import { ROUTES } from '../../constants';
import { useSelectionContext } from '../../contexts';
import { playerService } from '../../services';
import { usePlayerStore } from '../../stores';
import { Controls } from './Controls';
import { Media } from './Media';
import { Plan } from './plan';
import { Table } from './table';

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

    if (!media) return (null);

    return (
        <div className='flex flex-col max-h-screen size-full'>
            <div className='flex justify-between items-center mx-2'>
                <div className='italic'>
                    {media.name}
                </div>
                <div>
                    {[
                        ['Carte', ROUTES.plan, <MapIcon />],
                        ['Tableau', ROUTES.table, <TableIcon />],
                        [media.isVideo ? 'Vidéo' : 'Image', ROUTES.media, <MediaIcon isVideo={media.isVideo} />],
                    ].map(([label, route, children]) => (
                        <Button
                            key={route}
                            onClick={() => setSelected(route)}
                            hidden={disabledComponents[route]}
                            label={label}
                        >
                            {children}
                        </Button>
                    ))}
                    <Button
                        onClick={handleExtract}
                        label='Extraire'
                    >
                        <ExternalLinkIcon />
                    </Button>
                </div>
            </div>
            <Media hidden={selected !== ROUTES.media} />
            {selected === ROUTES.plan && <Plan />}
            {selected === ROUTES.table && <Table />}
            {media.isVideo && (
                <Controls />
            )}
        </div>
    );
}

function Button(props) {
    if (props.hidden) return (null);
    return (
        <SquareButton
            {...props}
            className='tooltip-bottom'
        />
    );
}
