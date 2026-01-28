import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { authClient } from '../lib/betterAuthClient';

// Ensure web browser sessions are completed properly
WebBrowser.maybeCompleteAuthSession();

interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
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

    // Initialize auth on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                console.log('Initializing BetterAuth...');
                const { data, error } = await authClient.getSession();
                if (data?.user) {
                    console.log('Session restored for:', data.user.email);
                    setSession(data.session);
                    setUser(data.user);
                    setProfile(data.user);
                } else {
                    setSession(null);
                    setUser(null);
                    setProfile(null);
                }
            } catch (e) {
                console.error('Auth Init Error:', e);
                setSession(null);
                setUser(null);
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    // Listen for deep link callbacks (OAuth)
    useEffect(() => {
        const handleDeepLink = async ({ url }: { url: string }) => {
            console.log('Deep link received:', url);
            // Handle OAuth callback - refresh session
            if (url.includes('callback') || url.includes('signifiya://')) {
                try {
                    // Small delay to let the cookies settle
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const { data } = await authClient.getSession();
                    if (data?.user) {
                        console.log('OAuth session established for:', data.user.email);
                        setSession(data.session);
                        setUser(data.user);
                        setProfile(data.user);
                    }
                } catch (e) {
                    console.error('OAuth callback error:', e);
                }
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        // Check for initial URL (app opened via deep link)
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink({ url });
            }
        });

        return () => subscription.remove();
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await authClient.signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                throw new Error(error.message || 'Sign in failed');
            }

            if (data?.user) {
                setSession(data.token || data);
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
            // Generate default avatar
            const image = `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(name)}`;

            const { data, error } = await authClient.signUp.email({
                email: email.trim(),
                password,
                name,
                image,
            });

            if (error) {
                throw new Error(error.message || 'Sign up failed');
            }

            if (data?.user) {
                setSession(data.token || data);
                setUser(data.user);
                setProfile(data.user);
            } else {
                // Email verification might be required
                Alert.alert('Success', 'Account created! Please check your email to verify.');
            }
        } catch (error: any) {
            Alert.alert('Sign Up Error', error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithOAuth = async (provider: 'google' | 'github') => {
        try {
            setIsLoading(true);

            // Use Better Auth social sign in
            // The expoClient plugin handles:
            // 1. Converting "/" to full app scheme URL
            // 2. Opening the browser
            // 3. Handling the callback and storing cookies
            const { error } = await authClient.signIn.social({
                provider,
                callbackURL: "/",  // expoClient converts this to signifiya:// or exp://
            });

            if (error) {
                throw new Error(error.message || 'OAuth failed');
            }

            // After browser closes, fetch session to update state
            const { data } = await authClient.getSession();
            if (data?.user) {
                setSession(data.session);
                setUser(data.user);
                setProfile(data.user);
            }
        } catch (error: any) {
            Alert.alert('OAuth Error', error.message || 'Failed to sign in with ' + provider);
            console.error('OAuth Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            await authClient.signOut();
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
