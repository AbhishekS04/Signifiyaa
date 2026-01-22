import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowDown } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

const HeroSection = () => {
    // Marquee Animation
    const [textWidth, setTextWidth] = React.useState(0);
    const translateX = useSharedValue(0);

    const MARQUEE_TEXT = "SIGNIFIYA'26 IS HERE. REGISTRATIONS ARE LIVE.   ";

    // Arrow bounce animation
    const arrowBounce = useSharedValue(0);

    useEffect(() => {
        // Bouncing arrow animation - indicates scroll down
        arrowBounce.value = withRepeat(
            withTiming(10, {
                duration: 800,
                easing: Easing.inOut(Easing.ease)
            }),
            -1, // Infinite
            true // Reverse (bounce up and down)
        );
    }, []);

    const arrowAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: arrowBounce.value }],
        };
    });

    // --- COUNTDOWN LOGIC (Easy to change target date here) ---
    const TARGET_DATE = new Date('2026-02-14T00:00:00');
    const [timeLeft, setTimeLeft] = React.useState({
        days: '29',
        hours: '23',
        minutes: '57',
        seconds: '38'
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const distance = TARGET_DATE.getTime() - now;

            if (distance < 0) return;

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
                seconds: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0'),
            });
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Run once immediately
        return () => clearInterval(timer);
    }, []);
    // ---------------------------------------------------------

    useEffect(() => {
        if (textWidth > 0) {
            translateX.value = withRepeat(
                withTiming(-textWidth, {
                    duration: 3500, // Balanced speed for readability vs energy
                    easing: Easing.linear,
                }),
                -1, // Infinite
                false
            );
        }
    }, [textWidth]);

    const marqueeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <View className="mb-4 mt-12">

            {/* --- 1. Top Marquee Strip (Outside Card) --- */}
            <View className="w-full h-10 bg-[#E1BEE7] overflow-hidden justify-center mb-5 border-y-2 border-black">
                <Animated.View style={[marqueeStyle, { flexDirection: 'row', width: 2000 }]}>
                    {/* Render one invisible to measure */}
                    <Text
                        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
                        className="absolute opacity-0 text-black font-[Inter_900Black] text-[11px] uppercase tracking-widest"
                    >
                        {MARQUEE_TEXT}
                    </Text>

                    {/* Render multiple copies for the loop */}
                    {[...Array(10)].map((_, i) => (
                        <Text key={i} className="text-black font-[Inter_900Black] text-[11px] uppercase tracking-widest">
                            {MARQUEE_TEXT}
                        </Text>
                    ))}
                </Animated.View>
            </View>

            {/* Main Hero Card with padding wrapper */}
            <View className="px-4">
                <LinearGradient
                    colors={['#6A1B9A', '#8E24AA', '#BA68C8', '#E1BEE7']}
                    locations={[0, 0.3, 0.6, 1]}
                    className="w-full rounded-[40px] pt-16 pb-8 px-6 relative overflow-hidden justify-center"
                    style={{ minHeight: isSmallDevice ? 600 : 700 }}
                >
                    {/* Background Watermark */}
                    <View className="absolute inset-x-0 bottom-0 items-center justify-end opacity-[0.08]" style={{ bottom: -40 }}>
                        <Image
                            source={require('../../assets/bglogo.png')}
                            style={{ width: 600, height: 700, resizeMode: 'contain', tintColor: 'white' }}
                        />
                    </View>

                    {/* Content */}
                    <View className="items-center z-10 w-full mb-20">
                        {/* Title */}
                        <Text
                            className={`text-white ${isSmallDevice ? 'text-4xl' : 'text-5xl'} tracking-[0.25em] text-center mb-8 uppercase`}
                            style={{ fontFamily: 'Bicubik' }}
                        >
                            SIGNIFIYA
                        </Text>

                        {/* Countdown Timer */}
                        <View className="flex-row justify-between w-full mb-10" style={{ paddingHorizontal: 8, maxWidth: 420 }}>
                            {[
                                { num: timeLeft.days, label: 'DAYS' },
                                { num: timeLeft.hours, label: 'HOURS' },
                                { num: timeLeft.minutes, label: 'MINUTES' },
                                { num: timeLeft.seconds, label: 'SECONDS' }
                            ].map((item, index) => (
                                <View key={index} className="items-center" style={{ minWidth: isSmallDevice ? 55 : 70 }}>
                                    {/* Container with extra space to prevent italic text clipping */}
                                    <View className="relative" style={{ paddingHorizontal: 8, minWidth: isSmallDevice ? 45 : 60 }}>
                                        {/* Subtle hard shadow */}
                                        <Text
                                            className={`absolute ${isSmallDevice ? 'text-[18px]' : 'text-[22px]'} text-black text-center`}
                                            style={{ top: 2, left: 2, right: 0, fontFamily: 'BBHBartle', opacity: 0.4 }}
                                        >
                                            {item.num}
                                        </Text>
                                        <Text
                                            className={`text-white ${isSmallDevice ? 'text-[16px]' : 'text-[20px]'} text-center`}
                                            style={{ fontFamily: 'BBHBartle' }}
                                        >
                                            {item.num}
                                        </Text>
                                    </View>
                                    <View className="w-10 h-[1.5px] bg-black my-1" />
                                    <Text className="text-black font-[Inter_700Bold] text-[9px] uppercase tracking-tighter opacity-80">
                                        {item.label}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Button */}
                        <TouchableOpacity
                            className="bg-[#E1BEE7]/60 border-2 border-black rounded-full px-14 py-4 active:bg-[#E1BEE7]/80 mb-16"
                        >
                            <Text className="text-black text-[12px] uppercase tracking-[0.15em]"
                                style={{ fontFamily: 'Gilton' }} >
                                SIGN IN / SIGN UP
                            </Text>
                        </TouchableOpacity>

                        {/* Description */}
                        <Text className="text-black/50 text-[9px] uppercase text-center mb-8 leading-4 tracking-tighter px-6"
                            style={{ fontFamily: 'Softura' }}>
                            SOET'S AWAITED FEST IS BACK WITH EVEN MORE FUN N{'\n'}
                            EXCITING PLANS | GLIDE DOWN TO EXPLORE OUR FEST
                        </Text>

                    </View>

                    {/* Footer Icons - Positioned Absolutely at Bottom */}
                    <View className="absolute bottom-6 left-0 right-0 px-6 z-20">
                        <View className="w-full relative h-24 items-center justify-end">
                            {/* Bouncing Arrow - Indicates Scroll Down */}
                            <Animated.View style={arrowAnimatedStyle} className="mb-2">
                                <ArrowDown color="black" size={45} strokeWidth={1.5} />
                            </Animated.View>
                            {/* Bunny - Bottom Right Absolute */}
                            <View className="absolute right-0 bottom-0">
                                <BunnyMascot />
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
};

const BunnyMascot = () => (
    <Svg width={90} height={90} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-8deg' }] }}>
        {/* Head */}
        <Path
            d="M25,50 L75,50 L85,70 L75,90 L25,90 L15,70 Z"
            fill="#CFD8DC"
            stroke="black"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        {/* Left Ear */}
        <Path
            d="M30,50 L15,20 L45,50"
            fill="#CFD8DC"
            stroke="black"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        {/* Right Ear */}
        <Path
            d="M70,50 L85,20 L55,50"
            fill="#CFD8DC"
            stroke="black"
            strokeWidth="2.5"
            strokeLinejoin="round"
        />
        {/* X Eye (left) */}
        <Path
            d="M35,72 L42,79 M42,72 L35,79"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        {/* Dot Eye (right) */}
        <Circle cx="68" cy="76" r="2.5" fill="black" />
        {/* Nose */}
        <Path d="M50,88 L50,84" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

// Wrap with React.memo to prevent re-renders during scroll
export default React.memo(HeroSection);
