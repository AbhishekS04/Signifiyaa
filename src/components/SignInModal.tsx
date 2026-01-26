import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Platform, StyleSheet, Alert } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    FadeIn,
    FadeOut,
    Easing
} from 'react-native-reanimated';
import { ArrowLeft, Github, Chrome } from 'lucide-react-native'; // Mocking Google with Chrome icon as usually Lucide doesn't have Google logo
import { BlurView } from 'expo-blur';
import SmoothButton from './ui/SmoothButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Font Configuration
const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton';

interface SignInModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const SignInModal = ({ isVisible, onClose }: SignInModalProps) => {
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const opacity = useSharedValue(0);

    // Form State
    const [isSignUp, setIsSignUp] = useState(false); // Toggle state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isVisible) {
            // Optional: Delay reset or keep state? Usually better to keep for UX unless specific request.
            // But switching modes usually clears inputs or keeps relevant ones.
        }
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            opacity.value = withTiming(1, { duration: 300 });
            // User requested NO bouncy animation. Using Standard Easing.
            translateY.value = withTiming(0, {
                duration: 400,
                easing: Easing.out(Easing.cubic)
            });
        } else {
            opacity.value = withTiming(0, { duration: 300 });
            translateY.value = withTiming(SCREEN_HEIGHT, {
                duration: 350,
                easing: Easing.in(Easing.cubic)
            });
        }
    }, [isVisible]);

    // Early return removed to fix Hook rule violation

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const contentStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const handleSubmit = () => {
        if (isSignUp) {
            Alert.alert("Success", "Account Created Successfully (Mock)");
        } else {
            Alert.alert("Success", "Signed In Successfully (Mock)");
        }
        onClose();
    };

    return (
        <View className="absolute inset-0 z-50 flex-1 justify-end" pointerEvents={isVisible ? 'auto' : 'none'}>
            {/* Backdrop */}
            <Animated.View className="absolute inset-0 bg-black/60" style={backdropStyle}>
                <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
            </Animated.View>

            {/* Modal Card */}
            <Animated.View
                className="w-full h-[100%] bg-[#E0B0FF] overflow-hidden shadow-2xl"
                style={[contentStyle, { backgroundColor: '#E0B0FF' }]}
            >
                {/* Visual container to match reference: White Card with Black Shadow/Offset */}
                <View className="flex-1 items-center justify-center px-4 pb-10">

                    {/* The Card Itself */}
                    <View className="w-full max-w-sm bg-white border-[3px] border-black rounded-[40px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">

                        {/* Header: Back & Title */}
                        <View className="flex-row items-center justify-between mb-8 relative">
                            <TouchableOpacity onPress={onClose} className="flex-row items-center absolute left-0 z-10">
                                <ArrowLeft color="black" size={20} strokeWidth={3} />
                                <Text className="text-black ml-1 text-sm tracking-tighter" style={{ fontFamily: FONT_BOLD }}>Back</Text>
                            </TouchableOpacity>

                            <Text className="text-black text-4xl text-center w-full tracking-tighter" style={{ fontFamily: FONT_MAIN }}>
                                {isSignUp ? 'Sign Up' : 'Sign In'}
                            </Text>
                        </View>

                        {/* Social Buttons - 3D Tactile Feel */}
                        <View className="gap-4 mb-6">
                            {/* Google */}
                            <SmoothButton
                                buttonStyle="flex-row items-center justify-center py-3.5 border-[2.5px] border-black rounded-full bg-white"
                                shadowStyle="bg-black rounded-full"
                                depth={4}
                            >
                                <Text className="text-sm tracking-tight" style={{ fontFamily: FONT_BOLD }}>Continue with Google</Text>
                            </SmoothButton>

                            {/* GitHub */}
                            <SmoothButton
                                buttonStyle="flex-row items-center justify-center py-3.5 border-[2.5px] border-black rounded-full bg-white"
                                shadowStyle="bg-black rounded-full"
                                depth={4}
                            >
                                <Text className="text-sm tracking-tight" style={{ fontFamily: FONT_BOLD }}>Continue with GitHub</Text>
                            </SmoothButton>
                        </View>

                        {/* Divider */}
                        <View className="flex-row items-center gap-4 mb-6">
                            <View className="h-[2px] bg-black flex-1 rounded-full" />
                            <Text className="text-sm" style={{ fontFamily: 'Gilton' }}>OR</Text>
                            <View className="h-[2px] bg-black flex-1 rounded-full" />
                        </View>

                        {/* Form Inputs */}
                        <View className="gap-4 mb-8">
                            {/* Name Input - Only for Sign Up */}
                            {isSignUp && (
                                <View>
                                    <Text className="text-[10px] mb-2 uppercase tracking-widest pl-1" style={{ fontFamily: FONT_BOLD }}>Name</Text>
                                    <TextInput
                                        className="w-full border-[2.5px] border-black rounded-2xl px-4 py-3.5 text-black text-sm font-medium bg-white"
                                        placeholder="Enter your name"
                                        placeholderTextColor="#999"
                                        value={name}
                                        onChangeText={setName}
                                        style={{
                                            fontFamily: FONT_MAIN,
                                            shadowColor: "#000",
                                            shadowOffset: { width: 4, height: 4 },
                                            shadowOpacity: 0.2,
                                            shadowRadius: 0,
                                            elevation: 4
                                        }}
                                    />
                                </View>
                            )}

                            <View>
                                <Text className="text-[10px] mb-2 uppercase tracking-widest pl-1" style={{ fontFamily: FONT_BOLD }}>Email</Text>
                                <TextInput
                                    className="w-full border-[2.5px] border-black rounded-2xl px-4 py-3.5 text-black text-sm font-medium bg-white"
                                    placeholder="Enter your email"
                                    placeholderTextColor="#999"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={{
                                        fontFamily: FONT_MAIN,
                                        shadowColor: "#000",
                                        shadowOffset: { width: 4, height: 4 }, // "add the shadow"
                                        shadowOpacity: 0.2, // Subtle shadow for inputs
                                        shadowRadius: 0,
                                        elevation: 4
                                    }}
                                />
                            </View>
                            <View>
                                <Text className="text-[10px] mb-2 uppercase tracking-widest pl-1" style={{ fontFamily: FONT_BOLD }}>Password</Text>
                                <TextInput
                                    className="w-full border-[2.5px] border-black rounded-2xl px-4 py-3.5 text-black text-sm font-medium bg-white"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    style={{
                                        fontFamily: FONT_MAIN,
                                        shadowColor: "#000",
                                        shadowOffset: { width: 4, height: 4 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 0,
                                        elevation: 4
                                    }}
                                />
                            </View>
                        </View>

                        {/* Action Button */}
                        <View className="mb-6">
                            <SmoothButton
                                onPress={handleSubmit}
                                buttonStyle="w-full bg-black rounded-full py-4 items-center justify-center border-[2.5px] border-black"
                                shadowStyle="bg-black rounded-full"
                                depth={4}
                            >
                                <Text className="text-white text-lg tracking-wider" style={{ fontFamily: 'Gilton' }}>
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                </Text>
                            </SmoothButton>
                        </View>

                        {/* Footer Link - Toggle */}
                        <TouchableOpacity
                            className="flex-row justify-center items-center"
                            onPress={() => setIsSignUp(!isSignUp)}
                        >
                            <Text className="text-black text-xs mr-1" style={{ fontFamily: 'Gilton' }}>
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            </Text>
                            <Text className="text-black text-xs underline" style={{ fontFamily: 'Gilton' }}>
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

export default SignInModal;
