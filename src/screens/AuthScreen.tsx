import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, Easing, LinearTransition } from 'react-native-reanimated';
import { ArrowLeft, Github, Eye, EyeOff } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import SmoothButton from '../components/ui/SmoothButton';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { PageTransition } from '../components/navigation/PageTransition';

const { width } = Dimensions.get('window');

// Font Configuration
const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton';

// Google Logo SVG Component
const GoogleLogo = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24">
        <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
        <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </Svg>
);

export default function AuthScreen() {
    const navigation = useNavigation();
    const { signInWithEmail, signUpWithEmail, signInWithOAuth, triggerWelcomeToast } = useAuth();

    // Form State
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOAuthLoading, setIsOAuthLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password || (isSignUp && !name)) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            if (isSignUp) {
                await signUpWithEmail(email, password, name);
                // Success alert handled in context if email verification needed
                // Navigation handled reactively by AppNavigator when isLoggedIn changes
            } else {
                await signInWithEmail(email, password);
                // Trigger smooth global welcome toast
                triggerWelcomeToast();
            }
        } catch (error) {
            // Error alert handled in Context
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        try {
            setIsOAuthLoading(true);
            await signInWithOAuth(provider);
            // Success handling - modal will close via reactive navigation
        } catch (error) {
            console.error('OAuth Error:', error);
        } finally {
            setIsOAuthLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F5E6FA]" edges={['top', 'left', 'right']}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Top Bar */}
                <View className="px-6 pt-4 pb-2 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-12 h-12 rounded-full border-[2.5px] border-black bg-white items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <ArrowLeft color="black" size={24} strokeWidth={3} />
                    </TouchableOpacity>
                    <Text className="ml-4 text-xl uppercase" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </Text>
                </View>

                {/* Main Content Card */}
                <View className="px-6 mt-6">
                    <Animated.View
                        className="bg-white border-[3px] border-black rounded-[40px] p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
                    >
                        {/* Title Segment */}
                        {/* ... */}
                        <Animated.Text
                            key={isSignUp ? 'signup-title' : 'signin-title'}
                            entering={FadeIn.duration(300)}
                            className="text-5xl tracking-tighter mb-8 uppercase"
                            style={{ fontFamily: FONT_BOLD, color: 'black' }}
                        >
                            {isSignUp ? 'SIGN UP' : 'SIGN IN'}
                        </Animated.Text>

                        {/* Social Auth */}
                        <View className="gap-4 mb-8">
                            <SmoothButton
                                onPress={() => handleOAuthSignIn('google')}
                                buttonStyle="flex-row items-center justify-center py-4 border-[2.5px] border-black rounded-2xl bg-white"
                                shadowStyle="bg-black rounded-2xl"
                                depth={4}
                            >
                                <View className="flex-row items-center gap-3">
                                    <GoogleLogo />
                                    <Text className="text-sm uppercase tracking-wide" style={{ fontFamily: FONT_BOLD }}>Continue with Google</Text>
                                </View>
                            </SmoothButton>

                            <SmoothButton
                                onPress={() => handleOAuthSignIn('github')}
                                buttonStyle="flex-row items-center justify-center py-4 border-[2.5px] border-black rounded-2xl bg-white"
                                shadowStyle="bg-black rounded-2xl"
                                depth={4}
                            >
                                <View className="flex-row items-center gap-3">
                                    <Github color="black" size={20} fill="black" />
                                    <Text className="text-sm uppercase tracking-wide" style={{ fontFamily: FONT_BOLD }}>Continue with GitHub</Text>
                                </View>
                            </SmoothButton>
                        </View>

                        {/* Divider */}
                        <View className="flex-row items-center gap-4 mb-8">
                            <View className="h-[2.5px] bg-black flex-1 rounded-full" />
                            <Text className="text-xs font-bold" style={{ color: 'black' }}>OR USE EMAIL</Text>
                            <View className="h-[2.5px] bg-black flex-1 rounded-full" />
                        </View>

                        {/* Form */}
                        <View className="gap-5 mb-8">
                            {isSignUp && (
                                <Animated.View entering={FadeIn.duration(300)}>
                                    <Text className="text-[10px] mb-2 uppercase tracking-widest pl-1 font-bold">Full Name</Text>
                                    <TextInput
                                        className="w-full border-[2.5px] border-black rounded-2xl px-5 py-4 text-black text-sm bg-[#F5F5F5]"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChangeText={setName}
                                        style={{ fontFamily: FONT_MAIN }}
                                    />
                                </Animated.View>
                            )}

                            <View>
                                <Text className="text-[10px] mb-2 uppercase tracking-widest pl-1 font-bold">Email Address</Text>
                                <TextInput
                                    className="w-full border-[2.5px] border-black rounded-2xl px-5 py-4 text-black text-sm bg-[#F5F5F5]"
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={{ fontFamily: FONT_MAIN }}
                                />
                            </View>

                            <View>
                                <Text className="text-[10px] mb-2 uppercase tracking-widest pl-1 font-bold">Password</Text>
                                <View className="relative">
                                    <TextInput
                                        className="w-full border-[2.5px] border-black rounded-2xl px-5 py-4 text-black text-sm bg-[#F5F5F5] pr-12"
                                        placeholder="Enter your password"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                        style={{ fontFamily: FONT_MAIN }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-[18px]"
                                    >
                                        {showPassword ? <EyeOff color="black" size={20} /> : <Eye color="black" size={20} />}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Action Button */}
                        <SmoothButton
                            onPress={isSubmitting ? undefined : handleSubmit}
                            buttonStyle={`w-full bg-black rounded-[20px] py-5 items-center justify-center border-[2.5px] border-black ${isSubmitting ? 'opacity-50' : ''}`}
                            shadowStyle="bg-black rounded-[20px]"
                            depth={isSubmitting ? 0 : 6}
                        >
                            <Text className="text-white text-lg uppercase tracking-widest" style={{ fontFamily: FONT_BOLD }}>
                                {isSubmitting ? 'PLEASE WAIT...' : (isSignUp ? 'REGISTER NOW' : 'SIGN IN')}
                            </Text>
                        </SmoothButton>

                        {/* Toggle Footer */}
                        <TouchableOpacity
                            className="mt-8 flex-row justify-center"
                            onPress={() => setIsSignUp(!isSignUp)}
                        >
                            <Text className="text-xs" style={{ fontFamily: FONT_MAIN }}>
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            </Text>
                            <Text className="text-xs font-bold underline" style={{ fontFamily: FONT_BOLD }}>
                                {isSignUp ? 'Sign In' : 'Register Here'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Sarcastic Footer Text */}
                <Text className="text-center mt-10 text-[10px] uppercase opacity-30 tracking-widest px-10">
                    {isSignUp
                        ? "Join the club, we have cookies (and high-end code)."
                        : "Welcome back! We missed your wallet... I mean, your presence."}
                </Text>
            </ScrollView>

            {/* OAuth Loading Overlay */}
            <Modal
                visible={isOAuthLoading}
                transparent
                animationType="fade"
            >
                <View className="flex-1 bg-black/70 items-center justify-center">
                    <View className="bg-white border-[3px] border-black rounded-3xl p-8 items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <ActivityIndicator size="large" color="#000" />
                        <Text className="mt-4 text-base uppercase tracking-wide" style={{ fontFamily: FONT_BOLD }}>
                            Signing in...
                        </Text>
                        <Text className="mt-2 text-xs opacity-50" style={{ fontFamily: FONT_MAIN }}>
                            Please wait while we authenticate
                        </Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
