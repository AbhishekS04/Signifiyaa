import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Font Constants (Assuming global availability or fallback)
const FONT_BOLD = 'Gilton';
const FONT_MAIN = 'Gilton';

interface WelcomeToastProps {
    onComplete: () => void;
    // We can pass user name here locally if needed
}

export default function WelcomeToast({ onComplete }: WelcomeToastProps) {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.95);
    const translateY = useSharedValue(20);

    useEffect(() => {
        // Smooth entrance (Standard Easing, no bounce)
        opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
        scale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
        translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });

        // Exit after 2 seconds
        const timer = setTimeout(() => {
            opacity.value = withTiming(0, { duration: 300 });
            scale.value = withTiming(0.95, { duration: 300 });
            const endTimer = setTimeout(() => {
                runOnJS(onComplete)();
            }, 300);
            return () => clearTimeout(endTimer);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { scale: scale.value },
            { translateY: translateY.value }
        ]
    }));

    return (
        <View style={styles.overlay} pointerEvents="none">
            <Animated.View style={[styles.card, animatedStyle]}>
                {/* Visual Icon */}
                <View className="bg-green-500 w-14 h-14 rounded-full items-center justify-center mb-5 border-[2.5px] border-black shadow-sm">
                    <Text className="text-black text-2xl" style={{ fontWeight: 'bold' }}>✓</Text>
                </View>

                <Text style={styles.title}>SUCCESS</Text>
                <Text style={styles.message}>WELCOME BACK BUDDY</Text>

                <View className="h-[2px] bg-black/5 w-full my-5 rounded-full" />

                <Text style={styles.subtitle}>Let's get back to it.</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999, // Super high z-index
        backgroundColor: 'rgba(0,0,0,0.3)', // Dim background
    },
    card: {
        backgroundColor: 'white',
        width: width * 0.85,
        maxWidth: 360,
        paddingVertical: 40,
        paddingHorizontal: 30,
        borderRadius: 40,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'black',
        // Hard Shadow for Neo-Brutalism
        shadowColor: "#000",
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
    title: {
        fontSize: 14,
        fontFamily: FONT_BOLD,
        color: '#666',
        letterSpacing: 3,
        marginBottom: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    message: {
        fontSize: 26,
        fontFamily: FONT_BOLD,
        color: 'black',
        textAlign: 'center',
        letterSpacing: -0.5,
        textTransform: 'uppercase',
        lineHeight: 32
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        fontFamily: FONT_MAIN,
        fontStyle: 'italic'
    }
});
