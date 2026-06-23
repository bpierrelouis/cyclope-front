import { useEffect, useMemo } from 'react';
import { ProcessConfidenceField, ProcessLevelField, ProcessObjectDetectionField, ProcessStepField } from '../../../components';
import { useDefaultConfigStore, useMissionCreationStore } from '../../../stores';

export function FileConfig(props) {
    const { file } = props;

    const { configs, updateConfig, updatePartialConfig } = useMissionCreationStore();
    const { getDefault } = useDefaultConfigStore();

    const config = useMemo(() => configs[file.id], [configs, file.id]);

    useEffect(() => {
        if (config) return;
        updateConfig(file.id, getDefault(file));
    }, [config, updateConfig, file, getDefault]);

    const setPartialConfig = (data) => updatePartialConfig(file.id, data);

    if (!config) return;

    return (
        <div className='flex flex-col gap-2 bg-base-300 p-4 rounded-box'>
            {!!file.duration && (<ProcessStepField
                config={config}
                setPartialConfig={setPartialConfig}
                max={file.duration || 1}
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
