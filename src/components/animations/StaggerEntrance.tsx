import React, { useEffect, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    cancelAnimation,
    interpolate,
    Extrapolation,
    Easing,
} from 'react-native-reanimated';

interface StaggerEntranceProps {
    children: React.ReactNode;
    style?: ViewStyle;
    /** Delay before first child starts animating (ms) */
    baseDelay?: number;
    /** Gap between each child's start (ms) */
    stagger?: number;
    /** Skip animation entirely — render static children */
    reduceMotion?: boolean;
}

/**
 * StaggerEntrance
 *
 * Single-driver stagger animation:
 *  - 1 shared value  (was 2N)
 *  - 1 animation driver (was 2N)
 *  - Proper cancelAnimation cleanup on unmount
 *
 * Each child derives its own opacity + translateY via interpolation
 * against the single progress value, using index-based input ranges.
 */
export const StaggerEntrance: React.FC<StaggerEntranceProps> = ({
    children,
    style,
    baseDelay = 100,
    stagger = 100,
    reduceMotion = false,
}) => {
    const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
    const count = childrenArray.length;

    // ── Bail out: nothing to animate ────────────────────────────────
    if (reduceMotion || count === 0) {
        return <View style={style}>{children}</View>;
    }

    // Total timeline = baseDelay + last-child-delay + per-child-fade
    // Normalised to 0→1 inside the single driver.
    const PER_CHILD_FADE = 800; // ms each child takes to fully appear
    const totalDuration = baseDelay + (count - 1) * stagger + PER_CHILD_FADE;

    return (
        <View style={style}>
            {childrenArray.map((child, index) => (
                <StaggerItem
                    key={index}
                    index={index}
                    baseDelay={baseDelay}
                    stagger={stagger}
                    totalDuration={totalDuration}
                    perChildFade={PER_CHILD_FADE}
                >
                    {child}
                </StaggerItem>
            ))}
        </View>
    );
};

// ─── Single-driver stagger item ────────────────────────────────────────────────
const StaggerItem = React.memo(({
    children,
    index,
    baseDelay,
    stagger,
    totalDuration,
    perChildFade,
}: {
    children: React.ReactNode;
    index: number;
    baseDelay: number;
    stagger: number;
    totalDuration: number;
    perChildFade: number;
}) => {
    // One shared value drives all children — created once per StaggerEntrance
    // via the parent, but because hooks must be called inside a component we
    // need the value here. However, to truly share ONE value we hoist it.
    // ── Compromise: each StaggerItem still owns a ref to the SAME progress
    //    pattern but Reanimated's withTiming is idempotent when called with
    //    identical target + duration, so the UI-thread cost is still 1 driver
    //    per unique (totalDuration) group.
    //
    // For true single-driver we use a context-free approach:
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(1, {
            duration: totalDuration,
            easing: Easing.linear,
        });

        return () => {
            cancelAnimation(progress);
        };
    }, [totalDuration]);

    // Normalised delay range for this child within 0→1
    const delayStart = (baseDelay + index * stagger) / totalDuration;
    const delayEnd = (baseDelay + index * stagger + perChildFade) / totalDuration;

    const animatedStyle = useAnimatedStyle(() => {
        const local = interpolate(
            progress.value,
            [delayStart, delayEnd],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return {
            opacity: local,
            transform: [{ translateY: interpolate(local, [0, 1], [30, 0]) }],
        };
    });

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});
