import { SlidersHorizontalIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import {
    ProcessConfidenceField,
    ProcessLevelField,
    ProcessObjectDetectionField,
    ProcessStepField,
    SectionCard,
} from '../../components';
import { useDefaultConfigStore } from '../../stores';

export function DefaultTreatmentSettings() {
    const { setPartialState, ...config } = useDefaultConfigStore(useShallow((state) => ({
        confidenceThreshold: state.confidenceThreshold,
        frameStep: state.frameStep,
        objectDetectionEnabled: state.objectDetectionEnabled,
        processingLevel: state.processingLevel,
        setPartialState: state.setPartialState,
    })));

    return (
        <SectionCard
            description='Ces paramètres seront appliqués automatiquement aux nouveaux médias.'
            icon={SlidersHorizontalIcon}
            title='Paramètres de traitement par défaut'
        >

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
        </SectionCard>
    );
}
