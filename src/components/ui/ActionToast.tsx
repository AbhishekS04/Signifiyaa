import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS
} from 'react-native-reanimated';
import { Copy, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Font Constants
const FONT_BOLD = 'Gilton';
const FONT_MAIN = 'Gilton';

interface ActionToastProps {
    message: string;
    subMessage?: string;
    onComplete: () => void;
    icon?: React.ReactNode;
}

export default function ActionToast({ message, subMessage, onComplete, icon }: ActionToastProps) {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.95);
    const translateY = useSharedValue(20);

    useEffect(() => {
        // Smooth entrance
        opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
        scale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
        translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });

        // Exit delay
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
                {/* Icon Container */}
                <View className="bg-black w-14 h-14 rounded-full items-center justify-center mb-5 border-[2.5px] border-black shadow-sm relative">
                    <View className="absolute inset-0 rounded-full border-[1px] border-white/20" />
                    {icon || <Check color="white" size={24} strokeWidth={3} />}
                </View>

                <Text style={styles.title}>SUCCESS</Text>
                <Text style={styles.message}>{message}</Text>

                <View className="h-[2px] bg-black/5 w-full my-5 rounded-full" />

                <Text style={styles.subtitle}>{subMessage || "Action completed successfully."}</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        backgroundColor: 'rgba(0,0,0,0.1)', // Lighter dim for quick actions
    },
    card: {
        backgroundColor: 'white',
        width: width * 0.85,
        maxWidth: 360,
        paddingVertical: 30, // Slightly tighter vertical padding
        paddingHorizontal: 30,
        borderRadius: 40,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'black',
        shadowColor: "#000",
        shadowOffset: {
            width: 8,
            height: 8,
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
    title: {
        fontSize: 12,
        fontFamily: FONT_BOLD,
        color: '#666',
        letterSpacing: 2,
        marginBottom: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    message: {
        fontSize: 22,
        fontFamily: FONT_BOLD,
        color: 'black',
        textAlign: 'center',
        letterSpacing: -0.5,
        textTransform: 'uppercase',
        lineHeight: 28
    },
    subtitle: {
        fontSize: 13,
        color: '#888',
        fontFamily: FONT_MAIN,
        fontStyle: 'italic',
        textAlign: 'center'
    }
});
