import { useEffect } from 'react';
import { playerService } from '../services';
import { usePlayerStore } from '../stores';

export const useOpenState = (property) => {
    const isMaster = usePlayerStore((state) => state.isMaster);

    useEffect(() => {
        if (isMaster) return;
        playerService.requestState({ [property]: true });

        const handleBeforeUnload = () => {
            playerService.requestState({ [property]: false });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isMaster, property]);
};
