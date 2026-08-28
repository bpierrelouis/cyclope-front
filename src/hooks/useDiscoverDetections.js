import { useEffect } from 'react';

import { detectionCatalogStore } from '../stores';

/** Ajoute au catalogue les types de détection présents dans les résultats. */
export function useDiscoverDetections(results) {
    useEffect(() => {
        detectionCatalogStore.getState().discoverDetections(results);
    }, [results]);
}
