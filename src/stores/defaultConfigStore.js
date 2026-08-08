import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDefaultConfigStore = create(
    persist(
        (set, get) => ({
            confidenceThreshold: 50,
            frameStep: 3,
            getDefault: (file) => {
                const frameStep = Math.min(get().frameStep, file.duration ?? Infinity);
                return {
                    ...get(),
                    frameStep,
                };
            },
            objectDetectionEnabled: false,

            processingLevel: 2,

            setPartialState: (partial) =>
                set(partial),
        }),
        { name: 'default-config' },
    ),
);
