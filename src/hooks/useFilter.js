import { useMemo, useState } from 'react';
import { includesIgnoreCase } from '../utils';

export const useFilter = (list, key) => {
    const [searchText, setSearchText] = useState('');

    const items = useMemo(() => {
        const search = searchText.trim();
        if (!search.length) return list;
        return list.filter((item) => {
            return includesIgnoreCase(item[key], search);
        });
    }, [list, key, searchText]);

    const setSearch = (text) =>
        setSearchText(text.trimStart());

    return {
        items,
        search: searchText,
        setSearch,
    };
};
