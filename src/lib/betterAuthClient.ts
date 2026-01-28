import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';

// Storage Key for Session Cookie
const COOKIE_KEY = 'better-auth-session-cookie';

interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

interface Session {
    id: string;
    userId: string;
    expiresAt: string;
    ipAddress?: string;
    userAgent?: string;
}

export const betterAuth = {
    /**
     * Helper to perform fetch with Cookies
     */
    async request(endpoint: string, options: RequestInit = {}) {
        // 1. Get stored cookie
        const cookie = await AsyncStorage.getItem(COOKIE_KEY);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers as any),
        };

        if (cookie) {
            headers['Cookie'] = cookie;
        }

        console.log(`[BetterAuth] Request: ${BASE_URL}${endpoint}`);

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            // 2. Save Set-Cookie if present
            // React Native fetch exposes 'map' for headers on some platforms, or a simplified object
            // We need to look for 'set-cookie' (case insensitive)
            const setCookie = response.headers.get('set-cookie') || response.headers.get('Set-Cookie');
            if (setCookie) {
                // Simple logic: Store the whole raw string or extract the session token?
                // For direct API usage, sending back the raw Set-Cookie string as "Cookie" usually works 
                // if it's a single header. If multiple, it's trickier.
                // BetterAuth usually sets 'better-auth.session_token'.
                console.log('[BetterAuth] Saving Cookie:', setCookie);
                await AsyncStorage.setItem(COOKIE_KEY, setCookie);
            }

            return response;
        } catch (error) {
            console.error('[BetterAuth] Network Error:', error);
            throw error;
        }
    },

    async signUp(name: string, email: string, password: string, image?: string) {
        const res = await this.request('/api/auth/sign-up/email', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, image }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Sign up failed');
        }
        return await res.json(); // { user, session }
    },

    async signIn(email: string, password: string) {
        const res = await this.request('/api/auth/sign-in/email', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            try {
                const err = await res.json();
                throw new Error(err.message || err.statusText || 'Invalid credentials');
            } catch (e) {
                throw new Error('Invalid credentials or server error');
            }
        }
        return await res.json(); // { user, session }
    },

    async signOut() {
        await this.request('/api/auth/sign-out', { method: 'POST' });
        await AsyncStorage.removeItem(COOKIE_KEY);
    },

    async getSession() {
        const res = await this.request('/api/auth/get-session', { method: 'GET' });
        if (!res.ok) return null;
        return await res.json(); // { user, session } | null
    }
};
