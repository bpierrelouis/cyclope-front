import { useRef, useState } from 'react';

import { AsyncView } from '../../components';
import { ERoute } from '../../constants';
import { useSelectionContext } from '../../contexts';
import { usePlayerSource } from '../../hooks';
import { LazyPlan } from '../plan';
import { Media } from '../player';
import { LazyTable } from '../table';
import { Controls } from './controls';
import { TreatmentHeader } from './TreatmentHeader';
import { ViewerMessage } from './ViewerMessage';

export function TreatmentScreen() {
    const {
        activeItem, error, isLoading, isMission, source,
    } = useSelectionContext();
    const media = activeItem?.media;
    const videoRef = useRef(null);
    const [selected, setSelected] = useState(ERoute.MEDIA);

    usePlayerSource();

    if (error) {
        return (
            <ViewerMessage
                role='alert'
                title='Impossible de charger la consultation'
            >
                {error.message}
            </ViewerMessage>
        );
    }

    if (isLoading) {
        return (
            <ViewerMessage title='Chargement de la consultation…' />
        );
    }

    if (!media) {
        return (
            <ViewerMessage title={isMission
                ? 'Cette mission ne contient aucune vidéo consultable.'
                : 'Aucun média sélectionné.'} />
        );
    }

    return (
        <div className='flex flex-col bg-base-200 w-full h-screen'>
            <TreatmentHeader state={[selected, setSelected]} />

            {source.errors.length > 0 && (
                <div className='rounded-none alert alert-warning' role='status'>
                    Certains résultats n’ont pas pu être chargés. Les segments disponibles restent consultables.
                </div>
            )}

            <main className='relative flex flex-col flex-1 bg-base-300 min-w-0 min-h-0 overflow-hidden'>
                <Media hidden={selected !== ERoute.MEDIA} videoRef={videoRef} />
                <AsyncView>
                    {selected === ERoute.PLAN && <LazyPlan />}
                    {selected === ERoute.TABLE && <LazyTable />}
                </AsyncView>
            </main>

            {media.isVideo && (
                <Controls videoRef={videoRef} />
            )}

        </div>
    );
}
