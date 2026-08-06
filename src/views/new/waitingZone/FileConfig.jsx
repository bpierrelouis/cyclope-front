import { ConfigurationCard, ProcessConfidenceField, ProcessLevelField, ProcessObjectDetectionField, ProcessStepField } from '../../../components';
import { useMissionCreationStore } from '../../../stores';
import { useShallow } from 'zustand/react/shallow';

export function FileConfig(props) {
    const { file } = props;

    const { configs, updatePartialConfig } = useMissionCreationStore(useShallow((state) => ({
        configs: state.configs,
        updatePartialConfig: state.updatePartialConfig,
    })));

    const config = configs[file.id];

    const setPartialConfig = (data) => updatePartialConfig(file.id, data);

    if (!config) return;

    return (
        <ConfigurationCard className='bg-base-200 shadow-none'>
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
        </ConfigurationCard>
    );
}
