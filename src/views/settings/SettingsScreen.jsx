import { useDefaultConfigStore } from '../../stores';
import { Field } from '../new/waitingZone/config/Field';

export function SettingsScreen() {
    const {
        processingInterval,
        objectDetectionEnabled,
        confidenceThreshold,
        processingLevel,
        setDefault,
    } = useDefaultConfigStore();

    return (
        <div className='flex items-center justify-center size-full'>
            <div className='card bg-base-200 shadow-md max-w-md card-body gap-4'>
                <h2 className='card-title text-base'>Configuration par défaut des missions</h2>

                <Field label='Nombre de traitements'>
                    <input
                        type='number'
                        min={1}
                        value={processingInterval}
                        onChange={(e) => setDefault({ processingInterval: Math.max(1, Number(e.target.value)) })}
                        className='w-20 input input-sm'
                    />
                </Field>

                <Field label="Détection d'objets">
                    <input
                        type='checkbox'
                        className='toggle toggle-sm toggle-primary'
                        checked={objectDetectionEnabled}
                        onChange={(e) => setDefault({ objectDetectionEnabled: e.target.checked })}
                    />
                </Field>

                {objectDetectionEnabled && (
                    <Field label='Seuil de confiance'>
                        <span className='tabular-nums'>{confidenceThreshold}%</span>
                        <input
                            type='range'
                            min={0}
                            max={100}
                            value={confidenceThreshold}
                            onChange={(e) => setDefault({ confidenceThreshold: Number(e.target.value) })}
                            className='w-32 range range-xs range-primary'
                        />
                    </Field>
                )}

                <Field label='Niveau de traitement'>
                    <select
                        className='w-32 select-sm select cursor-pointer'
                        value={processingLevel}
                        onChange={(e) => setDefault({ processingLevel: e.target.value })}
                    >
                        <option value='low'>Léger</option>
                        <option value='medium'>Moyen</option>
                        <option value='high'>Lourd</option>
                    </select>
                </Field>
            </div>
        </div>
    );
}