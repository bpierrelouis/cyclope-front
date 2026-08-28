import { convertKeysFromCamelToSnakeCase, convertKeysFromSnakeToCamelCase } from '../utils';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
};

export const httpRequest = async (partialPath, options = {}) => {
    let config = {
        headers: DEFAULT_HEADERS,
        ...options,
    };

    if (config.body) {
        config = {
            ...config,
            body: JSON.stringify(convertKeysFromCamelToSnakeCase(config.body)),
        };
    }

    const response = await fetch(`/api/${partialPath}`, config);

    let data = null;

    try {
        data = await response.json();
    } catch {
        // cas 204 ou réponse vide
    }

    if (!response.ok) {
        throw new Error(data?.message || 'API Error');
    }

    data = convertKeysFromSnakeToCamelCase(data);

    return data;
};
