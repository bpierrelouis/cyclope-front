import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDefaultConfigStore = create(
    persist(
        (set, get) => ({
            frameStep: 3,
            objectDetectionEnabled: false,
            confidenceThreshold: 50,
            processingLevel: 2,

            setPartialState: (partial) =>
                set(partial),

            getDefault: (file) => {
                const frameStep = Math.min(get().frameStep, file.duration ?? Infinity);
                return {
                    ...get(),
                    frameStep,
                };
            },
        }),
        { name: 'default-config' },
    ),
);
