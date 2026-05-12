import { useEffect } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { sendOpenStateToMaster } from '../../utils/others';

export default function Plan() {
    const {
        isMaster,
    } = usePlayerStore();

    useEffect(() => {
        if (isMaster) return;
        return sendOpenStateToMaster('isPlanOpen');
    }, [isMaster]);

    return (null);
}
