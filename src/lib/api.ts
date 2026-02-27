import { authClient } from './betterAuthClient';

const API_BASE = 'http://api.signifiya.in/';

const getHeaders = async () => {
    const { data } = await authClient.getSession();
    const token = data?.session?.token;
    console.log('[API] Token from getSession:', token ?? 'MISSING');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

const extractArray = (payload: unknown): unknown => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return payload;

    const obj = payload as Record<string, unknown>;
    const candidateKeys = ['data', 'rows', 'results', 'records', 'items'];

    for (const key of candidateKeys) {
        if (Array.isArray(obj[key])) return obj[key];
    }

    for (const key of candidateKeys) {
        if (obj[key] && typeof obj[key] === 'object') {
            const nested = extractArray(obj[key]);
            if (Array.isArray(nested)) return nested;
        }
    }

    const keys = Object.keys(obj);
    if (keys.length === 1 && Array.isArray(obj[keys[0]])) {
        return obj[keys[0]] as unknown[];
    }

    return payload;
};

const normalizeListResponse = (payload: unknown) => extractArray(payload);

export const api = {
    getWithResponse: async (table: string, column?: string, value?: string) => {
        const params = column && value
            ? `?column=${encodeURIComponent(column)}&value=${encodeURIComponent(value)}`
            : '';
        const response = await fetch(`${API_BASE}/table/${table}${params}`, {
            headers: await getHeaders(),
        });

        const status = response.status;
        const ok = response.ok;
        const text = await response.text();

        let data: unknown = null;
        let rawData: unknown = null;
        let parseError: unknown = null;

        if (text) {
            try {
                rawData = JSON.parse(text);
                data = normalizeListResponse(rawData);
            } catch (err) {
                parseError = err;
            }
        }

        return {
            status,
            ok,
            text,
            data,
            rawData,
            parseError,
        };
    },
    get: async (table: string, column?: string, value?: string) => {
        const params = column && value
            ? `?column=${encodeURIComponent(column)}&value=${encodeURIComponent(value)}`
            : '';
        return fetch(`${API_BASE}/table/${table}${params}`, {
            headers: await getHeaders(),
        }).then(r => r.json()).then(normalizeListResponse);
    },

    queryOrdered: async (table: string, filterCol: string, filterVal: string, orderBy: string) =>
        fetch(
            `${API_BASE}/table/${table}/query?filter_column=${encodeURIComponent(filterCol)}&filter_value=${encodeURIComponent(filterVal)}&order_by=${orderBy}&ascending=false`,
            { headers: await getHeaders() }
        ).then(r => r.json()).then(normalizeListResponse),

    post: async (table: string, data: object) =>
        fetch(`${API_BASE}/table/${table}`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify({ data }),
        }).then(r => r.json()),
};
