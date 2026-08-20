import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDefaultCartoStore = create(
    persist(
        (set) => ({
            defaultCarto: null,
            setDefaultCarto: (defaultCarto) => set({ defaultCarto }),
        }),
        { name: 'default-carto' },
    ),
);
