import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export const defaultCartoStore = createStore(
    persist(
        (set) => ({
            defaultCarto: null,
            setDefaultCarto: (defaultCarto) => set({ defaultCarto }),
        }),
        { name: 'default-carto' },
    ),
);
