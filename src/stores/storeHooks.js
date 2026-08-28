import { useStore } from 'zustand';

import { defaultCartoStore } from './defaultCartoStore';
import { defaultConfigStore } from './defaultConfigStore';
import { detectionCatalogStore } from './detectionCatalogStore';
import { missionCollapseStore } from './missionCollapseStore';
import { missionCreationStore } from './missionCreationStore';
import { playerStore } from './playerStore';
import { tableStore } from './tableStore';
import { themeStore } from './themeStore';

export const useDefaultCartoStore = (selector) => useStore(defaultCartoStore, selector);
export const useDefaultConfigStore = (selector) => useStore(defaultConfigStore, selector);
export const useDetectionCatalogStore = (selector) => useStore(detectionCatalogStore, selector);
export const useMissionCollapseStore = (selector) => useStore(missionCollapseStore, selector);
export const useMissionCreationStore = (selector) => useStore(missionCreationStore, selector);
export const usePlayerStore = (selector) => useStore(playerStore, selector);
export const useTableStore = (selector) => useStore(tableStore, selector);
export const useThemeStore = (selector) => useStore(themeStore, selector);
