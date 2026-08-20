import { MapIcon } from 'lucide-react';

import {
    ConfigurationCard,
    ProcessDefaultCarto,
    ProcessImportCarto,
} from '../../components';
import { SettingsCardHeader } from './SettingsCardHeader';

export function BaseMapSettings() {

    return (
        <ConfigurationCard>
            <SettingsCardHeader
                icon={MapIcon}
                title='Gestion des fonds de carte'
            />
            <ProcessDefaultCarto/>
            <ProcessImportCarto/>
        </ConfigurationCard>
    );
}
