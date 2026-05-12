import { playerService } from '../services';

export const preventDefault = (fn) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    fn(event);
};

export const sendOpenStateToMaster = (property) => {
    playerService.requestState({ [property]: true });

    const handleBeforeUnload = () => {
        playerService.requestState({ [property]: false });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
};
