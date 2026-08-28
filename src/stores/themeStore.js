import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

const KEY = 'theme-config';

const applyTheme = (isDark) =>
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

export const themeStore = createStore(persist(
    (set, get) => ({
        isDark: false,
        toggle: () => set({ isDark: !get().isDark }),
    }),
    { name: KEY },
));

themeStore.subscribe((state) => applyTheme(state.isDark));
applyTheme(themeStore.getState().isDark);

globalThis.addEventListener('storage', (e) => {
    if (e.key === KEY) themeStore.persist.rehydrate();
});
