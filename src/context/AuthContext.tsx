import { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { authClient } from '../lib/betterAuthClient';
import { supabase } from '../lib/supabase';

// Ensure web browser sessions are completed properly
WebBrowser.maybeCompleteAuthSession();

interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    emailVerified: boolean;
    mobileNo?: string;
    collegeName?: string;
    bookingId?: string;
    gender?: string;
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
    updateProfile: (updates: { name?: string; mobileNo?: string; collegeName?: string; bookingId?: string; image?: string; gender?: string }) => Promise<void>;
    welcomeToastVisible: boolean;
    setWelcomeToastVisible: (visible: boolean) => void;
    triggerWelcomeToast: () => void;
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
                const { data, error } = await authClient.getSession();
                if (data?.user) {

                    const fullUser = await syncUserProfile(data.user);

                    setSession(data.session);
                    setUser(fullUser);
                    setProfile(fullUser);
                } else {
                    setSession(null);
                    setUser(null);
                    setProfile(null);
                }
            } catch (e: any) {
                if (__DEV__) {
                    console.error('Auth Init Error:', e.message);
                }
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
            // Deep link received
            // Handle OAuth callback - refresh session
            if (url.includes('callback') || url.includes('signifiya://')) {
                try {
                    // Small delay to let the cookies settle
                    await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
                    const { data } = await authClient.getSession();
                    if (data?.user) {
                        // OAuth session established
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

    // Helper to sync extra profile data from Supabase
    const syncUserProfile = async (baseUser: any) => {
        let finalUser: User = { ...baseUser };

        // Always fetch from Supabase to ensure we have the latest profile data (image, mobile, etc.)
        try {
            // Fetch latest profile from Supabase
            const { data: sbUser, error } = await supabase
                .from('user')
                .select('bookingId, mobileNo, collegeName, gender, image')
                .eq('email', finalUser.email)
                .single();

            if (error) {
                console.error('Supabase query error:', error);
            }

            if (sbUser) {
                finalUser = {
                    ...finalUser,
                    bookingId: sbUser.bookingId || finalUser.bookingId,
                    mobileNo: sbUser.mobileNo || finalUser.mobileNo,
                    collegeName: sbUser.collegeName || finalUser.collegeName,
                    gender: sbUser.gender || finalUser.gender,
                    image: sbUser.image || finalUser.image,
                };
            }
        } catch (err) {
            console.error('Supabase sync exception:', err);
        }

        // SECURITY FIX: Ensure all users have a booking ID
        if (!finalUser.bookingId) {
            const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
            const newBookingId = `SGF26-${randomPart}`;
            console.log('⚠️ Booking ID missing. Generating:', newBookingId);

            try {
                const { error: updateError } = await supabase
                    .from('user')
                    .update({ bookingId: newBookingId, updatedAt: new Date().toISOString() })
                    .eq('email', finalUser.email);

                if (updateError) {
                    console.error('❌ Failed to save booking ID:', updateError);
                } else {
                    finalUser = { ...finalUser, bookingId: newBookingId };
                    console.log('✓ Booking ID generated and saved:', newBookingId);
                }
            } catch (err) {
                console.error('❌ Booking ID generation error:', err);
            }
        }

        return finalUser;
    };

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
                const fullUser = await syncUserProfile(data.user);
                setSession(data.token || data);
                setUser(fullUser);
                setProfile(fullUser);
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
            const { data, error } = await authClient.signUp.email({
                email: email.trim(),
                password,
                name,
                // image is optional, let it be null/undefined for now so UI handles default
            });

            if (error) {
                throw new Error(error.message || 'Sign up failed');
            }

            if (data?.user) {
                const fullUser = await syncUserProfile(data.user);
                // syncUserProfile now handles booking ID generation automatically

                setSession(data.token || data);
                setUser(fullUser);
                setProfile(fullUser);
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
                const fullUser = await syncUserProfile(data.user);
                // syncUserProfile now handles booking ID generation automatically

                setSession(data.session);
                setUser(fullUser);
                setProfile(fullUser);
            }
        } catch (error: any) {
            Alert.alert('OAuth Error', error.message || 'Failed to sign in with ' + provider);
            console.error('OAuth Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Welcome Toast State
    const [welcomeToastVisible, setWelcomeToastVisible] = useState(false);

    const triggerWelcomeToast = () => {
        setWelcomeToastVisible(true);
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            // OPTIMISTIC LOGOUT: Clear state immediately to mask API delay
            setSession(null);
            setUser(null);
            setProfile(null);

            // Perform API call in background
            await authClient.signOut();
        } catch (e) {
            console.error('Sign Out Error:', e);
            // In theory we could revert, but for logout it's better to just stay out
        } finally {
            setIsLoading(false);
        }
    };


    const updateProfile = async (updates: { name?: string; mobileNo?: string; collegeName?: string; bookingId?: string; image?: string; gender?: string }) => {
        setIsLoading(true);
        try {
            console.log('=== Updating profile with:', updates);

            // Better Auth doesn't expose user.update on the client
            // We need to make a direct API call to the update-user endpoint
            const BASE_URL = process.env.EXPO_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
            console.log('API URL:', `${BASE_URL}/api/auth/update-user`);

            const response = await fetch(`${BASE_URL}/api/auth/update-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': BASE_URL, // Required by Better Auth for CSRF check
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify(updates),
            });

            console.log('Update response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to update profile on Auth Server' }));
                console.warn('Auth Server Update Warning:', errorData);
                // Don't throw here! Let Supabase logic try to save the data.
            } else {
                const data = await response.json();
                console.log('Auth Server Update Success:', data);
            }

            // IMPORTANT: better-auth API may not save custom fields (mobileNo, collegeName, gender)
            // So we directly update Supabase to ensure persistence
            if (user?.email) {
                try {
                    // Normalize email for matching
                    const targetEmail = user.email;

                    console.log(`Attempting Supabase update for: ${targetEmail}`);

                    const { error: supabaseError, count } = await supabase
                        .from('user')
                        .update({
                            ...(updates.mobileNo && { mobileNo: updates.mobileNo }),
                            ...(updates.collegeName && { collegeName: updates.collegeName }),
                            ...(updates.gender && { gender: updates.gender }),
                            ...(updates.name && { name: updates.name }),
                            ...(updates.image && { image: updates.image }),
                        }, { count: 'exact' }) // Request count
                        .eq('email', targetEmail);

                    if (supabaseError) {
                        console.error('Supabase direct update error:', supabaseError);
                        // Now we might want to throw if BOTH failed
                        if (!response.ok) throw new Error(supabaseError.message);
                    } else {
                        console.log(`✓ Custom fields updated. Rows modified: ${count}`);

                        // If no rows updated, maybe email case mismatch? Try lowercase
                        if (count === 0) {
                            console.warn('0 rows updated! Trying lowercase email match...');
                            const { count: retryCount, error: retryError } = await supabase
                                .from('user')
                                .update({
                                    ...(updates.mobileNo && { mobileNo: updates.mobileNo }),
                                    ...(updates.collegeName && { collegeName: updates.collegeName }),
                                    ...(updates.gender && { gender: updates.gender }),
                                    ...(updates.name && { name: updates.name }),
                                    ...(updates.image && { image: updates.image }),
                                }, { count: 'exact' })
                                .ilike('email', targetEmail); // Case insensitive match

                            if (retryError) {
                                console.error('Retry update failed:', retryError);
                            } else {
                                console.log(`Retry update rows modified: ${retryCount}`);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Supabase update exception:', err);
                }
            }

            // Always try to refresh the local user state
            // Refresh session to get updated user data, then sync
            const { data: sessionData } = await authClient.getSession();
            if (sessionData?.user) {
                const fullUser = await syncUserProfile(sessionData.user);
                setUser(fullUser);
                setProfile(fullUser);
                // Success - UI will handle notification
            }
        } catch (error: any) {
            console.error('Update Profile Error:', error);
            Alert.alert('Update Error', error.message || 'Failed to update profile');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value = useMemo(() => ({
        session,
        user,
        profile,
        isLoggedIn: !!user,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithOAuth,
        signOut,
        updateProfile,
        welcomeToastVisible,
        setWelcomeToastVisible,
        triggerWelcomeToast,
    }), [session, user, profile, isLoading, welcomeToastVisible]);

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
