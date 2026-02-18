import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import SmoothButton from './ui/SmoothButton';
import SponsorModal from './SponsorModal';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    withSequence,
    Easing,
    FadeInDown
} from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');
const isSmallDevice = width < 380;

// Falling money bill animation
const MoneyBill = React.memo(({
    delay,
    startX,
    drift,
    size,
    opacity,
}: {
    delay: number;
    startX: number;
    drift: number;
    size: number;
    opacity: number;
    swaySpeed: number;
    turbulence: number;
}) => {
    const translateY = useSharedValue(-100);
    const translateX = useSharedValue(0);
    const rotateZ = useSharedValue(0);

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(height + 150, {
                    duration: 4000 + Math.random() * 2000,
                    easing: Easing.bezier(0.42, 0, 0.58, 1),
                }),
                -1,
                false
            )
        );

        translateX.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(drift * 0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(-drift * 0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            )
        );

        rotateZ.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(8, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
                    withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.sin) })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { rotateZ: `${rotateZ.value}deg` },
        ],
    }));

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: 'absolute',
                    left: startX,
                    width: 44 * size,
                    height: 22 * size,
                    opacity: opacity,
                }
            ]}
            className="bg-[#4CAF50] rounded-sm"
        >
            <View className="w-full h-full border-2 border-[#2E7D32] items-center justify-center">
                <Text style={{ fontSize: 12 * size }} className="font-bold text-white">₹</Text>
            </View>
        </Animated.View>
    );
});

