import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';

const Ticker = () => {
    const translationX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translationX.value }],
        };
    });

    useEffect(() => {
        translationX.value = withRepeat(
            withTiming(-500, {
                duration: 10000, // Slow scroll
                easing: Easing.linear,
            }),
            -1, // Infinite repeat
            false // Do not reverse
        );
    }, []);

    return (
        <View className="bg-[#F06292] border-b-2 border-black py-2 overflow-hidden">
            <Animated.View style={[styles.tickerContainer, animatedStyle]}>
                <Text className="text-black font-heading text-xl uppercase tracking-widest mr-8 font-bold">
                    REGISTRATIONS. LIVE NOW. SIGNIFIYA'26 IS HERE
                </Text>
                <Text className="text-black font-heading text-xl uppercase tracking-widest mr-8 font-bold">
                    REGISTRATIONS. LIVE NOW. SIGNIFIYA'26 IS HERE
                </Text>
                <Text className="text-black font-heading text-xl uppercase tracking-widest mr-8 font-bold">
                    REGISTRATIONS. LIVE NOW. SIGNIFIYA'26 IS HERE
                </Text>
                <Text className="text-black font-heading text-xl uppercase tracking-widest mr-8 font-bold">
                    REGISTRATIONS. LIVE NOW. SIGNIFIYA'26 IS HERE
                </Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    tickerContainer: {
        flexDirection: 'row',
        width: 1000, // Ensure it's wide enough
    },
});

export default Ticker;
