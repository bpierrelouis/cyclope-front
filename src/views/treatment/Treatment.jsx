import { FilmIcon, ImageIcon, MapIcon, SquareArrowOutUpRightIcon, TableIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../constants';
import { useGlobalSelection } from '../../hooks';
import { playerService } from '../../services/player.service';
import { usePlayerStore } from '../../stores/playerStore';
import Controls from './Controls';
import Media from './Media';
import Plan from './Plan';
import Table from './Table';

export default function Treatment() {
    const { media } = useGlobalSelection();
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
                        [media.isVideo ? 'Vidéo' : 'Image', ROUTES.media, media.isVideo ? <FilmIcon /> : <ImageIcon />],
                    ].map(([title, route, children]) => (
                        <Button
                            key={route}
                            onClick={() => setSelected(route)}
                            hidden={disabledComponents[route]}
                            title={title}
                        >
                            {children}
                        </Button>
                    ))}
                    <Button
                        onClick={handleExtract}
                        title='Extraire'
                    >
                        <SquareArrowOutUpRightIcon />
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
        <button
            className='tooltip-bottom btn btn-ghost btn-square tooltip'
            onClick={props.onClick}
            data-tip={props.title}
        >
            {props.children}
        </button>
    );
}
