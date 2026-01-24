import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withTiming,
    withSpring,
    Easing
} from 'react-native-reanimated';

interface StaggerEntranceProps {
    children: React.ReactNode;
    style?: ViewStyle;
    baseDelay?: number;
    stagger?: number;
}

/**
 * StaggerEntrance
 * 
 * Animates direct children in a staggered "waterfall" sequence.
 * Ideal for initial screen loads to give that "building up" feel.
 */
export const StaggerEntrance: React.FC<StaggerEntranceProps> = ({
    children,
    style,
    baseDelay = 100,
    stagger = 100
}) => {
    // Convert children to array to map indices
    const childrenArray = React.Children.toArray(children);

    return (
        <View style={style}>
            {childrenArray.map((child, index) => (
                <StaggerItem key={index} index={index} baseDelay={baseDelay} stagger={stagger}>
                    {child}
                </StaggerItem>
            ))}
        </View>
    );
};

const StaggerItem = ({
    children,
    index,
    baseDelay,
    stagger
}: {
    children: React.ReactNode,
    index: number,
    baseDelay: number,
    stagger: number
}) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50); // Start 50px down

    useEffect(() => {
        const delay = baseDelay + (index * stagger);

        opacity.value = withDelay(delay, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
        translateY.value = withDelay(delay, withSpring(0, { damping: 12, stiffness: 90 })); // Soft spring up
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }]
    }));

    return (
        <Animated.View style={animatedStyle}>
            {children}
        </Animated.View>
    );
};
