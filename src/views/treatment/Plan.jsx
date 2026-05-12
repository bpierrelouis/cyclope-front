import { useEffect } from 'react';
import { usePlayerStore } from '../../stores';
import { sendOpenStateToMaster } from '../../utils';

export function Plan() {
    const {
        isMaster,
    } = usePlayerStore();

    useEffect(() => {
        if (isMaster) return;
        return sendOpenStateToMaster('isPlanOpen');
    }, [isMaster]);

    return (null);
}
