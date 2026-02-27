import { authClient } from './betterAuthClient';
import { supabase } from './supabase';

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
    // If already an array, return it
    if (Array.isArray(payload)) return payload;
    
    // If primitive or null, return empty array as fallback
    if (!payload || typeof payload !== 'object') {
        console.warn('[API] Received non-object payload:', typeof payload);
        return [];
    }

    const obj = payload as Record<string, unknown>;
    
    // Check if this is a PostgREST error response
    if (obj.code && obj.message) {
        console.error('[API] PostgREST error response:', obj.code, obj.message);
        return [];
    }

    // Try standard wrapper keys
    const candidateKeys = ['data', 'rows', 'results', 'records', 'items'];

    for (const key of candidateKeys) {
        if (Array.isArray(obj[key])) {
            console.log(`[API] ✓ Unwrapped array from key: ${key}, length: ${(obj[key] as unknown[]).length}`);
            return obj[key];
        }
    }

    // Try nested objects
    for (const key of candidateKeys) {
        if (obj[key] && typeof obj[key] === 'object') {
            const nested = extractArray(obj[key]);
            if (Array.isArray(nested)) return nested;
        }
    }

    // If object has single key with array value
    const keys = Object.keys(obj);
    if (keys.length === 1 && Array.isArray(obj[keys[0]])) {
        console.log(`[API] ✓ Unwrapped array from single key: ${keys[0]}`);
        return obj[keys[0]] as unknown[];
    }

    // Could not extract - log full structure and return empty array
    console.error('[API] ✗ Could not extract array from response');
    console.error('[API] Response type:', typeof payload);
    console.error('[API] Response keys:', keys.join(', '));
    console.error('[API] Full response:', JSON.stringify(payload, null, 2));
    
    return [];
};

const normalizeListResponse = (payload: unknown) => extractArray(payload);

export const api = {
    getWithResponse: async (table: string, column?: string, value?: string) => {
        try {
            let query = supabase.from(table).select('*');
            
            if (column && value) {
                query = query.eq(column, value);
            }

            const { data, error, status } = await query;

            const ok = !error && status >= 200 && status < 300;
            const text = error ? JSON.stringify({ message: error.message, code: error.code }) : JSON.stringify(data);

            return {
                status: status || (error ? 500 : 200),
                ok,
                text,
                data: data || [],
                rawData: data || [],
                parseError: error,
            };
        } catch (err) {
            console.error('[API] getWithResponse error:', err);
            return {
                status: 500,
                ok: false,
                text: JSON.stringify({ error: String(err) }),
                data: [],
                rawData: null,
                parseError: err,
            };
        }
    },

    get: async (table: string, column?: string, value?: string) => {
        try {
            let query = supabase.from(table).select('*');
            
            if (column && value) {
                query = query.eq(column, value);
            }

            const { data, error } = await query;

            if (error) {
                console.error(`[API] get(${table}) error:`, error);
                return [];
            }

            console.log(`[API] ✓ get(${table}) returned ${data?.length || 0} rows`);
            return data || [];
        } catch (err) {
            console.error('[API] get exception:', err);
            return [];
        }
    },

    queryOrdered: async (table: string, filterCol: string, filterVal: string, orderBy: string) => {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq(filterCol, filterVal)
                .order(orderBy, { ascending: false });

            if (error) {
                console.error(`[API] queryOrdered(${table}) error:`, error);
                return [];
            }

            console.log(`[API] ✓ queryOrdered(${table}) returned ${data?.length || 0} rows`);
            return data || [];
        } catch (err) {
            console.error('[API] queryOrdered exception:', err);
            return [];
        }
    },

    post: async (table: string, payload: object) => {
        try {
            const { data, error } = await supabase
                .from(table)
                .insert(payload)
                .select();

            if (error) {
                console.error(`[API] post(${table}) error:`, error);
                throw error;
            }

            console.log(`[API] ✓ post(${table}) successful`);
            return data;
        } catch (err) {
            console.error('[API] post exception:', err);
            throw err;
        }
    },
};
