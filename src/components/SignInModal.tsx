import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Platform, StyleSheet, Alert, BackHandler } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    FadeIn,
    FadeOut,
    Easing,
    Layout,
    LinearTransition
} from 'react-native-reanimated';
import { ArrowLeft, Github, Eye, EyeOff } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import SmoothButton from './ui/SmoothButton';
import { useAuth } from '../context/AuthContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Font Configuration
const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton';

// Google Logo SVG Component
const GoogleLogo = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24">
        <Path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <Path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <Path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
            fill="#FBBC05"
        />
        <Path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </Svg>
);

interface SignInModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const SignInModal = ({ isVisible, onClose }: SignInModalProps) => {
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const opacity = useSharedValue(0);

    // Form State
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isVisible) {
            // Optional reset logic
        }
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            opacity.value = withTiming(1, { duration: 300 });
            translateY.value = withTiming(0, {
                duration: 350,
                easing: Easing.out(Easing.quad) // Sharp, clear deceleration
            });
        } else {
            opacity.value = withTiming(0, { duration: 250 });
            translateY.value = withTiming(SCREEN_HEIGHT, {
                duration: 300,
                easing: Easing.in(Easing.quad)
            });
        }
    }, [isVisible]);

    // Handle Android Hardware Back Button
    useEffect(() => {
        const onBackPress = () => {
            if (isVisible) {
                onClose();
                return true; // Prevent default behavior (exiting app/screen)
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, [isVisible, onClose]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const contentStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const { login } = useAuth();
    const handleSubmit = () => {
        if (isSignUp) {
            Alert.alert("Success", "Account Created Successfully (Mock)");
        } else {
            Alert.alert("Success", "Signed In Successfully (Mock)");
        }
        login();
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
                <View className="flex-1 items-center justify-center px-4 pb-10">

                    {/* The Card Itself - Now Animated for Height changes */}
                    <Animated.View
                        className="w-full max-w-sm bg-white border-[3px] border-black rounded-[40px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                        layout={LinearTransition.duration(300).easing(Easing.out(Easing.quad))}
                    >

                        {/* Header: Back & Title */}
                        <View className="flex-row items-center justify-between mb-8 relative">
                            <TouchableOpacity onPress={onClose} className="flex-row items-center absolute left-0 z-10">
                                <ArrowLeft color="black" size={20} strokeWidth={3} />
                                <Text className="text-black ml-1 text-sm tracking-tighter" style={{ fontFamily: FONT_BOLD }}>Back</Text>
                            </TouchableOpacity>

                            {/* Animated Title Text - Simple Fade or Keying */}
                            <Animated.Text
                                key={isSignUp ? 'signup' : 'signin'}
                                entering={FadeIn.duration(200)}
                                exiting={FadeOut.duration(200)}
                                className="text-black text-4xl text-center w-full tracking-tighter"
                                style={{ fontFamily: FONT_MAIN }}
                            >
                                {isSignUp ? 'Sign Up' : 'Sign In'}
                            </Animated.Text>
                        </View>

                        {/* Social Buttons - Centered and Proper Icons */}
                        <View className="gap-4 mb-6">
                            {/* Google */}
                            <SmoothButton
                                buttonStyle="flex-row items-center justify-center py-3.5 border-[2.5px] border-black rounded-full bg-white px-4"
                                shadowStyle="bg-black rounded-full"
                                depth={4}
                            >
                                <View className="flex-row items-center justify-center gap-3">
                                    <GoogleLogo />
                                    <Text className="text-sm tracking-tight pt-0.5" style={{ fontFamily: FONT_BOLD }}>Continue with Google</Text>
                                </View>
                            </SmoothButton>

                            {/* GitHub */}
                            <SmoothButton
                                buttonStyle="flex-row items-center justify-center py-3.5 border-[2.5px] border-black rounded-full bg-white px-4"
                                shadowStyle="bg-black rounded-full"
                                depth={4}
                            >
                                <View className="flex-row items-center justify-center gap-3">
                                    <Github color="black" size={20} fill="black" />
                                    <Text className="text-sm tracking-tight pt-0.5" style={{ fontFamily: FONT_BOLD }}>Continue with GitHub</Text>
                                </View>
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
                            {isSignUp && (
                                <Animated.View key="name-field" entering={FadeIn.duration(300).easing(Easing.out(Easing.quad))} exiting={FadeOut.duration(200)}>
                                    <Text className="text-[10px] mb-2 uppercase tracking-widest pl-1" style={{ fontFamily: FONT_BOLD }}>Name</Text>
                                    <TextInput
                                        className="w-full border-[2.5px] border-black rounded-2xl px-4 py-3.5 text-black text-sm font-medium bg-white"
                                        placeholder="Enter your name"
                                        placeholderTextColor="#999"
                                        value={name}
                                        onChangeText={setName}
                                        style={styles.inputStyle}
                                    />
                                </Animated.View>
                            )}

                            <View>
                                <Text className="text-[10px] mb-2 uppercase tracking-widest pl-1" style={{ fontFamily: FONT_BOLD }}>Email</Text>
                                <TextInput
                                    className="w-full border-[2.5px] border-black rounded-2xl px-4 py-3.5 text-black text-sm font-medium bg-white"
                                    placeholder="Enter your email"
                                    placeholderTextColor="#999"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.inputStyle}
                                />
                            </View>

                            <View>
                                <Text className="text-[10px] mb-2 uppercase tracking-widest pl-1" style={{ fontFamily: FONT_BOLD }}>Password</Text>
                                <View className="relative">
                                    <TextInput
                                        className="w-full border-[2.5px] border-black rounded-2xl px-4 py-3.5 text-black text-sm font-medium bg-white pr-12"
                                        placeholder="Enter your password"
                                        placeholderTextColor="#999"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                        style={styles.inputStyle}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-[14px]"
                                    >
                                        {showPassword ? (
                                            <EyeOff color="black" size={20} />
                                        ) : (
                                            <Eye color="black" size={20} />
                                        )}
                                    </TouchableOpacity>
                                </View>
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
                                <Animated.Text
                                    key={isSignUp ? 'btn-create' : 'btn-signin'}
                                    entering={FadeIn.duration(200)}
                                    exiting={FadeOut.duration(200)}
                                    className="text-white text-lg tracking-wider"
                                    style={{ fontFamily: 'Gilton' }}
                                >
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                </Animated.Text>
                            </SmoothButton>
                        </View>

                        {/* Footer Link - Toggle */}
                        <TouchableOpacity
                            className="flex-row justify-center items-center"
                            onPress={() => {
                                // Trigger layout animation automatically via Layout prop
                                setIsSignUp(!isSignUp);
                            }}
                        >
                            <Animated.Text
                                key={isSignUp ? 'footer-prompt-up' : 'footer-prompt-in'}
                                entering={FadeIn.duration(200)}
                                className="text-black text-xs mr-1"
                                style={{ fontFamily: 'Gilton' }}
                            >
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            </Animated.Text>
                            <Animated.Text
                                key={isSignUp ? 'footer-link-up' : 'footer-link-in'}
                                entering={FadeIn.duration(200)}
                                className="text-black text-xs underline"
                                style={{ fontFamily: 'Gilton' }}
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </Animated.Text>
                        </TouchableOpacity>

                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    );
};

// Extracted styles for cleaner JSX
const styles = StyleSheet.create({
    inputStyle: {
        fontFamily: FONT_MAIN,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 0,
        elevation: 4
    }
});

export default SignInModal;
