import { MapIcon } from 'lucide-react';

import {
    ProcessDefaultCarto,
    SectionCard,
} from '../../components';

export function DefaultBaseMapCard() {
    return (
        <SectionCard
            icon={MapIcon}
            title='Sélection du fond de carte par défaut'
        >
            <ProcessDefaultCarto />
        </SectionCard>
    );
}
