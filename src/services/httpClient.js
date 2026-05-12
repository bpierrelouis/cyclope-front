const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
};

export async function httpRequest(partialPath, options = {}) {
    const config = {
        headers: DEFAULT_HEADERS,
        ...options,
    };

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

    return data;
}
