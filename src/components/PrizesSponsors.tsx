import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import SmoothButton from './ui/SmoothButton';
import SponsorModal from './SponsorModal';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedReaction,
    withRepeat,
    withTiming,
    withDelay,
    withSpring,
    interpolate,
    cancelAnimation,
    runOnJS,
    Easing,
    FadeInDown,
    type SharedValue,
} from 'react-native-reanimated';

// ─── Constants (hoisted — zero per-render cost) ────────────────────────────────
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL = SCREEN_WIDTH < 380;

// ─── Static data arrays (module scope — stable references forever) ─────────────
const SPONSORS = Object.freeze([
    { name: 'Arun Ice Creams', logo: require('../../assets/Sponsers/arun.avif') },
    { name: 'Axis Bank', logo: require('../../assets/Sponsers/axis.avif') },
    { name: 'Burger King', logo: require('../../assets/Sponsers/burgerking.avif') },
    { name: "Domino's", logo: require('../../assets/Sponsers/Domino.avif') },
    { name: 'Jawa Yezdi', logo: require('../../assets/Sponsers/jawa.avif') },
    { name: 'Nikon', logo: require('../../assets/Sponsers/nikon.avif') },
    { name: 'Red Bull', logo: require('../../assets/Sponsers/Redbull.avif') },
]);

const COMMUNITY_PARTNERS = Object.freeze([
    { name: 'CSI', logo: require('../../assets/Community_Partners/Spnl1.avif') },
    { name: 'ACM', logo: require('../../assets/Community_Partners/Spnl2.avif') },
    { name: 'Cerkle', logo: require('../../assets/Community_Partners/Spnl3.avif') },
]);

// Pre-compute bill configurations at module scope (pure data, no hooks)
const BILL_COUNT = 8; // Reduced from 12 — decorative, fewer is fine
const MONEY_BILL_CONFIGS = Object.freeze(
    Array.from({ length: BILL_COUNT }, (_, i) => {
        const wave = Math.floor(i / 4);
        const posInWave = i % 4;
        return Object.freeze({
            delay: wave * 3000 + posInWave * 200,
            startX: Math.random() * (SCREEN_WIDTH - 60),
            drift: 40 + Math.random() * 50,
            size: 0.7 + Math.random() * 0.4,
            opacity: 0.4 + Math.random() * 0.35,
            fallDuration: 4000 + Math.random() * 2000,
        });
    })
);

// ─── StyleSheet (created once, shared across all renders) ──────────────────────
const S = StyleSheet.create({
    // Fonts
    fontBBH: { fontFamily: 'BBHBartle' },
    fontGilton: { fontFamily: 'Gilton' },
    fontSoftura: { fontFamily: 'Softura' },
    // Buddy card shadow
    buddyShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    // Prize shadow boxes
    prize1stShadow: {
        position: 'absolute', top: 7, left: 7,
        width: IS_SMALL ? 160 : 190,
        height: IS_SMALL ? 160 : 190,
        backgroundColor: '#000', borderRadius: 28,
    },
    prize1stBox: {
        width: IS_SMALL ? 160 : 190,
        height: IS_SMALL ? 160 : 190,
        borderRadius: 28,
    },
    prize1stImg: {
        width: IS_SMALL ? 90 : 110,
        height: IS_SMALL ? 90 : 110,
    },
    prize23Shadow: {
        position: 'absolute', top: 6, left: 6,
        width: IS_SMALL ? 120 : 140,
        height: IS_SMALL ? 120 : 140,
        backgroundColor: '#000', borderRadius: 22,
    },
    prize23Box: {
        width: IS_SMALL ? 120 : 140,
        height: IS_SMALL ? 120 : 140,
        borderRadius: 22,
    },
    prize23Img: {
        width: IS_SMALL ? 60 : 75,
        height: IS_SMALL ? 60 : 75,
    },
    // Sponsor grid
    sponsorGridGap: { gap: 12 },
    sponsorCardWrap: { position: 'relative' as const, marginBottom: 4 },
    sponsorShadow: {
        position: 'absolute' as const, top: 5, left: 5,
        width: (SCREEN_WIDTH - 72) / 2,
        height: 76,
        backgroundColor: '#000',
        borderRadius: 16,
    },
    sponsorCard: {
        width: (SCREEN_WIDTH - 72) / 2,
        height: 76,
        borderRadius: 16,
    },
    sponsorLogo: { width: '78%' as any, height: '68%' as any },
    // Community partner
    partnerImg: { width: '100%' as any, height: '100%' as any },
    partnersSkew: { fontFamily: 'Gilton', transform: [{ skewX: '-10deg' }] },
    // CTA
    ctaContainer: { width: '100%' as any },
    // MoneyBill
    billAbsolute: { position: 'absolute' as const },
});

