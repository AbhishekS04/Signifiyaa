import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { betterAuth } from '../lib/betterAuthClient';

// Use loose types for now as BetterAuth types map closely
interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    emailVerified: boolean;
}

interface AuthContextType {
    session: any | null;
    user: User | null;
    profile: any | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
    signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<any | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initAuth = async () => {
        try {
            console.log('Initializing BetterAuth...');
            const data = await betterAuth.getSession();
            if (data?.session && data?.user) {
                console.log('Session restored for:', data.user.email);
                setSession(data.session);
                setUser(data.user);
                // BetterAuth user object IS the profile usually
                setProfile(data.user);
            } else {
                setSession(null);
                setUser(null);
                setProfile(null);
            }
        } catch (e) {
            console.error('Auth Init Error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initAuth();
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const data = await betterAuth.signIn(email.trim(), password);
            if (data?.session && data?.user) {
                setSession(data.session);
                setUser(data.user);
                setProfile(data.user);
            }
        } catch (error: any) {
            Alert.alert('Sign In Error', error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        try {
            // Check if user has an image, if not generate one
            const image = `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(name)}`;

            const data = await betterAuth.signUp(name, email, password, image);

            if (data?.session && data?.user) {
                setSession(data.session);
                setUser(data.user);
                setProfile(data.user);
                // Allow auto login
            } else {
                // If email verification is ON, session might be null depending on config
                Alert.alert('Success', 'Account created! Please login.');
            }
        } catch (error: any) {
            Alert.alert('Sign Up Error', error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Keep strict types for the hook but generic internal impl
    const signInWithOAuth = async (provider: 'google' | 'github') => {
        // OAuth with BetterAuth usually involves Redirects to the backend
        // For now, let's notify the user this might need specific backend endpoints
        // or we use the WebBrowser to hit /api/auth/sign-in/social?provider=google

        Alert.alert('Coming Soon', 'Please use Email/Password for now. OAuth setup requires backend redirect config update.');
        // Implementation TODO: 
        // 1. Open WebBrowser to BETTER_AUTH_URL/api/auth/sign-in/google
        // 2. Backend handles flow and redirects back to App Scheme with cookie or token
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            await betterAuth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
        } catch (e) {
            console.error('Sign Out Error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        session,
        user,
        profile,
        isLoggedIn: !!user,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithOAuth,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

