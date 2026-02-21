import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import SmoothButton from './ui/SmoothButton';
import SponsorModal from './SponsorModal';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

// ─── Static constants (module scope) ────────────────────────────────────────────
const FONT_HEADING = 'BBHBartle';
const FONT_BODY = 'Softura';
const FONT_COPYRIGHT = 'Gilton';

const MENU_ITEMS = ['HOME', 'BECOME A SPONSOR', 'EVENTS', 'CONTACT', 'FAQ', 'RULES & REGULATIONS'] as const;

const S = StyleSheet.create({
    fontHeading: { fontFamily: FONT_HEADING },
    fontBody: { fontFamily: FONT_BODY },
    fontCopyright: { fontFamily: FONT_COPYRIGHT },
    playStoreImg: { width: 32, height: 32 },
    btnContainer: { minWidth: isSmallDevice ? 200 : 230 },
});

// ─── Bundled PlayStore icon (no network request) ────────────────────────────────
const PLAYSTORE_SOURCE = require('../../assets/icons/playstore.webp');

const PlayStoreIcon = React.memo(() => (
    <Image
        source={PLAYSTORE_SOURCE}
        style={S.playStoreImg}
        contentFit="contain"
        cachePolicy="memory-disk"
    />
));

// ─── Apple icon (memoized SVG — parsed once) ────────────────────────────────────
const AppleIcon = React.memo(() => (
    <Svg width={28} height={28} viewBox="0 0 384 512" fill="black">
        <Path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </Svg>
));

// ─── AppStoreButton (memoized) ──────────────────────────────────────────────────
const AppStoreButton = React.memo(({ storeName, icon }: { storeName: string; icon: React.ReactNode }) => (
    <SmoothButton
        containerStyle={S.btnContainer}
        buttonStyle="bg-white border-[3px] border-black rounded-xl px-4 py-3 flex-row items-center gap-3"
        shadowStyle="bg-black rounded-xl"
        depth={6}
    >
        <View className="w-9 h-9 items-center justify-center">
            {icon}
        </View>
        <View className="flex-1">
            <Text className="text-[#00000] text-[9px] uppercase" style={S.fontBody}>COMING SOON !</Text>
            <Text className="text-black text-base leading-4" style={S.fontBody}>{storeName}</Text>
        </View>
    </SmoothButton>
));

// ─── MenuItem (memoized — stable onPress) ───────────────────────────────────────
const MenuItem = React.memo(({ label, onPress }: { label: string; onPress?: () => void }) => (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <Text
            className={`${isSmallDevice ? 'text-lg' : 'text-xl'} text-black uppercase`}
            style={S.fontBody}
        >
            {label}
        </Text>
    </TouchableOpacity>
));

const FooterSection = React.memo(() => {
    const [isSponsorModalVisible, setSponsorModalVisible] = useState(false);
    const handleCloseSponsorModal = useCallback(() => setSponsorModalVisible(false), []);
    const handleOpenSponsorModal = useCallback(() => setSponsorModalVisible(true), []);

    // Pre-bind all menu press handlers (stable across renders)
    const menuPressHandlers = useMemo(() => {
        const handlers: Record<string, (() => void) | undefined> = {};
        MENU_ITEMS.forEach((item) => {
            handlers[item] = item === 'BECOME A SPONSOR' ? () => setSponsorModalVisible(true) : undefined;
        });
        return handlers;
    }, []);

    const enterOpacity = useSharedValue(0);
    const enterTranslateY = useSharedValue(30);

    useEffect(() => {
        enterOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        enterTranslateY.value = withSpring(0, { damping: 14, stiffness: 100 });
    }, []);

    const entranceStyle = useAnimatedStyle(() => ({
        opacity: enterOpacity.value,
        transform: [{ translateY: enterTranslateY.value }],
    }));

    return (
        <Animated.View style={entranceStyle}>
        <View className="bg-[#4ADE80] rounded-t-[30px] px-6 pt-5 pb-10 mt-6 z-10">

            {/* Header */}
            <View className="mb-6">
                <Text className={`${isSmallDevice ? 'text-xl' : 'text-2xl'} text-black leading-tight uppercase`}
                    style={S.fontHeading}>DOWNLOAD THE</Text>
                <Text className={`${isSmallDevice ? 'text-xl' : 'text-2xl'} text-black leading-tight uppercase`}
                    style={S.fontHeading}>SIGNIFIYA</Text>
                <Text className={`${isSmallDevice ? 'text-xl' : 'text-2xl'} text-black leading-tight uppercase`}
                    style={S.fontHeading}>APP</Text>
                <Text className={`${isSmallDevice ? 'text-xl' : 'text-2xl'} text-black leading-tight uppercase`}
                    style={S.fontHeading}>RIGHT NOW.</Text>
            </View>

            {/* App Buttons */}
            <View className="gap-3 mb-6 self-start">
                <AppStoreButton storeName="Google Play" icon={<PlayStoreIcon />} />
                <AppStoreButton storeName="App Store" icon={<AppleIcon />} />
            </View>

            {/* Main Menu — stable per-item handlers */}
            <View className="gap-2 mb-8">
                {MENU_ITEMS.map((item) => (
                    <MenuItem key={item} label={item} onPress={menuPressHandlers[item]} />
                ))}
            </View>

            {isSponsorModalVisible && (
                <SponsorModal visible={isSponsorModalVisible} onClose={handleCloseSponsorModal} />
            )}

            {/* Footer Area */}
            <View className="relative">
                <View className="gap-1 mb-6">
                    <TouchableOpacity><Text className="text-xs text-black" style={S.fontBody}>ASSETS</Text></TouchableOpacity>
                    <TouchableOpacity><Text className="text-xs text-black" style={S.fontBody}>PRIVACY NOTICE</Text></TouchableOpacity>
                    <TouchableOpacity><Text className="text-xs text-black" style={S.fontBody}>TERMS OF SERVICE</Text></TouchableOpacity>
                </View>

                <Text className={`${isSmallDevice ? 'text-base' : 'text-lg'} text-black mb-2`}
                    style={S.fontCopyright}>© 2026 SIGNIFIYA, SOET.</Text>
            </View>

        </View>
        {/* Green extension to cover any black gap below */}
        <View className="bg-[#4ADE80] h-40" />
        </Animated.View>
    );
});

export default FooterSection;
