import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDefaultConfigStore = create(
    persist(
        (set) => ({
            frameStep: 3,
            objectDetectionEnabled: false,
            confidenceThreshold: 50,
            processingLevel: 2,

            setPartialState: (partial) =>
                set(partial),
        }),
        { name: 'default-config' },
    ),
);
