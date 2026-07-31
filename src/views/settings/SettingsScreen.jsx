import { ConfigurationCard, ProcessConfidenceField, ProcessLevelField, ProcessObjectDetectionField, ProcessStepField } from '../../components';
import { useDefaultConfigStore } from '../../stores';

export function SettingsScreen() {
    const { setPartialState, ...config } = useDefaultConfigStore();

    return (
        <main className='m-auto p-4 w-full max-w-xl'>
            <ConfigurationCard>
                <p className='mb-2 text-base-content/60 text-sm'>
                    Ces paramètres seront appliqués automatiquement aux nouveaux médias.
                </p>

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
        </main>
    );
}
