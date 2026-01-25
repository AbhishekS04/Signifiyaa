import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    withRepeat,
    withSequence,
    runOnJS,
    Easing,
    WithTimingConfig
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const { height } = Dimensions.get('window');

// 🎬 Text Content
const BRAND_TEXT = "SIGNIFIYA'26";
const CHARS = BRAND_TEXT.split('');

// ⏱️ Timing Configuration
const LETTER_DURATION = 800;      // How long one letter takes to fully fade/slide in
const STAGGER_DELAY = 300;        // Delay between each letter (Controls the "typing" speed)
// Total Text Time = (CHARS.length * STAGGER_DELAY) + LETTER_DURATION approx
// 12 chars * 300 = 3600ms + 800ms = 4400ms

const HOLD_DURATION = 1500;       // How long to stare at the full text
const TOTAL_SEQ_TIME = (CHARS.length * STAGGER_DELAY) + HOLD_DURATION;

const SHUTTER_DURATION = 1200;

interface PreloaderScreenProps {
    onFinish: () => void;
}

export default function PreloaderScreen({ onFinish }: PreloaderScreenProps) {
    const shutterProgress = useSharedValue(0);

    // Array of shared values for each character
    // We create an array of hooks? No, hooks rules.
    // We can use a single progress value and interpolate, OR an array of values initialized once.
    // Better: Render AnimatedChar components to keep cleaner state.

    useEffect(() => {
        // Start the shutter exit AFTER the text sequence
        shutterProgress.value = withDelay(TOTAL_SEQ_TIME, withTiming(1, {
            duration: SHUTTER_DURATION,
            easing: Easing.bezier(0.65, 0, 0.35, 1)
        }, (finished) => {
            if (finished) {
                runOnJS(onFinish)();
            }
        }));
    }, []);

    const shutterStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: -shutterProgress.value * height }]
    }));

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <StatusBar style="light" />

            {/* Shutter Panel */}
            <Animated.View style={[styles.shutter, shutterStyle]}>
                <View style={styles.textContainer}>
                    <View style={styles.row}>
                        {CHARS.map((char, index) => (
                            <AnimatedChar key={`${char}-${index}`} char={char} index={index} />
                        ))}
                    </View>
                </View>
            </Animated.View >
        </View >
    );
}

// 🔤 Individual Character Component
function AnimatedChar({ char, index }: { char: string, index: number }) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(40);
    const scale = useSharedValue(0.5);
    const rotate = useSharedValue('0deg'); // 🔄 Rotation for shake

    useEffect(() => {
        const delay = index * STAGGER_DELAY;

        const springConfig = {
            damping: 18,
            stiffness: 70,
            mass: 1
        };

        // 1. Entrance
        opacity.value = withDelay(delay, withTiming(1, { duration: 1000 }));
        translateY.value = withDelay(delay, withSpring(0, springConfig));
        scale.value = withDelay(delay, withSpring(1, springConfig));

        // 2. 🫨 SHAKE / THRILL ANIMATION
        // Starts slightly after appearance to separate "arrival" from "shaking"
        // Random start direction for organic feel
        const startAngle = index % 2 === 0 ? '2deg' : '-2deg';

        rotate.value = withDelay(delay + 200, withRepeat(
            withSequence(
                withTiming(startAngle, { duration: 80 }),
                withTiming(index % 2 === 0 ? '-2deg' : '2deg', { duration: 80 }),
                withTiming('0deg', { duration: 80 }),
                withDelay(50, withTiming('0deg', { duration: 0 })) // Brief pause between shivers? No, continuous is more "thrill"
            ),
            -1, // Infinite repeat
            true // Reverse: true
        ));

    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateY: translateY.value },
            { scale: scale.value },
            { rotate: rotate.value } // Apply shake
        ]
    }));

    return (
        <Animated.Text style={[styles.text, style]}>
            {char}
        </Animated.Text>
    );
}

const styles = StyleSheet.create({
    shutter: {
        position: 'absolute',
        top: 0,
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
        paddingHorizontal: 20, // Ensure no edge touching
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap', // Force single line
    },
    text: {
        fontSize: 20, // Reduced from 48 to fit spacing
        fontFamily: 'BBHBartle',
        letterSpacing: 6, // Increased spacing
        textAlign: 'center',
        color: '#FFFFFF',
        // 🌟 PREMIUM GLOW EFFECT
        textShadowColor: 'rgba(255, 255, 255, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
    }
});
