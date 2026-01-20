import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    withSequence,
    Easing,
    interpolate
} from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');

// Ultra-Light Paper Money with Realistic Float Physics
const MoneyBill = ({
    delay,
    startX,
    drift,
    size,
    opacity,
    swaySpeed
}: {
    delay: number;
    startX: number;
    drift: number;
    size: number;
    opacity: number;
    swaySpeed: number;
}) => {
    const translateY = useSharedValue(-100);
    const translateX = useSharedValue(0);
    const rotateX = useSharedValue(Math.random() * 30); // Start at random angle
    const rotateZ = useSharedValue(0);

    useEffect(() => {
        // ULTRA-SLOW falling like lightweight paper (10-15 seconds!)
        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(height + 100, {
                    duration: 12000 + Math.random() * 3000, // 12-15 seconds!!
                    easing: Easing.bezier(0.4, 0.0, 0.6, 1.0), // Very gentle acceleration
                }),
                -1,
                false
            )
        );

        // Strong horizontal zigzag drift (like wind)
        translateX.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(drift, {
                        duration: 3000,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    withTiming(-drift * 0.8, {
                        duration: 3500,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    withTiming(drift * 0.6, {
                        duration: 2800,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    withTiming(-drift * 0.4, {
                        duration: 3200,
                        easing: Easing.inOut(Easing.ease),
                    })
                ),
                -1,
                true
            )
        );

        // Gentle end-over-end tumble (SLOW)
        rotateX.value = withDelay(
            delay,
            withRepeat(
                withTiming(rotateX.value + 360, {
                    duration: swaySpeed, // 8-12 seconds per flip
                    easing: Easing.inOut(Easing.ease), // Smooth not linear
                }),
                -1,
                false
            )
        );

        // Subtle side-to-side flutter
        rotateZ.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(12, {
                        duration: 1500,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    withTiming(-10, {
                        duration: 1800,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    withTiming(8, {
                        duration: 1300,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    withTiming(-6, {
                        duration: 1600,
                        easing: Easing.inOut(Easing.sin),
                    })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        // Perspective scaling - bills shrink when edge-on
        const scale = interpolate(
            rotateX.value % 360,
            [0, 90, 180, 270, 360],
            [1, 0.15, 1, 0.15, 1]
        );

        return {
            transform: [
                { translateY: translateY.value },
                { translateX: translateX.value },
                { perspective: 1200 }, // Strong 3D perspective
                { rotateX: `${rotateX.value}deg` },
                { rotateZ: `${rotateZ.value}deg` },
                { scaleY: scale },
            ],
        };
    });

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: 'absolute',
                    left: startX,
                    width: 42 * size,
                    height: 21 * size,
                    opacity: opacity,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                }
            ]}
            className="bg-[#4CAF50] rounded-sm"
        >
            {/* Rupee note with detail */}
            <View className="w-full h-full border-2 border-[#2E7D32] items-center justify-center bg-gradient-to-br from-[#66BB6A] to-[#4CAF50]">
                <Text style={{ fontSize: 11 * size }} className="font-bold text-white">₹</Text>
            </View>
        </Animated.View>
    );
};

const PrizesSponsors = () => {
    // Fewer bills, ultra-realistic lightweight paper physics
    const moneyBills = Array.from({ length: 6 }, (_, i) => ({
        delay: i * 1000, // More time between bills
        startX: (Math.random() * (width - 50)),
        drift: 40 + Math.random() * 50, // 40-90px drift (strong wind)
        size: 0.8 + Math.random() * 0.4, // 0.8x - 1.2x
        opacity: 0.4 + Math.random() * 0.3, // 0.4 - 0.7
        swaySpeed: 8000 + Math.random() * 4000, // 8-12 seconds per tumble
    }));

    return (
        <View className="w-full pb-8">
            {/* Section A: Prize Pool Card with Floating Money */}
            <View className="bg-[#E8EAF6] rounded-3xl p-8 items-center relative overflow-hidden border-[3px] border-black shadow-sm mb-6">

                {/* ULTRA-LIGHT FLOATING MONEY ANIMATION */}
                {moneyBills.map((bill, index) => (
                    <MoneyBill
                        key={index}
                        delay={bill.delay}
                        startX={bill.startX}
                        drift={bill.drift}
                        size={bill.size}
                        opacity={bill.opacity}
                        swaySpeed={bill.swaySpeed}
                    />
                ))}

                {/* Content (Above the money rain) */}
                <View className="z-10">
                    {/* Massive Typography Block */}
                    <View className="items-center mb-4">
                        <Text className="font-[ArchivoBlack_400Regular] text-[72px] leading-[72px] text-black">
                            120K+
                        </Text>
                        <Text className="font-[ArchivoBlack_400Regular] text-[56px] leading-[56px] text-black -mt-2">
                            INR
                        </Text>
                        <Text className="font-[Inter_400Regular] text-xl text-black mt-1 tracking-widest uppercase">
                            IN PRIZE POOL
                        </Text>
                    </View>

                    {/* Footer Text with sparkle */}
                    <Text className="font-[Inter_700Bold] text-gray-800 text-center uppercase text-sm tracking-wide">
                        GOODIES, MERCHES &{'\n'}MANY MORE✨
                    </Text>
                </View>
            </View>

            {/* Section B: Our Sponsors Card */}
            <View className="bg-white rounded-3xl p-6 border-[3px] border-black shadow-sm">

                {/* Header */}
                <View className="items-center mb-8">
                    <View className="flex-row items-baseline">
                        <Text className="font-[ArchivoBlack_400Regular] text-3xl text-black mr-2">OUR</Text>
                        <Text className="font-[Inter_700Bold] text-3xl text-black italic">SPONSORS</Text>
                    </View>
                    <Text className="font-[Inter_400Regular] text-gray-500 text-sm mt-1">
                        Powered by the best in the industry.
                    </Text>
                </View>

                {/* Sponsor Grid */}
                <View className="flex-row flex-wrap justify-between gap-y-8 px-4 mb-8">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <View key={item} className="w-[45%] h-20 items-center justify-center">
                            {/* Placeholder for Logos */}
                            <Text className="font-[Inter_700Bold] text-gray-300 text-lg">
                                Sponsor {item}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Action Button */}
                <TouchableOpacity className="bg-black py-4 rounded-full items-center shadow-md">
                    <Text className="font-[ArchivoBlack_400Regular] text-white text-lg">
                        BECOME A SPONSOR
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default PrizesSponsors;
