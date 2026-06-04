const fromSnakeToCamelCase = (str) =>
    str.replaceAll(/_([a-z])/g, (_, c) => c.toUpperCase());

const fromCamelToSnakeCase = (str) =>
    str.replaceAll(/([A-Z])/g, '_$1').toLowerCase();

const convertKeys = (obj, keyConverter) => {
    if (Array.isArray(obj)) {
        return obj.map((o) => convertKeys(o, keyConverter));
    }
    if (!obj || typeof obj !== 'object') return obj;
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = keyConverter(key);
        acc[camelKey] = convertKeys(value, keyConverter);
        return acc;
    }, {});
};

export const convertKeysFromSnakeToCamelCase = (obj) =>
    convertKeys(obj, fromSnakeToCamelCase);

export const convertKeysFromCamelToSnakeCase = (obj) =>
    convertKeys(obj, fromCamelToSnakeCase);

export const arrayMapper = (data, mapper) => {
    if (!Array.isArray(data) || !mapper) return [];
    return data.map((element) => mapper(element));
};