const PrizesSponsors = () => {
    const moneyBills = React.useMemo(() => Array.from({ length: 12 }, (_, i) => {
        const wave = Math.floor(i / 4);
        const positionInWave = i % 4;
        return {
            delay: wave * 3000 + positionInWave * 200,
            startX: (Math.random() * (width - 60)),
            drift: 40 + Math.random() * 50,
            size: 0.7 + Math.random() * 0.4,
            opacity: 0.4 + Math.random() * 0.35,
            swaySpeed: 3000 + Math.random() * 2000,
            turbulence: 10 + Math.random() * 20,
        };
    }), []);

    // ============================================
    // SPONSORS DATA — images from assets/Sponsers
    // ============================================
    const SPONSORS = [
        { name: 'Arun Ice Creams', logo: require('../../assets/Sponsers/arun.avif') },
        { name: 'Axis Bank', logo: require('../../assets/Sponsers/axis.avif') },
        { name: 'Burger King', logo: require('../../assets/Sponsers/burgerking.avif') },
        { name: "Domino's", logo: require('../../assets/Sponsers/Domino.avif') },
        { name: 'Jawa Yezdi', logo: require('../../assets/Sponsers/jawa.avif') },
        { name: 'Nikon', logo: require('../../assets/Sponsers/nikon.avif') },
        { name: 'Red Bull', logo: require('../../assets/Sponsers/Redbull.avif') },
    ];

    const COMMUNITY_PARTNERS = [
        { name: 'CSI', logo: require('../../assets/Community_Partners/Spnl1.avif') },
        { name: 'ACM', logo: require('../../assets/Community_Partners/Spnl2.avif') },
        { name: 'Cerkle', logo: require('../../assets/Community_Partners/Spnl3.avif') },
    ];

    const [isSponsorModalVisible, setSponsorModalVisible] = useState(false);

    return (
        <View className="w-full pb-8">

            {/* ── Section A: Prize Pool Card ── */}
            <View className="bg-[#E8EAF6] rounded-3xl p-8 items-center relative overflow-hidden border-[3px] border-black shadow-sm mb-6">
                {moneyBills.map((bill, index) => (
                    <MoneyBill
                        key={index}
                        delay={bill.delay}
                        startX={bill.startX}
                        drift={bill.drift}
                        size={bill.size}
                        opacity={bill.opacity}
                        swaySpeed={bill.swaySpeed}
                        turbulence={bill.turbulence}
                    />
                ))}

                <View className="z-10">
                    <View className="items-center mb-4">
                        <Text
                            className={`leading-[50px] text-black ${isSmallDevice ? 'text-[30px]' : 'text-[50px]'}`}
                            style={{ fontFamily: 'BBHBartle' }}
                        >
                            200K+
                        </Text>
                        <Text
                            className={`leading-[50px] text-black -mt-2 ${isSmallDevice ? 'text-[30px]' : 'text-[50px]'}`}
                            style={{ fontFamily: 'BBHBartle' }}
                        >
                            INR
                        </Text>
                        <Text
                            className="text-xl text-black mt-1 tracking-widest uppercase"
                            style={{ fontFamily: 'Gilton' }}
                        >
                            IN PRIZE POOL
                        </Text>
                    </View>
                    <Text
                        className="text-gray-800 text-center uppercase text-sm tracking-wide"
                        style={{ fontFamily: 'Softura' }}
                    >
                        GOODIES, MERCHES &{'\n'}MANY MORE...
                    </Text>
                </View>
            </View>

            {/* ── Section A.5: Signifiya Buddy Card ── */}
            <View
                className="bg-[#D1FAE5] rounded-3xl pt-10 pb-8 px-8 items-center justify-center relative overflow-hidden border-[3px] border-black mb-8"
                style={{ shadowColor: '#000', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0 }}
            >
                <Animated.View entering={FadeInDown.delay(200).springify()} className="items-center w-full z-10">

                    {/* Title */}
                    <View className="items-center mb-10">
                        <Text
                            style={{ fontFamily: 'Gilton' }}
                            className={`text-black uppercase tracking-tight ${isSmallDevice ? 'text-4xl' : 'text-6xl'}`}
                        >
                            Signifiya
                        </Text>
                        <Text
                            style={{ fontFamily: 'Gilton' }}
                            className={`text-black uppercase -mt-2 ${isSmallDevice ? 'text-4xl' : 'text-6xl'}`}
                        >
                            Buddy
                        </Text>
                    </View>

                    {/* Prize boxes */}
                    <View className="w-full items-center gap-6">

                        {/* 1st Prize — 3D tactile */}
                        <View>
                            <View style={{
                                position: 'absolute', top: 7, left: 7,
                                width: isSmallDevice ? 160 : 190,
                                height: isSmallDevice ? 160 : 190,
                                backgroundColor: '#000', borderRadius: 28,
                            }} />
                            <View
                                className="bg-white border-[3px] border-black items-center justify-center"
                                style={{ width: isSmallDevice ? 160 : 190, height: isSmallDevice ? 160 : 190, borderRadius: 28 }}
                            >
                                <ExpoImage
                                    source={require('../../assets/Prizes/1st.avif')}
                                    style={{ width: isSmallDevice ? 90 : 110, height: isSmallDevice ? 90 : 110 }}
                                    contentFit="contain"
                                />
                                <Text style={{ fontFamily: 'Softura' }} className="text-sm font-bold text-black uppercase mt-2">
                                    1st Prize
                                </Text>
                            </View>
                        </View>

                        {/* 2nd & 3rd Prize row */}
                        <View className="flex-row gap-6 w-full justify-center">

                            {/* 2nd Prize — 3D tactile */}
                            <View>
                                <View style={{
                                    position: 'absolute', top: 6, left: 6,
                                    width: isSmallDevice ? 120 : 140,
                                    height: isSmallDevice ? 120 : 140,
                                    backgroundColor: '#000', borderRadius: 22,
                                }} />
                                <View
                                    className="bg-white border-[3px] border-black items-center justify-center"
                                    style={{ width: isSmallDevice ? 120 : 140, height: isSmallDevice ? 120 : 140, borderRadius: 22 }}
                                >
                                    <ExpoImage
                                        source={require('../../assets/Prizes/2nd.avif')}
                                        style={{ width: isSmallDevice ? 60 : 75, height: isSmallDevice ? 60 : 75 }}
                                        contentFit="contain"
                                    />
                                    <Text style={{ fontFamily: 'Softura' }} className="text-xs font-bold text-black uppercase mt-1">
                                        2nd Prize
                                    </Text>
                                </View>
                            </View>

                            {/* 3rd Prize — 3D tactile */}
                            <View>
                                <View style={{
                                    position: 'absolute', top: 6, left: 6,
                                    width: isSmallDevice ? 120 : 140,
                                    height: isSmallDevice ? 120 : 140,
                                    backgroundColor: '#000', borderRadius: 22,
                                }} />
                                <View
                                    className="bg-white border-[3px] border-black items-center justify-center"
                                    style={{ width: isSmallDevice ? 120 : 140, height: isSmallDevice ? 120 : 140, borderRadius: 22 }}
                                >
                                    <ExpoImage
                                        source={require('../../assets/Prizes/3rd.avif')}
                                        style={{ width: isSmallDevice ? 60 : 75, height: isSmallDevice ? 60 : 75 }}
                                        contentFit="contain"
                                    />
                                    <Text style={{ fontFamily: 'Softura' }} className="text-xs font-bold text-black uppercase mt-1">
                                        3rd Prize
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </View>

            {/* ── Section B: Sponsors Card ── */}
            <View className="bg-white rounded-3xl p-6 border-[3px] border-black shadow-sm">

                {/* Header */}
                <View className="items-center mb-6">
                    <View className="items-center">
                        <Text
                            className={`text-black ${isSmallDevice ? 'text-4xl' : 'text-5xl'}`}
                            style={{ fontFamily: 'Gilton' }}
                        >
                            CURRENT
                        </Text>
                        <Text
                            className={`text-black -mt-2 ${isSmallDevice ? 'text-4xl' : 'text-5xl'}`}
                            style={{ fontFamily: 'Gilton' }}
                        >
                            SPONSORS
                        </Text>
                    </View>
                    <Text className="text-gray-500 text-lg mt-1 text-center" style={{ fontFamily: 'Softura' }}>
                        Powered by the best in the industry
                    </Text>
                </View>

                {/* ── Sponsor Logo Grid (before separator) ── */}
                <View className="flex-row flex-wrap justify-center mb-8" style={{ gap: 12 }}>
                    {SPONSORS.map((sponsor, index) => (
                        <View key={index} style={{ position: 'relative', marginBottom: 4 }}>
                            {/* 3D shadow layer */}
                            <View style={{
                                position: 'absolute', top: 5, left: 5,
                                width: (width - 72) / 2,
                                height: 76,
                                backgroundColor: '#000',
                                borderRadius: 16,
                            }} />
                            {/* Card */}
                            <View
                                className="bg-white border-[2px] border-black items-center justify-center"
                                style={{
                                    width: (width - 72) / 2,
                                    height: 76,
                                    borderRadius: 16,
                                }}
                            >
                                <ExpoImage
                                    source={sponsor.logo}
                                    style={{ width: '78%', height: '68%' }}
                                    contentFit="contain"
                                    cachePolicy="memory-disk"
                                    transition={200}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Horizontal separator */}
                <View className="w-full h-[3px] bg-black mb-8" />

                {/* Community Partners */}
                <View className="items-center mb-10">
                    <Text className="text-black text-4xl uppercase" style={{ fontFamily: 'Gilton' }}>
                        COMMUNITY
                    </Text>
                    <Text
                        className="text-black text-4xl uppercase -mt-2"
                        style={{ fontFamily: 'Gilton', transform: [{ skewX: '-10deg' }] }}
                    >
                        PARTNERS
                    </Text>
                </View>

                <View className="items-center gap-12 mb-10">
                    {COMMUNITY_PARTNERS.map((partner, index) => (
                        <View key={index} className="w-40 h-24 items-center justify-center">
                            <ExpoImage
                                source={partner.logo}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                                transition={200}
                            />
                        </View>
                    ))}
                </View>

                {/* CTA Button */}
                <SmoothButton
                    onPress={() => setSponsorModalVisible(true)}
                    containerStyle={{ width: '100%' }}
                    buttonStyle="bg-black py-4 rounded-full items-center"
                    shadowStyle="bg-black rounded-full"
                    depth={1}
                >
                    <Text className="text-white text-lg" style={{ fontFamily: 'Softura' }}>
                        BECOME A SPONSOR
                    </Text>
                </SmoothButton>

                <SponsorModal visible={isSponsorModalVisible} onClose={() => setSponsorModalVisible(false)} />
            </View>
        </View>
    );
};

export default React.memo(PrizesSponsors);
