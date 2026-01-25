import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    interpolateColor,
    runOnJS,
    Easing
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

// 🎬 Timing Configuration
const TEXT_REVEAL_DURATION = 3000;  // Black to white fade
const TEXT_HOLD_DURATION = 500;     // Brief hold
const SHUTTER_DURATION = 1500;      // Slide down

interface PreloaderScreenProps {
    onFinish: () => void;
}

export default function PreloaderScreen({ onFinish }: PreloaderScreenProps) {
    const textProgress = useSharedValue(0);     // 0 -> 1 (color fade)
    const shutterProgress = useSharedValue(0);  // 0 -> 1 (slide down)

    useEffect(() => {
        // Step 1: Text Reveal (Black -> White)
        textProgress.value = withTiming(1, {
            duration: TEXT_REVEAL_DURATION,
            easing: Easing.inOut(Easing.ease)
        }, (finished) => {
            if (finished) {
                // Step 2: Slide Shutter Down
                shutterProgress.value = withDelay(TEXT_HOLD_DURATION, withTiming(1, {
                    duration: SHUTTER_DURATION,
                    easing: Easing.bezier(0.65, 0, 0.35, 1)
                }, (finishedShutter) => {
                    if (finishedShutter) {
                        runOnJS(onFinish)();
                    }
                }));
            }
        });
    }, []);

    // Text Color Fade (Black -> White)
    const textStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            textProgress.value,
            [0, 1],
            ['#000000', '#FFFFFF']
        );
        return { color };
    });

    // Shutter slides UP (revealing from bottom to top)
    const shutterStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: -shutterProgress.value * height }]
    }));

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <StatusBar style="light" />

            {/* Single Shutter Panel (starts visible, slides up) */}
            <Animated.View style={[styles.shutter, shutterStyle]}>
                {/* Centered Text */}
                <View style={styles.textContainer}>
                    <Animated.Text style={[styles.text, textStyle]}>
                        SIGNIFIYA'26
                    </Animated.Text>
                </View>
            </Animated.View >
        </View >
    );
}

const styles = StyleSheet.create({
    shutter: {
        position: 'absolute',
        top: 0, // Start visible (covering the screen)
        left: 0,
        right: 0,
        height: height,
        backgroundColor: '#000000',
        zIndex: 9999,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 48,
        fontFamily: 'Gilton',
        letterSpacing: 3,
        textAlign: 'center',
    }
});
