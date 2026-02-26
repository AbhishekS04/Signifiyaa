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

export const api = {
    get: async (table: string, column?: string, value?: string) => {
        const params = column && value
            ? `?column=${encodeURIComponent(column)}&value=${encodeURIComponent(value)}`
            : '';
        return fetch(`${API_BASE}/table/${table}${params}`, {
            headers: await getHeaders(),
        }).then(r => r.json());
    },

    queryOrdered: async (table: string, filterCol: string, filterVal: string, orderBy: string) =>
        fetch(
            `${API_BASE}/table/${table}/query?filter_column=${encodeURIComponent(filterCol)}&filter_value=${encodeURIComponent(filterVal)}&order_by=${orderBy}&ascending=false`,
            { headers: await getHeaders() }
        ).then(r => r.json()),

    post: async (table: string, data: object) =>
        fetch(`${API_BASE}/table/${table}`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify({ data }),
        }).then(r => r.json()),
};
