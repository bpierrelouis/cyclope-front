import { FilmIcon, ImageIcon, MapIcon, SquareArrowOutUpRightIcon, TableIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../constants';
import { useGlobalSelection } from '../../hooks';
import { playerService } from '../../services/player.service';
import Controls from './Controls';
import Media from './Media';
import Plan from './Plan';
import Table from './Table';

export default function Treatment() {
    const { media } = useGlobalSelection();
    const [selected, setSelected] = useState(ROUTES.media);

    useEffect(() => {
        playerService.setLocalState({
            isMaster: true,
        });
    }, []);

    useEffect(() => {
        playerService.sync({
            media,
        });
    }, [media]);

    const handleExtract = () => {
        window.open(
            selected,
            undefined,
            'width=900,height=700',
        );
    };

    if (!media) return (null);

    return (
        <div className='flex flex-col max-h-screen size-full'>
            <Media hidden={selected !== ROUTES.media} />
            {selected === ROUTES.plan && <Plan />}
            {selected === ROUTES.table && <Table />}
            <div className='top-2 right-2 absolute'>
                <Button onClick={() => setSelected(ROUTES.plan)}>
                    <MapIcon />
                </Button>
                <Button onClick={() => setSelected(ROUTES.table)}>
                    <TableIcon />
                </Button>
                <Button onClick={() => setSelected(ROUTES.media)}>
                    {media.isVideo ? <FilmIcon /> : <ImageIcon />}
                </Button>
                <Button onClick={handleExtract}>
                    <SquareArrowOutUpRightIcon />
                </Button>
            </div>
            {media.isVideo && (
                <Controls />
            )}
        </div>
    );
}

function Button(props) {
    return (
        <button
            className='btn btn-ghost btn-square'
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}
