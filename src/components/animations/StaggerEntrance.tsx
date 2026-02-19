import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
    SharedValue,
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

// ─── Context to share ONE progress value across all children ───────────────────
const ProgressCtx = createContext<SharedValue<number> | null>(null);

/**
 * StaggerEntrance
 *
 * True single-driver stagger animation:
 *  - 1 shared value for the entire group
 *  - 1 animation driver (withTiming) started once in the parent
 *  - Each child derives opacity + translateY via interpolation
 *  - Proper cancelAnimation cleanup on unmount
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

    // ── Single animation driver — hoisted to parent ─────────────────
    const PER_CHILD_FADE = 800;
    const totalDuration = baseDelay + (count - 1) * stagger + PER_CHILD_FADE;

    const progress = useSharedValue(0);

    useEffect(() => {
        if (reduceMotion || count === 0) return;

        progress.value = withTiming(1, {
            duration: totalDuration,
            easing: Easing.linear,
        });

        return () => {
            cancelAnimation(progress);
        };
    }, [totalDuration, reduceMotion, count]);

    // ── Bail out: nothing to animate ────────────────────────────────
    if (reduceMotion || count === 0) {
        return <View style={style}>{children}</View>;
    }

    return (
        <ProgressCtx.Provider value={progress}>
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
        </ProgressCtx.Provider>
    );
};

// ─── Lightweight child — reads shared progress, zero animation drivers ─────────
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
    const progress = useContext(ProgressCtx)!;

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
