import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSpring,
    Easing,
    interpolate
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import SmoothButton from './ui/SmoothButton';

const { width } = Dimensions.get('window');

// ============================================
// 🎨 FONT CONFIGURATION
// ============================================
const FONT_CONFIG = {
    title: 'Gilton',
    buttons: 'Softura',
    footer: 'Gilton',
};

interface MusicPromptModalProps {
    onSelectMusic: (withMusic: boolean) => void;
}

export default function MusicPromptModal({ onSelectMusic }: MusicPromptModalProps) {
    // Shared Values
    const backdropOpacity = useSharedValue(0); // Controls Blur + Red Overlay
    const cardScale = useSharedValue(0.9);
    const cardOpacity = useSharedValue(0);
    const contentOpacity = useSharedValue(0);
    const contentTranslateY = useSharedValue(20);

    useEffect(() => {
        // SEQUENCE:
        // 1. Background (Blur + Blood) fades in FIRST (0ms -> 500ms)
        // 2. Card Springs in AFTER background is set (500ms+)

        // 1. Background Entrance
        backdropOpacity.value = withTiming(1, {
            duration: 600,
            easing: Easing.out(Easing.cubic)
        });

        // 2. Card Entrance (Spring) - Starts after background is mostly visible
        cardScale.value = withDelay(500, withSpring(1, {
            damping: 12,
            stiffness: 90,
            mass: 1
        }));

        cardOpacity.value = withDelay(500, withTiming(1, {
            duration: 400
        }));

        // 3. Content Slide Up (Title, Buttons)
        contentOpacity.value = withDelay(700, withTiming(1, {
            duration: 600
        }));

        contentTranslateY.value = withDelay(700, withSpring(0, {
            damping: 14,
            stiffness: 100
        }));

    }, []);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [{ scale: cardScale.value }]
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{ translateY: contentTranslateY.value }]
    }));

    return (
        <View style={styles.overlay}>
            {/* Backdrop: Blur + Blood Red Overlay */}
            <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
                {/* Subtle dark gradient overlay for depth */}
                <View style={styles.gradientOverlay} />
            </Animated.View>

            <Animated.View style={[styles.card, cardStyle]}>
                {/* Title */}
                <Animated.View style={contentStyle}>
                    <Text style={styles.title}>Welcome to Signifiya</Text>
                </Animated.View>

                {/* Button 1: Enter With Music */}
                <Animated.View style={[styles.buttonContainer, contentStyle]}>
                    <SmoothButton
                        onPress={() => {
                            setTimeout(() => onSelectMusic(true), 50);
                        }}
                        // Fixed Colors: No purple shift on press
                        buttonStyle="bg-black rounded-full"
                        shadowStyle="bg-[#2a0a0a] rounded-full" // Dark bloody shadow
                        depth={10} // Increased depth for more "Kick"
                        innerButtonStyle={styles.primaryButtonInner}
                    >
                        <Text style={styles.buttonTextWhite}>ENTER WITH MUSIC</Text>
                    </SmoothButton>
                </Animated.View>

                {/* Button 2: Enter Without Music */}
                <Animated.View style={[styles.buttonContainer, contentStyle]}>
                    <SmoothButton
                        onPress={() => onSelectMusic(false)}
                        buttonStyle="bg-white rounded-full"
                        shadowStyle="bg-black rounded-full"
                        depth={10} // Increased depth for more "Kick"
                        innerButtonStyle={styles.secondaryButtonInner}
                    >
                        <Text style={styles.buttonTextBlack}>ENTER WITHOUT MUSIC</Text>
                    </SmoothButton>
                </Animated.View>

                {/* Footer Text */}
                <Animated.View style={contentStyle}>
                    <Text style={styles.sarcasticText}>dabake, dekhlee lala!</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Subtle dark tint for depth
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 36,
        width: width * 0.85,
        maxWidth: 380,
        alignItems: 'center',
        // Premium shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: 30,
    },
    title: {
        fontSize: 26,
        color: '#000000',
        marginBottom: 35,
        textAlign: 'center',
        fontFamily: FONT_CONFIG.title,
        letterSpacing: 0.3,
        lineHeight: 36,
    },
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginBottom: 20, // Increased spacing for 3D depth room
    },
    primaryButtonInner: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 9999,
    },
    secondaryButtonInner: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: '#000000',
    },
    buttonTextWhite: {
        color: '#FFFFFF',
        fontSize: 12,
        letterSpacing: 2.5,
        fontFamily: FONT_CONFIG.buttons,
        textAlign: 'center',
    },
    buttonTextBlack: {
        color: '#000000',
        fontSize: 12,
        letterSpacing: 1,
        fontFamily: FONT_CONFIG.buttons,
        textAlign: 'center',
    },
    sarcasticText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginTop: 12,
        fontFamily: 'RampartOne',
    },
});
