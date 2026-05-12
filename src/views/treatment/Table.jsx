import { useEffect } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { sendOpenStateToMaster } from '../../utils/others';

export default function Table() {
    const {
        isMaster,
    } = usePlayerStore();

    useEffect(() => {
        if (isMaster) return;
        return sendOpenStateToMaster('isTableOpen');
    }, [isMaster]);

    return (null);
}
