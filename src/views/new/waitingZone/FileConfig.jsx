import { ProcessConfidenceField, ProcessLevelField, ProcessObjectDetectionField, ProcessStepField } from '../../../components';
import { useMissionCreationStore } from '../../../stores';

export function FileConfig(props) {
    const { file } = props;

    const { configs, updatePartialConfig } = useMissionCreationStore();

    const config = configs[file.id];

    const setPartialConfig = (data) => updatePartialConfig(file.id, data);

    if (!config) return;

    return (
        <div className='flex flex-col gap-2 bg-base-300 p-4 rounded-box'>
            {!!file.duration && (<ProcessStepField
                config={config}
                setPartialConfig={setPartialConfig}
                max={file.duration}
            />)}

            <ProcessObjectDetectionField
                config={config}
                setPartialConfig={setPartialConfig}
            />

            {config.objectDetectionEnabled && (<ProcessConfidenceField
                config={config}
                setPartialConfig={setPartialConfig}
            />)}

            <ProcessLevelField
                config={config}
                setPartialConfig={setPartialConfig}
            />
        </div>
    );
}
