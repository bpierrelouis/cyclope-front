import { useEffect, useState } from 'react';
import { ERoute } from '../../constants';
import { useSelectionContext } from '../../contexts';
import { playerService } from '../../services';
import { Controls } from './controls';
import { Media } from './Media';
import { Plan } from './plan';
import { Table } from './table';
import { TreatmentHeader } from './TreatmentHeader';

export function TreatmentScreen() {
    const { media, treatment, results } = useSelectionContext();
    const [selected, setSelected] = useState(ERoute.MEDIA);

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

    if (!media) return null;

    return (
        <div className='flex flex-col bg-base-200 w-full h-screen'>
            <TreatmentHeader state={[selected, setSelected]} />

            <main className='relative flex flex-col flex-1 bg-base-300 min-w-0 min-h-0 overflow-hidden'>
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
