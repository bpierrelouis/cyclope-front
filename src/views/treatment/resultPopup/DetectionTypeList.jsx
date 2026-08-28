import { CheckIcon } from 'lucide-react';

import {
    cn,
    getDetectionBackgroundStyle,
    getDetectionColor,
    sameName,
} from '../../../utils';

export function DetectionTypeList(props) {
    const {
        categories, detections, highlightedName, onSelect, registerButton, selectedType,
    } = props;

    return (
        <div className='flex flex-col gap-0.5 px-2 pb-2 max-h-44 overflow-y-auto' role='listbox'>
            {detections.length === 0 && (
                <p className='px-2 py-5 text-sm text-base-content/50 text-center'>
                    Aucun type enregistré
                </p>
            )}
            {detections.map((detection) => {
                const isSelected = sameName(detection.name, selectedType);
                const isHighlighted = sameName(detection.name, highlightedName);

                return (
                    <button
                        key={detection.name}
                        ref={(element) => registerButton(detection.name, element)}
                        type='button'
                        className={cn(
                            'group flex items-center gap-2.5 hover:bg-base-200 px-2.5 py-2 rounded-lg text-sm text-left cursor-pointer',
                            isSelected && 'bg-base-200 font-semibold',
                            isHighlighted && 'bg-primary/15 outline-1 outline-primary',
                        )}
                        onClick={() => onSelect(detection.name)}
                        role='option'
                        aria-selected={isSelected}
                    >
                        <span
                            className='shadow-xs rounded-full w-3 h-3 shrink-0'
                            style={getDetectionBackgroundStyle(
                                getDetectionColor(detection.name, detections, categories),
                            )}
                        />
                        <span className='flex-1 truncate'>{detection.name}</span>
                        {isSelected && (
                            <CheckIcon aria-hidden='true' className='text-primary' size={15} />
                        )}
                        {isHighlighted && !isSelected && (
                            <span className='text-[10px] text-primary/70 uppercase tracking-wide'>
                                Entrée
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