// ─── MoneyBill (single shared progress → visibility-aware, pauses off-screen) ─
const MoneyBill = React.memo(({
    delay,
    startX,
    drift,
    size,
    opacity,
    fallDuration,
    paused,
}: {
    delay: number;
    startX: number;
    drift: number;
    size: number;
    opacity: number;
    fallDuration: number;
    paused: boolean;
}) => {
    const progress = useSharedValue(0);
    const wasRunningRef = useRef(false);

    useEffect(() => {
        if (paused) {
            // Stop running animation — preserves current progress value
            cancelAnimation(progress);
            wasRunningRef.current = false;
        } else {
            // Start / restart animation
            progress.value = withDelay(
                wasRunningRef.current ? 0 : delay, // skip initial delay on resume
                withRepeat(
                    withTiming(1, { duration: fallDuration, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
                    -1,
                    false
                )
            );
            wasRunningRef.current = true;
        }
        return () => cancelAnimation(progress);
    }, [paused]);

    const animatedStyle = useAnimatedStyle(() => {
        const p = progress.value;
        return {
            transform: [
                { translateY: interpolate(p, [0, 1], [-100, SCREEN_HEIGHT + 150]) },
                { translateX: interpolate(p, [0, 0.25, 0.5, 0.75, 1], [0, drift * 0.3, 0, -drift * 0.3, 0]) },
                { rotateZ: `${interpolate(p, [0, 0.25, 0.5, 0.75, 1], [0, 8, 0, -8, 0])}deg` },
            ],
        };
    });

    // Pre-computed static style (size/position don't change)
    const billStyle = useMemo(() => ({
        ...S.billAbsolute,
        left: startX,
        width: 44 * size,
        height: 22 * size,
        opacity,
    }), [startX, size, opacity]);

    const fontSize = useMemo(() => ({ fontSize: 12 * size }), [size]);

    return (
        <Animated.View style={[animatedStyle, billStyle]} className="bg-[#4CAF50] rounded-sm">
            <View className="w-full h-full border-2 border-[#2E7D32] items-center justify-center">
                <Text style={fontSize} className="font-bold text-white">₹</Text>
            </View>
        </Animated.View>
    );
});

// ─── SponsorCard (memoized, stable style refs) ────────────────────────────────
const SponsorCard = React.memo(({ logo }: { logo: any }) => (
    <View style={S.sponsorCardWrap}>
        <View style={S.sponsorShadow} />
        <View className="bg-white border-[2px] border-black items-center justify-center" style={S.sponsorCard}>
            <ExpoImage source={logo} style={S.sponsorLogo} contentFit="contain" cachePolicy="memory-disk" transition={200} />
        </View>
    </View>
));

// ─── PartnerCard (memoized) ────────────────────────────────────────────────────
const PartnerCard = React.memo(({ logo }: { logo: any }) => (
    <View className="w-40 h-24 items-center justify-center">
        <ExpoImage source={logo} style={S.partnerImg} contentFit="contain" cachePolicy="memory-disk" transition={200} />
    </View>
));

// ─── Main Component ────────────────────────────────────────────────────────────
const PrizesSponsors = ({ scrollY }: { scrollY?: SharedValue<number> }) => {
    const enterOpacity = useSharedValue(0);
    const enterTranslateY = useSharedValue(30);

    // ── Visibility tracking (same pattern as DepartmentsEvents) ──
    const [isSectionVisible, setIsSectionVisible] = useState(true);
    const sectionYShared = useSharedValue(0);
    const sectionHeightShared = useSharedValue(0);

    useAnimatedReaction(
        () => {
            if (!scrollY) return true;
            const y = scrollY.value;
            const sY = sectionYShared.value;
            const sH = sectionHeightShared.value;
            return (y + SCREEN_HEIGHT > sY + 100) && (y < sY + sH - 100);
        },
        (visible, prev) => {
            if (visible !== prev) {
                runOnJS(setIsSectionVisible)(visible);
            }
        },
        [scrollY],
    );

    const handleSectionLayout = useCallback((e: any) => {
        const { y, height } = e.nativeEvent.layout;
        sectionYShared.value = y;
        sectionHeightShared.value = height;
    }, [sectionYShared, sectionHeightShared]);

    useEffect(() => {
        enterOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        enterTranslateY.value = withSpring(0, { damping: 14, stiffness: 100 });
    }, []);

    const entranceStyle = useAnimatedStyle(() => ({
        opacity: enterOpacity.value,
        transform: [{ translateY: enterTranslateY.value }],
    }));

    const [isSponsorModalVisible, setSponsorModalVisible] = useState(false);

    const openModal = useCallback(() => setSponsorModalVisible(true), []);
    const closeModal = useCallback(() => setSponsorModalVisible(false), []);

    const billsPaused = !isSectionVisible;

    return (
        <Animated.View style={entranceStyle}>
        <View className="w-full pb-8" onLayout={handleSectionLayout}>

            {/* ── Section A: Prize Pool Card ── */}
            <View className="bg-[#E8EAF6] rounded-3xl p-8 items-center relative overflow-hidden border-[3px] border-black shadow-sm mb-6">
                {MONEY_BILL_CONFIGS.map((bill, index) => (
                    <MoneyBill
                        key={index}
                        delay={bill.delay}
                        startX={bill.startX}
                        drift={bill.drift}
                        size={bill.size}
                        opacity={bill.opacity}
                        fallDuration={bill.fallDuration}
                        paused={billsPaused}
                    />
                ))}

                <View className="z-10">
                    <View className="items-center mb-4">
                        <Text
                            className={`leading-[50px] text-black ${IS_SMALL ? 'text-[30px]' : 'text-[50px]'}`}
                            style={S.fontBBH}
                        >
                            200K+
                        </Text>
                        <Text
                            className={`leading-[50px] text-black -mt-2 ${IS_SMALL ? 'text-[30px]' : 'text-[50px]'}`}
                            style={S.fontBBH}
                        >
                            INR
                        </Text>
                        <Text
                            className="text-xl text-black mt-1 tracking-widest uppercase"
                            style={S.fontGilton}
                        >
                            IN PRIZE POOL
                        </Text>
                    </View>
                    <Text
                        className="text-gray-800 text-center uppercase text-sm tracking-wide"
                        style={S.fontSoftura}
                    >
                        GOODIES, MERCHES &{'\n'}MANY MORE...
                    </Text>
                </View>
            </View>

            {/* ── Section A.5: Signifiya Buddy Card ── */}
            <View
                className="bg-[#D1FAE5] rounded-3xl pt-10 pb-8 px-8 items-center justify-center relative overflow-hidden border-[3px] border-black mb-8"
                style={S.buddyShadow}
            >
                <Animated.View entering={FadeInDown.delay(200).springify()} className="items-center w-full z-10">

                    {/* Title */}
                    <View className="items-center mb-10">
                        <Text
                            style={S.fontGilton}
                            className={`text-black uppercase tracking-tight ${IS_SMALL ? 'text-4xl' : 'text-6xl'}`}
                        >
                            Signifiya
                        </Text>
                        <Text
                            style={S.fontGilton}
                            className={`text-black uppercase -mt-2 ${IS_SMALL ? 'text-4xl' : 'text-6xl'}`}
                        >
                            Buddy
                        </Text>
                    </View>

                    {/* Prize boxes */}
                    <View className="w-full items-center gap-6">

                        {/* 1st Prize */}
                        <View>
                            <View style={S.prize1stShadow} />
                            <View className="bg-white border-[3px] border-black items-center justify-center" style={S.prize1stBox}>
                                <ExpoImage source={require('../../assets/Prizes/1st.webp')} style={S.prize1stImg} contentFit="contain" />
                                <Text style={S.fontSoftura} className="text-sm font-bold text-black uppercase mt-2">1st Prize</Text>
                            </View>
                        </View>

                        {/* 2nd & 3rd Prize row */}
                        <View className="flex-row gap-6 w-full justify-center">
                            <View>
                                <View style={S.prize23Shadow} />
                                <View className="bg-white border-[3px] border-black items-center justify-center" style={S.prize23Box}>
                                    <ExpoImage source={require('../../assets/Prizes/2nd.webp')} style={S.prize23Img} contentFit="contain" />
                                    <Text style={S.fontSoftura} className="text-xs font-bold text-black uppercase mt-1">2nd Prize</Text>
                                </View>
                            </View>
                            <View>
                                <View style={S.prize23Shadow} />
                                <View className="bg-white border-[3px] border-black items-center justify-center" style={S.prize23Box}>
                                    <ExpoImage source={require('../../assets/Prizes/3rd.webp')} style={S.prize23Img} contentFit="contain" />
                                    <Text style={S.fontSoftura} className="text-xs font-bold text-black uppercase mt-1">3rd Prize</Text>
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
                        <Text className={`text-black ${IS_SMALL ? 'text-4xl' : 'text-5xl'}`} style={S.fontGilton}>CURRENT</Text>
                        <Text className={`text-black -mt-2 ${IS_SMALL ? 'text-4xl' : 'text-5xl'}`} style={S.fontGilton}>SPONSORS</Text>
                    </View>
                    <Text className="text-gray-500 text-lg mt-1 text-center" style={S.fontSoftura}>
                        Powered by the best in the industry
                    </Text>
                </View>

                {/* Sponsor Logo Grid */}
                <View className="flex-row flex-wrap justify-center mb-8" style={S.sponsorGridGap}>
                    {SPONSORS.map((sponsor, index) => (
                        <SponsorCard key={index} logo={sponsor.logo} />
                    ))}
                </View>

                {/* Horizontal separator */}
                <View className="w-full h-[3px] bg-black mb-8" />

                {/* Community Partners */}
                <View className="items-center mb-10">
                    <Text className="text-black text-4xl uppercase" style={S.fontGilton}>COMMUNITY</Text>
                    <Text className="text-black text-4xl uppercase -mt-2" style={S.partnersSkew}>PARTNERS</Text>
                </View>

                <View className="items-center gap-12 mb-10">
                    {COMMUNITY_PARTNERS.map((partner, index) => (
                        <PartnerCard key={index} logo={partner.logo} />
                    ))}
                </View>

                {/* CTA Button */}
                <SmoothButton
                    onPress={openModal}
                    containerStyle={S.ctaContainer}
                    buttonStyle="bg-black py-4 rounded-full items-center"
                    shadowStyle="bg-black rounded-full"
                    depth={1}
                >
                    <Text className="text-white text-lg" style={S.fontSoftura}>BECOME A SPONSOR</Text>
                </SmoothButton>

                {/* Conditional mount — zero overhead when hidden */}
                {isSponsorModalVisible && (
                    <SponsorModal visible={isSponsorModalVisible} onClose={closeModal} />
                )}
            </View>
        </View>
        </Animated.View>
    );
};

export default React.memo(PrizesSponsors);
