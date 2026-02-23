import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withRepeat,
    interpolate,
    cancelAnimation,
    runOnJS,
    Easing,
    Extrapolation,
    type SharedValue,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const { height } = Dimensions.get('window');

/* ── constants ─────────────────────────────────────────────── */
const BRAND_TEXT = "SIGNIFIYA'26";
const CHARS = BRAND_TEXT.split('');
const CHAR_COUNT = CHARS.length; // 12

const LETTER_DURATION = 800;
const STAGGER_DELAY = 300;
const HOLD_DURATION = 1500;
const SHUTTER_DURATION = 1200;

/** Total time for all characters to finish their entrance animation */
const TOTAL_ENTRANCE_MS = (CHAR_COUNT - 1) * STAGGER_DELAY + LETTER_DURATION; // 4100
/** Delay before shutter begins sliding up */
const TOTAL_SEQ_TIME = CHAR_COUNT * STAGGER_DELAY + HOLD_DURATION;

const SHAKE_HALF_CYCLE_MS = 300;
const SHAKE_AMPLITUDE_DEG = 2;

/* ── types ─────────────────────────────────────────────────── */
interface PreloaderScreenProps {
    onFinish: () => void;
}

interface AnimatedCharProps {
    char: string;
    index: number;
    entrance: SharedValue<number>;
    shake: SharedValue<number>;
}

/* ── main component ────────────────────────────────────────── */
export default function PreloaderScreen({ onFinish }: PreloaderScreenProps) {
    const entrance = useSharedValue(0);        // 0→1 over entrance duration
    const shake = useSharedValue(0);           // 0→1 repeating oscillation
    const shutterProgress = useSharedValue(0); // 0→1 shutter slide-up

    useEffect(() => {
        // 1. Drive all character entrances via a single linear ramp
        entrance.value = withTiming(1, {
            duration: TOTAL_ENTRANCE_MS,
            easing: Easing.linear,
        });

        // 2. Shared shake oscillation — reversed loop (0→1→0→1…)
        shake.value = withRepeat(
            withTiming(1, { duration: SHAKE_HALF_CYCLE_MS, easing: Easing.linear }),
            -1,
            true,
        );

        // 3. Shutter exit after text sequence + hold
        shutterProgress.value = withDelay(
            TOTAL_SEQ_TIME,
            withTiming(1, {
                duration: SHUTTER_DURATION,
                easing: Easing.bezier(0.65, 0, 0.35, 1),
            }, (finished) => {
                if (finished) {
                    runOnJS(onFinish)();
                }
            }),
        );

        return () => {
            cancelAnimation(entrance);
            cancelAnimation(shake);
            cancelAnimation(shutterProgress);
        };
    }, []);

    const shutterStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: -shutterProgress.value * height }],
    }));

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="auto">
            <StatusBar style="light" />

            <Animated.View style={[styles.shutter, shutterStyle]}>
                <View style={styles.textContainer}>
                    <View style={styles.row}>
                        {CHARS.map((char, index) => (
                            <AnimatedChar
                                key={`${char}-${index}`}
                                char={char}
                                index={index}
                                entrance={entrance}
                                shake={shake}
                            />
                        ))}
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

/* ── per-character component (memoized, zero own shared values) ── */
const AnimatedChar = React.memo(function AnimatedChar({
    char,
    index,
    entrance,
    shake,
}: AnimatedCharProps) {
    // Normalised window for this character within the entrance ramp
    const charStart = (index * STAGGER_DELAY) / TOTAL_ENTRANCE_MS;
    const charEnd = Math.min((index * STAGGER_DELAY + LETTER_DURATION) / TOTAL_ENTRANCE_MS, 1);

    // Alternating shake direction per character for organic feel
    const shakeDir = index % 2 === 0 ? 1 : -1;

    const style = useAnimatedStyle(() => {
        const t = entrance.value;

        const opacity = interpolate(t, [charStart, charEnd], [0, 1], Extrapolation.CLAMP);
        const translateY = interpolate(t, [charStart, charEnd], [40, 0], Extrapolation.CLAMP);
        const scale = interpolate(t, [charStart, charEnd], [0.5, 1], Extrapolation.CLAMP);

        // Sine-like shake: only active once character is mostly visible
        const shakeFactor = opacity > 0.8 ? 1 : 0;
        const rotation =
            shakeFactor *
            SHAKE_AMPLITUDE_DEG *
            shakeDir *
            interpolate(shake.value, [0, 0.25, 0.5, 0.75, 1], [0, 1, 0, -1, 0], Extrapolation.CLAMP);

        return {
            opacity,
            transform: [
                { translateY },
                { scale },
                { rotate: `${rotation}deg` },
            ],
        };
    });

    return <Animated.Text style={[styles.text, style]}>{char}</Animated.Text>;
});

/* ── styles ────────────────────────────────────────────────── */
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
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    text: {
        fontSize: 20,
        fontFamily: 'BBHBartle',
        letterSpacing: 6,
        textAlign: 'center',
        color: '#FFFFFF',
        textShadowColor: 'rgba(255, 255, 255, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
    },
});
