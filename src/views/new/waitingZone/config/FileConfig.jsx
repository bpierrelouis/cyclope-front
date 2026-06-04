import { useEffect, useMemo } from 'react';
import { useDefaultConfigStore, useMissionCreationStore } from '../../../../stores';
import { ConfidenceThresholdChange } from './ConfidenceThresholdChange';
import { ObjectDetectionField } from './ObjectDetectionField';
import { ProcessingIntervalField } from './ProcessingIntervalField';
import { ProcessingLevelField } from './ProcessingLevelField';

export function FileConfig(props) {
    const { file } = props;

    const { configs, updateConfig } = useMissionCreationStore();
    const defaultConfig = useDefaultConfigStore();

    const config = useMemo(() => configs[file.id], [configs, file.id]);

    useEffect(() => {
        if (config) return;
        updateConfig(file.id, {
            processingInterval: Math.min(defaultConfig.processingInterval, file.duration ?? Infinity),
            objectDetectionEnabled: defaultConfig.objectDetectionEnabled,
            confidenceThreshold: defaultConfig.confidenceThreshold,
            processingLevel: defaultConfig.processingLevel,
        });
    }, [config, file.id, updateConfig]);

    if (!config) return;

    return (
        <div className='flex flex-col gap-2 bg-base-300 p-4 rounded-box'>
            {!!file.duration && (<ProcessingIntervalField file={file} config={config} />)}
            <ObjectDetectionField file={file} config={config} />
            {config.objectDetectionEnabled && (<ConfidenceThresholdChange file={file} config={config} />)}
            <ProcessingLevelField file={file} config={config} />
        </div>
    );
}
