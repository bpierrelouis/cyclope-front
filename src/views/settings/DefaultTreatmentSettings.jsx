import { SlidersHorizontalIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import {
    ConfigurationCard,
    ProcessConfidenceField,
    ProcessLevelField,
    ProcessObjectDetectionField,
    ProcessStepField,
} from '../../components';
import { useDefaultConfigStore } from '../../stores';
import { SettingsCardHeader } from './SettingsCardHeader';

export function DefaultTreatmentSettings() {
    const { setPartialState, ...config } = useDefaultConfigStore(useShallow((state) => ({
        confidenceThreshold: state.confidenceThreshold,
        frameStep: state.frameStep,
        objectDetectionEnabled: state.objectDetectionEnabled,
        processingLevel: state.processingLevel,
        setPartialState: state.setPartialState,
    })));

    return (
        <ConfigurationCard>
            <SettingsCardHeader
                icon={SlidersHorizontalIcon}
                title='Paramètres de traitement par défaut'
            >
                Ces paramètres seront appliqués automatiquement aux nouveaux médias.
            </SettingsCardHeader>

            <ProcessStepField
                config={config}
                setPartialConfig={setPartialState}
            />

            <ProcessObjectDetectionField
                config={config}
                setPartialConfig={setPartialState}
            />

            {config.objectDetectionEnabled && (
                <ProcessConfidenceField
                    config={config}
                    setPartialConfig={setPartialState}
                />
            )}

            <ProcessLevelField
                config={config}
                setPartialConfig={setPartialState}
            />
        </ConfigurationCard>
    );
}
