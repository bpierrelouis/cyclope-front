import { ProcessConfidenceField, ProcessLevelField, ProcessObjectDetectionField, ProcessStepField } from '../../components';
import { useDefaultConfigStore } from '../../stores';

export function SettingsScreen() {
    const { setPartialState, ...config } = useDefaultConfigStore();

    return (
        <main className='m-auto p-4 w-fit'>
            <h2 className='font-medium text-lg'>Configuration par défaut des missions</h2>

            <div className='flex flex-col gap-2 bg-base-100 shadow-md p-4 rounded-box w-xl'>

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
            </div>
        </main>
    );
}
