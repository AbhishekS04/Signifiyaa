import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowDown } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import SmoothButton from './ui/SmoothButton';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

// Hoist constants outside component — avoids re-creation every render
const TARGET_DATE_MS = new Date('2026-03-27T00:00:00').getTime();
const MARQUEE_TEXT = "SIGNIFIYA'26 IS HERE. REGISTRATIONS ARE LIVE.   ";

// --- Isolated Countdown Component ---
// Extracted so the 1s setInterval only re-renders this small subtree, not all of HeroSection
const CountdownTimer = React.memo(() => {
    const [timeLeft, setTimeLeft] = useState({
        days: '--',
        hours: '--',
        minutes: '--',
        seconds: '--'
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = Date.now();
            const distance = TARGET_DATE_MS - now;

            if (distance < 0) return;

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
                seconds: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0'),
            });
        };

        calculateTimeLeft(); // Run once immediately
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <View className="flex-row  justify-between w-full mb-10" style={{ paddingHorizontal: 8, maxWidth: 420 }}>
            {[
                { num: timeLeft.days, label: 'DAYS' },
                { num: timeLeft.hours, label: 'HOURS' },
                { num: timeLeft.minutes, label: 'MINUTES' },
                { num: timeLeft.seconds, label: 'SECONDS' }
            ].map((item, index) => (
                <View key={index} className="items-center" style={{ minWidth: isSmallDevice ? 55 : 70 }}>
                    <View className="relative" style={{ paddingHorizontal: 8, minWidth: isSmallDevice ? 45 : 60 }}>
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
                    <Text className="text-black font-[Softura] text-[10px] uppercase tracking-tighter opacity-80">
                        {item.label}
                    </Text>
                </View>
            ))}
        </View>
    );
});

interface HeroSectionProps {
    onSignInPress?: () => void;
}

const HeroSection = ({ onSignInPress }: HeroSectionProps) => {
    // Marquee Animation
    const [textWidth, setTextWidth] = useState(0);
    const translateX = useSharedValue(0);

    // Arrow bounce animation
    const arrowBounce = useSharedValue(0);

    useEffect(() => {
        arrowBounce.value = withRepeat(
            withTiming(10, {
                duration: 800,
                easing: Easing.inOut(Easing.ease)
            }),
            -1,
            true
        );
    }, []);

    const arrowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: arrowBounce.value }],
    }));

    useEffect(() => {
        if (textWidth > 0) {
            translateX.value = withRepeat(
                withTiming(-textWidth, {
                    duration: 3500,
                    easing: Easing.linear,
                }),
                -1,
                false
            );
        }
    }, [textWidth]);

    const marqueeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const { isLoggedIn } = useAuth();
    const navigation = useNavigation<any>();

    // Memoize navigation callbacks — prevents child re-renders from new function refs
    const handleNavigateEvents = useCallback(() => navigation.navigate('Events'), [navigation]);
    const handleNavigatePayments = useCallback(() => navigation.navigate('Main', { screen: 'Payments' }), [navigation]);
    const handleTextLayout = useCallback((e: any) => setTextWidth(e.nativeEvent.layout.width), []);

    return (
        <View className="mb-4">

            {/* --- 1. Top Marquee Strip (Outside Card) --- */}
            <View className="w-full h-10 bg-[#E1BEE7] overflow-hidden justify-center mb-5 border-y-2 border-black">
                <Animated.View style={[marqueeStyle, { flexDirection: 'row', width: 2000 }]}>
                    {/* Render one invisible to measure */}
                    <Text
                        onLayout={handleTextLayout}
                        className="absolute opacity-0 text-black font-[Gilton] text-[11px] uppercase tracking-widest"
                    >
                        {MARQUEE_TEXT}
                    </Text>

                    {/* Reduced from 10 → 5 copies — more than enough for seamless loop in 2000px */}
                    {[...Array(5)].map((_, i) => (
                        <Text key={i} className="text-black font-[Gilton] text-[11px] uppercase tracking-widest">
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
                    className="w-full rounded-[30px] pt-16 pb-8 px-6 relative overflow-hidden justify-center"
                    style={{ minHeight: isSmallDevice ? 600 : 700 }}
                >
                    {/* Background Watermark */}
                    <View className="absolute inset-x-0 bottom-0 items-center justify-end opacity-[0.10]" style={{ bottom: -40 }}>
                        <Image
                            source={require('../../assets/bglogo.png')}
                            style={{ width: 600, height: 700, tintColor: 'white' }}
                            contentFit="contain"
                            cachePolicy="memory-disk"
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

                        {/* Countdown Timer — isolated component, 1s updates don't re-render HeroSection */}
                        <CountdownTimer />

                        {/* Button(s) Container */}
                        <View className="items-center gap-4 mb-16">
                            {!isLoggedIn ? (
                                <SmoothButton
                                    onPress={onSignInPress}
                                    containerStyle={{ alignSelf: 'center' }}
                                    buttonStyle="bg-[#E1BEE7] border-2 border-black rounded-full px-14 py-4"
                                    depth={6}
                                >
                                    <Text className="text-black text-[12px] uppercase tracking-[0.15em]"
                                        style={{ fontFamily: 'Gilton' }} >
                                        SIGN IN / SIGN UP
                                    </Text>
                                </SmoothButton>
                            ) : (
                                <>
                                    {/* CHECK EVENTS Button */}
                                    <SmoothButton
                                        onPress={handleNavigateEvents}
                                        containerStyle={{ alignSelf: 'center' }}
                                        buttonStyle="bg-[#E1BEE7] border-[3px] border-black rounded-full px-10 py-3"
                                        depth={4}
                                    >
                                        <Text className="text-black text-[16px] uppercase tracking-tighter"
                                            style={{ fontFamily: 'Gilton' }} >
                                            CHECK EVENTS
                                        </Text>
                                    </SmoothButton>

                                    {/* VISITOR'S PASS Button */}
                                    <SmoothButton
                                        onPress={handleNavigatePayments}
                                        containerStyle={{ alignSelf: 'center' }}
                                        buttonStyle="bg-white border-[2px] border-black rounded-full px-10 py-3"
                                        depth={4}
                                    >
                                        <Text className="text-black text-[16px] uppercase tracking-tighter"
                                            style={{ fontFamily: 'Gilton' }} >
                                            VISITOR'S PASS
                                        </Text>
                                    </SmoothButton>
                                </>
                            )}
                        </View>

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

const BunnyMascot = React.memo(() => (
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
));

// Wrap with React.memo to prevent re-renders during scroll
export default React.memo(HeroSection);
