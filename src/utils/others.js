import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
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

const compilePath = (path) => {
    const keys = path.split('.');
    return new Function('obj', `return obj?.${keys.join('?.')}`);
};

export const sortByKeyPath = (arr, path, dir = 'asc') => {
    const get = compilePath(path);

    const sorted = arr.toSorted((a, b) => {
        const va = get(a);
        const vb = get(b);

        if (va === vb) return 0;

        const res = va > vb ? 1 : -1;
        return dir === 'asc' ? res : -res;
    });
    return sorted;
};

export const cn = (...inputs) =>
    twMerge(clsx(...inputs));

export const hasFalseValue = (obj) => {
    if (!obj) return false;
    return Object.values(obj).some((value) => {
        if (value && typeof value === 'object') {
            return hasFalseValue(value);
        }

        return value === false;
    });
};
