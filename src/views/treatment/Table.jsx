import { useEffect } from 'react';
import { usePlayerStore } from '../../stores';
import { sendOpenStateToMaster } from '../../utils';

export function Table() {
    const {
        isMaster,
    } = usePlayerStore();

    useEffect(() => {
        if (isMaster) return;
        return sendOpenStateToMaster('isTableOpen');
    }, [isMaster]);

    return (null);
}
