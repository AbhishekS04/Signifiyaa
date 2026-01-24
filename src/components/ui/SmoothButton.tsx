import React from 'react';
import { View, Text, Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    WithSpringConfig,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface SmoothButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: string; // Tailwind class string
    innerButtonStyle?: StyleProp<ViewStyle>; // For dynamic styles (like background colors)
    shadowStyle?: string; // Tailwind class string for shadow (bg-black etc)
    depth?: number; // How deep the 3D effect is (default 6)
    springConfig?: WithSpringConfig;
    disabled?: boolean;
}

const SmoothButton: React.FC<SmoothButtonProps> = ({
    children,
    onPress,
    containerStyle,
    buttonStyle = "",
    innerButtonStyle,
    shadowStyle = "bg-black rounded-full",
    depth = 6,
    springConfig = {
        damping: 15,
        stiffness: 150,
        mass: 1,
    },
    disabled = false
}) => {
    const offset = useSharedValue(-depth);

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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        offset.value = withSpring(0, springConfig);
    };

    const handlePressOut = () => {
        if (disabled) return;
        offset.value = withSpring(-depth, springConfig);
    };

    return (
        <View style={containerStyle} className={shadowStyle}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
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
        </View>
    );
};

export default SmoothButton;
