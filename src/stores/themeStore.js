import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const KEY = 'theme-config';

const applyTheme = (isDark) =>
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

export const useThemeStore = create(persist(
    (set, get) => ({
        isDark: false,
        toggle: () => set({ isDark: !get().isDark }),
    }),
    { name: KEY },
));

useThemeStore.subscribe((state) => applyTheme(state.isDark));
applyTheme(useThemeStore.getState().isDark);

globalThis.addEventListener('storage', (e) => {
    if (e.key === KEY) useThemeStore.persist.rehydrate();
});