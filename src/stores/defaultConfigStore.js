import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDefaultConfigStore = create(
    persist(
        (set) => ({
            processingInterval: 3,
            objectDetectionEnabled: false,
            confidenceThreshold: 50,
            processingLevel: 'medium',

            setPartialState: (partial) =>
                set(partial),
        }),
        { name: 'default-config' },
    ),
);
