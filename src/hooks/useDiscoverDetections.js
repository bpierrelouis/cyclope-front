import { useEffect } from 'react';

import { useDetectionCatalogStore } from '../stores';

/** Ajoute au catalogue les types de détection présents dans les résultats. */
export function useDiscoverDetections(results) {
    useEffect(() => {
        useDetectionCatalogStore.getState().discoverDetections(results);
    }, [results]);
}
