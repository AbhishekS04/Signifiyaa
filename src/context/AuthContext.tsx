import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Alert } from 'react-native';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: any | null; // Use specific type if possible later
    isLoggedIn: boolean;
    isLoading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null); // Added profile state
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user') // Querying the public 'user' table
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setProfile(data);
            }
        } catch (e) {
            console.error('Exception fetching profile:', e);
        }
    };

    useEffect(() => {
        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setIsLoading(false);
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setIsLoading(false);
            Alert.alert('Sign In Error', error.message);
            throw error;
        }
        // State updates via onAuthStateChange
    };

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        const { data: { user, session }, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            setIsLoading(false);
            Alert.alert('Sign Up Error', error.message);
            throw error;
        }

        if (user) {
            // Create public user record
            // matching the Prisma schema: id, name, email, emailVerified
            const { error: dbError } = await supabase
                .from('user') // Prisma maps "User" model to "user" table
                .insert([
                    {
                        id: user.id,
                        name: name,
                        email: email,
                        emailVerified: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                ]);

            if (dbError) {
                console.error('Error creating user profile:', dbError);
                Alert.alert('Profile Creation Error', 'Account created but profile setup failed. Please contact support.');
                // Optional: Delete auth user if profile creation fails? 
                // For now, we keep it but warn.
            } else {
                // Fetch profile immediately after creation
                await fetchProfile(user.id);
            }
        }

        // If email confirmation is required, session might be null
        if (!session && user) {
            Alert.alert('Success', 'Please check your email for the confirmation link.');
        }

        setIsLoading(false);
    };

    const signOut = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Sign Out Error:', error);
        }
        setProfile(null); // Clear profile on logout
        setIsLoading(false);
    };

    const value = {
        session,
        user,
        profile, // Exposed profile
        isLoggedIn: !!user,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
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

