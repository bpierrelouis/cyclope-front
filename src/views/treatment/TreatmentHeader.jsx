import { ExternalLinkIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { ERoute } from '../../constants';
import { useSelectionContext } from '../../contexts';
import { useCurrentResult } from '../../hooks';
import { usePlayerStore } from '../../stores';
import { HeaderButton } from './HeaderButton';
import { HeaderItem } from './HeaderItem';
import { ScreenSelector } from './ScreenSelector';
import { TreatmentSelector } from './TreatmentSelector';

export function TreatmentHeader(props) {
    const { state } = props;
    const [selected, setSelected] = state;
    const { activeItem, isMission, mission } = useSelectionContext();
    const media = activeItem?.media;
    const result = useCurrentResult();
    const {
        isMediaOpen, isTableOpen, isPlanOpen,
    } = usePlayerStore(useShallow((store) => ({
        isMediaOpen: store.isMediaOpen,
        isPlanOpen: store.isPlanOpen,
        isTableOpen: store.isTableOpen,
    })));

    const position = result?.coordinates
        ? `${result.coordinates.latitude} · ${result.coordinates.longitude}`
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
            <HeaderItem title='MISSION'>{mission?.name}</HeaderItem>
            {isMission ? (
                <HeaderItem title='MÉDIA EN COURS'>{media?.name}</HeaderItem>
            ) : (
                <HeaderItem title='TRAITEMENT'>
                    <TreatmentSelector />
                </HeaderItem>
            )}
            <HeaderItem title='FRAME'>{result?.index}</HeaderItem>
            <HeaderItem title='ALT'>{result?.altitudeLabel}</HeaderItem>
            <HeaderItem title='VITESSE'>{result?.speedLabel}</HeaderItem>
            <HeaderItem title='POSITION'>{position}</HeaderItem>
            <ScreenSelector
                disabledComponents={disabledComponents}
                media={media}
                state={state}
            />
            <HeaderButton
                ariaLabel='Extraire la vue courante dans une nouvelle fenêtre'
                onClick={handleExtract}
            >
                <ExternalLinkIcon />
            </HeaderButton>
        </header>
    );
}
