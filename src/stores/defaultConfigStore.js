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
                const processingInterval = Math.min(get().processingInterval, file.duration ?? Infinity);
                return {
                    ...get(),
                    processingInterval,
                };
            },
        }),
        { name: 'default-config' },
    ),
);
