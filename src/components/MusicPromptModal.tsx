import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import SmoothButton from './ui/SmoothButton';

const { width } = Dimensions.get('window');

// ============================================
// 🎨 FONT CONFIGURATION
// Change fonts here - easy to customize!
// ============================================
const FONT_CONFIG = {
    title: 'Gilton',          // Current: Gilton | Try: 'Bicubik', 'RampartOne', 'BBHBartle', 'Softura'
    buttons: 'Gilton',         // Current: Gilton | Try: 'Bicubik', 'RampartOne', 'BBHBartle', 'Softura'
    footer: 'Gilton',        // Current: Gilton | Try: 'Bicubik', 'RampartOne', 'BBHBartle', 'Softura'
};

interface MusicPromptModalProps {
    onSelectMusic: (withMusic: boolean) => void;
}

export default function MusicPromptModal({ onSelectMusic }: MusicPromptModalProps) {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.92);
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(20);
    const button1Opacity = useSharedValue(0);
    const button1TranslateY = useSharedValue(30);
    const button2Opacity = useSharedValue(0);
    const button2TranslateY = useSharedValue(30);
    const footerOpacity = useSharedValue(0);
    const [isMusicSelected, setIsMusicSelected] = useState(false);

    useEffect(() => {
        // Backdrop fade-in
        opacity.value = withTiming(1, {
            duration: 800,
            easing: Easing.out(Easing.cubic)
        });

        // Card pop-in - "Premium Snap"
        // Using a focused bezier curve that starts fast and lands soft
        const PREMIUM_EASE = Easing.bezier(0.33, 1, 0.68, 1);

        scale.value = withDelay(150, withTiming(1, {
            duration: 800,
            easing: PREMIUM_EASE
        }));

        // Title slide up
        titleOpacity.value = withDelay(300, withTiming(1, {
            duration: 700,
            easing: Easing.out(Easing.quad)
        }));

        titleTranslateY.value = withDelay(300, withTiming(0, {
            duration: 700,
            easing: PREMIUM_EASE
        }));

        // Button 1: Enter With Music
        button1Opacity.value = withDelay(400, withTiming(1, {
            duration: 600,
            easing: Easing.out(Easing.quad)
        }));

        button1TranslateY.value = withDelay(400, withTiming(0, {
            duration: 600,
            easing: PREMIUM_EASE
        }));

        // Button 2: Enter Without Music
        button2Opacity.value = withDelay(500, withTiming(1, {
            duration: 600,
            easing: Easing.out(Easing.quad)
        }));

        button2TranslateY.value = withDelay(500, withTiming(0, {
            duration: 600,
            easing: PREMIUM_EASE
        }));

        // Footer fade in (Late arrival)
        footerOpacity.value = withDelay(800, withTiming(1, {
            duration: 800,
            easing: Easing.inOut(Easing.cubic)
        }));
    }, []);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const titleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleTranslateY.value }]
    }));

    const button1Style = useAnimatedStyle(() => ({
        opacity: button1Opacity.value,
        transform: [{ translateY: button1TranslateY.value }]
    }));

    const button2Style = useAnimatedStyle(() => ({
        opacity: button2Opacity.value,
        transform: [{ translateY: button2TranslateY.value }]
    }));

    const footerStyle = useAnimatedStyle(() => ({
        opacity: footerOpacity.value,
    }));

    return (
        <View style={styles.overlay}>
            {/* Backdrop with blur */}
            <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
                <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
                {/* Subtle dark gradient overlay for depth */}
                <View style={styles.gradientOverlay} />
            </Animated.View>

            <Animated.View style={[styles.card, cardStyle]}>
                {/* Title with animation */}
                <Animated.View style={titleStyle}>
                    <Text style={{ fontSize: 26, color: '#000000', marginBottom: 35, textAlign: 'center', fontFamily: 'Gilton', letterSpacing: 0.3, lineHeight: 36 }}>Welcome to Signifiya</Text>
                </Animated.View>

                {/* Button 1: Enter With Music - Pure Black */}
                <Animated.View style={[styles.buttonContainer, button1Style]}>
                    <SmoothButton
                        onPressIn={() => setIsMusicSelected(true)}
                        onPress={() => {
                            // setIsMusicSelected(true); // Already set on press in
                            setTimeout(() => onSelectMusic(true), 50); // Faster response
                        }}
                        buttonStyle={isMusicSelected ? "bg-[#6A1B9A] rounded-full" : "bg-black rounded-full"}
                        shadowStyle={isMusicSelected ? "bg-[#4A148C] rounded-full" : "bg-black rounded-full"}
                        depth={5}
                        innerButtonStyle={styles.primaryButtonInner}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 12, letterSpacing: 2.5, fontFamily: 'Gilton', textAlign: 'center' }}>ENTER WITH MUSIC</Text>
                    </SmoothButton>
                </Animated.View>

                {/* Button 2: Enter Without Music - White with Black Border */}
                <Animated.View style={[styles.buttonContainer, button2Style]}>
                    <SmoothButton
                        onPress={() => onSelectMusic(false)}
                        buttonStyle="bg-white rounded-full"
                        shadowStyle="bg-black rounded-full"
                        depth={5}
                        innerButtonStyle={styles.secondaryButtonInner}
                    >
                        <Text style={{ color: '#000000', fontSize: 12, letterSpacing: 1, fontFamily: 'Gilton', textAlign: 'center' }}>ENTER WITHOUT MUSIC</Text>
                    </SmoothButton>
                </Animated.View>

                {/* Footer Text with animation */}
                <Animated.View style={footerStyle}>
                    <Text style={{ fontSize: 14, color: '#666666', textAlign: 'center', marginTop: 8, fontFamily: 'RampartOne' }}>dabake, dekhlee lala!</Text>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 36,
        width: width * 0.85,
        maxWidth: 380,
        alignItems: 'center',
        // Premium shadow for strong depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.5,
        shadowRadius: 32,
        elevation: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 32,
        textAlign: 'center',
        fontFamily: FONT_CONFIG.title,
        letterSpacing: 0.3,
        lineHeight: 36,
    },
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginBottom: 16,
    },
    primaryButtonInner: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 9999,
    },
    secondaryButtonInner: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 9999,
        borderWidth: 3,
        borderColor: '#000000',
    },
    buttonTextWhite: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2.5,
        fontFamily: FONT_CONFIG.buttons,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    buttonTextBlack: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2.5,
        fontFamily: FONT_CONFIG.buttons,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    sarcasticText: {
        fontSize: 14,
        color: '#666666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 8,
        fontFamily: FONT_CONFIG.footer,
    },
});
