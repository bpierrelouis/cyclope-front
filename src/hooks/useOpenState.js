import { useEffect } from 'react';

import { playerService } from '../services';
import { usePlayerStore } from '../stores';

export const useOpenState = (property) => {
    const isMaster = usePlayerStore((state) => state.isMaster);

    useEffect(() => {
        if (isMaster) return;
        playerService.requestState({ [property]: true });

        const closeView = () => {
            playerService.requestState({ [property]: false });
        };

        window.addEventListener('beforeunload', closeView);
        window.addEventListener('pagehide', closeView);

        return () => {
            window.removeEventListener('beforeunload', closeView);
            window.removeEventListener('pagehide', closeView);
            closeView();
        };
    }, [isMaster, property]);
};
