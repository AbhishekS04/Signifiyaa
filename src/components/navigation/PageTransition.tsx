import React, { useCallback } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

interface PageTransitionProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

/**
 * PageTransition
 * 
 * Provides a "Super Smooth" GSAP-style entry animation.
 * Uses useFocusEffect to animate on every focus change (works with mounted screens).
 * 
 * Animation Profile:
 * - Opacity: Smooth fade in (0 -> 1)
 * - Slide: Fluid drift up (30px -> 0)
 * - Easing: Luxurious "Apple" curve (0.25, 1, 0.5, 1)
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children, style }) => {
    // Initial values: Start invisible and down
    const opacity = useSharedValue(1); // Start at 1 to avoid flash on first render
    const translateY = useSharedValue(0);

    useFocusEffect(
        useCallback(() => {
            // When screen gains focus: Reset to initial state THEN animate in
            opacity.value = 0;
            translateY.value = 30;

            // Smooth "drift up + fade in" animation
            const config = {
                duration: 600,
                easing: Easing.out(Easing.cubic), // Smooth drift
            };

            opacity.value = withTiming(1, { duration: 600 });
            translateY.value = withTiming(0, config);

            return () => {
                // On blur: instant reset (prevents stale visible frame)
                opacity.value = 0;
            };
        }, [])
    );

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
        flex: 1,
        // backgroundColor: '#000', // Removed: Let screen background decide (prevents dark fade on light screens)
    }));

    return (
        <Animated.View
            style={[animatedStyle, style]}
        >
            {children}
        </Animated.View>
    );
};
