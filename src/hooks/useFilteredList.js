export const useFilteredList = (list, key, search = '') => {
    const filtered = list
        ? list.filter((item) =>
              item[key].toLowerCase().includes(search.toLowerCase()),
          )
        : [];

    return { filtered };
};