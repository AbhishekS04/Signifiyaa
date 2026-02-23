import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    cancelAnimation,
    Easing,
} from 'react-native-reanimated';

/* ── constants ─────────────────────────────────────────────── */
const TICKER_TEXT = "REGISTRATIONS. LIVE NOW. SIGNIFIYA'26 IS HERE";
const COPY_COUNT = 4;
const SCROLL_DURATION_MS = 10_000;

/* ── types ─────────────────────────────────────────────────── */
interface TickerProps {
    /** Controls whether the infinite animation runs. Default `true`. */
    isVisible?: boolean;
}

/* ── component ─────────────────────────────────────────────── */
const Ticker = ({ isVisible = true }: TickerProps) => {
    const translateX = useSharedValue(0);
    const [segmentWidth, setSegmentWidth] = useState(0);
    const measuredRef = useRef(false);

    /* Measure the full row once, derive one-segment width */
    const handleRowLayout = useCallback((e: LayoutChangeEvent) => {
        if (measuredRef.current) return;
        const totalWidth = e.nativeEvent.layout.width;
        if (totalWidth > 0) {
            measuredRef.current = true;
            setSegmentWidth(totalWidth / COPY_COUNT);
        }
    }, []);

    /* Start / stop animation based on visibility + measured width */
    useEffect(() => {
        if (!isVisible || segmentWidth === 0) {
            cancelAnimation(translateX);
            translateX.value = 0;
            return;
        }

        translateX.value = 0;
        translateX.value = withRepeat(
            withTiming(-segmentWidth, {
                duration: SCROLL_DURATION_MS,
                easing: Easing.linear,
            }),
            -1,
            false,
        );

        return () => {
            cancelAnimation(translateX);
        };
    }, [isVisible, segmentWidth]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View className="bg-[#F06292] border-b-2 border-black py-2 overflow-hidden">
            <Animated.View
                onLayout={handleRowLayout}
                style={[styles.tickerRow, animatedStyle]}
            >
                {Array.from({ length: COPY_COUNT }).map((_, i) => (
                    <Text
                        key={i}
                        className="text-black font-heading text-xl uppercase tracking-widest mr-8 font-bold"
                    >
                        {TICKER_TEXT}
                    </Text>
                ))}
            </Animated.View>
        </View>
    );
};

/* ── styles ────────────────────────────────────────────────── */
const styles = StyleSheet.create({
    tickerRow: {
        flexDirection: 'row',
    },
});

export default React.memo(Ticker);
