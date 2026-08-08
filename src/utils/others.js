import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const preventDefault = (fn) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    fn(event);
};

const compilePath = (path) => {
    const keys = path.split('.');
    return (object) => keys.reduce(
        (value, key) => value?.[key],
        object,
    );
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

export const getTimestamp = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const date = `${pad(now.getDate())}_${pad(now.getMonth() + 1)}_${now.getFullYear()}`;
    const time = `${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
    return `${date}_${time}`;
};
