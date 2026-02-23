import React, { memo } from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    WithSpringConfig,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface SmoothButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: string; // Tailwind class string
    innerButtonStyle?: StyleProp<ViewStyle>; // For dynamic styles (like background colors)
    shadowStyle?: string; // Tailwind class string for shadow (bg-black etc)
    depth?: number; // How deep the 3D effect is (default 6)
    springConfig?: WithSpringConfig;
    disabled?: boolean;
    active?: boolean; // If true, the button stays in the pressed state
    hitSlop?: number | { top: number; bottom: number; left: number; right: number };
}

const DEFAULT_SPRING_CONFIG: WithSpringConfig = {
    damping: 15,
    stiffness: 150,
    mass: 1,
};

const SmoothButton: React.FC<SmoothButtonProps> = memo(({
    children,
    onPress,
    onPressIn,
    onPressOut,
    containerStyle,
    buttonStyle = "",
    innerButtonStyle,
    shadowStyle = "bg-black rounded-full",
    depth = 6,
    springConfig = DEFAULT_SPRING_CONFIG,
    disabled = false,
    active = false,
    hitSlop = 10
}) => {
    // If active, start at 0 (pressed), otherwise start at -depth (unpressed)
    const offset = useSharedValue(active ? 0 : -depth);

    // React to prop changes
    React.useEffect(() => {
        if (active) {
            offset.value = withSpring(0, springConfig);
        } else {
            offset.value = withSpring(-depth, springConfig);
        }
    }, [active, depth, springConfig]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: offset.value },
                { translateY: offset.value }
            ]
        };
    });

    const handlePressIn = () => {
        if (disabled) return;
        if (onPressIn) onPressIn();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        offset.value = withSpring(0, springConfig);
    };

    const handlePressOut = () => {
        if (disabled) return;
        if (onPressOut) onPressOut();
        offset.value = withSpring(-depth, springConfig);
    };

    return (
        <Animated.View
            style={containerStyle}
            className={shadowStyle}
        >
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                hitSlop={hitSlop}
                style={{ overflow: 'visible' }} // Ensure button can move out of bounds if needed
            >
                <Animated.View
                    className={buttonStyle}
                    style={[
                        animatedStyle,
                        innerButtonStyle // Apply dynamic styles here
                    ]}
                >
                    {children}
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
});

export default SmoothButton;
