import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Volume2, VolumeX, ArrowLeft, ArrowRight } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedReaction,
    withRepeat,
    withTiming,
    withSpring,
    Easing,
    interpolate,
    runOnJS,
    SharedValue,
    Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { VideoView, useVideoPlayer } from 'expo-video';
import Carousel from 'react-native-reanimated-carousel';
import { EVENTS_DATA, EventData } from '../data/EventsData';
import SmoothButton from './ui/SmoothButton';
import MusicService from '../services/MusicService';
import { useMusicDispatch } from '../context/MusicContext';
import { Image } from 'expo-image';
import { useIsFocused, useNavigation } from '@react-navigation/native';

// ─── Constants (hoisted outside render — zero per-render cost) ─────────────────
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_SMALL = SCREEN_WIDTH < 380;
const CARD_WIDTH = SCREEN_WIDTH * 0.78;
const CARD_HEIGHT = IS_SMALL ? 580 : 640;
const CAROUSEL_MIN_HEIGHT = IS_SMALL ? 620 : 720;
const MEDIA_HEIGHT = IS_SMALL ? 220 : 280;
const FILTERS = ['ALL', 'ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'] as const;
const MARQUEE_TEXT = "EVENTS ★ ★ SOET ★ ★ ";
const DOT_HIT_SLOP = { top: 10, bottom: 10, left: 5, right: 5 } as const;

const FONTS = {
    HEADER: 'Gilton',
    TITLE: 'Gilton',
    DATE: 'Softura',
    PRIZE: 'Softura',
    DESC: 'Softura',
    FILTER: 'Gilton',
    BADGE: 'Gilton',
    BUTTON: 'Gilton',
} as const;

// ─── StyleSheet (created once, shared by all instances) ────────────────────────
const S = StyleSheet.create({
    // Marquee
    marqueeRow: { flexDirection: 'row', width: 2000 },
    marqueeRotation: { transform: [{ rotate: '-1deg' }] },
    // About SOET card
    aboutCardPad: { padding: 24 },
    aboutHeaderAlign: { alignSelf: 'flex-end', marginRight: 8 },
    // Events section
    eventsOverflow: { overflow: 'hidden' },
    // Carousel container
    carouselMinH: { minHeight: CAROUSEL_MIN_HEIGHT },
    containerCenter: { alignItems: 'center' },
    // Custom item
    customItemRoot: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    customItemInner: { width: CARD_WIDTH, height: '100%' as any, alignItems: 'center', paddingBottom: 12 },
    // Card
    cardMediaWrap: { height: MEDIA_HEIGHT, marginBottom: -5, borderTopLeftRadius: 29, borderTopRightRadius: 29 },
    cardBackface: { backfaceVisibility: 'hidden' },
    cardBottomLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'black' },
    cardInfo: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
    cardInfoInner: { alignItems: 'center', width: '100%' as any },
    // Mute button
    muteContainer: { position: 'absolute', bottom: 16, right: 16, zIndex: 20 },
    // Full size helper
    full: { width: '100%' as any, height: '100%' as any },
    // Font styles (static — avoid inline objects)
    fontGilton: { fontFamily: 'Gilton' },
    fontSoftura: { fontFamily: 'Softura' },
    headerFontPad: { fontFamily: FONTS.HEADER, paddingRight: 10 },
    descFont: { fontFamily: FONTS.DESC },
    titleFont: { fontFamily: FONTS.TITLE, fontSize: IS_SMALL ? 24 : 30 },
    dateFont: { fontFamily: FONTS.DATE, fontSize: IS_SMALL ? 14 : 18 },
    prizeLabel: { fontFamily: FONTS.PRIZE },
    prizeValue: { fontFamily: FONTS.PRIZE },
    descSmall: { fontFamily: FONTS.DESC, fontSize: IS_SMALL ? 12 : 14 },
    badgeFont: { fontFamily: FONTS.BADGE },
    buttonFont: { fontFamily: FONTS.BUTTON, fontSize: IS_SMALL ? 11 : 13 },
    filterFont: { fontFamily: FONTS.FILTER },
});

// ─── Nav Button (fully static, memoized) ───────────────────────────────────────
const LeftNavStyle = { position: 'absolute' as const, left: 0, top: '50%' as any, transform: [{ translateY: -24 }], zIndex: 50 };
const RightNavStyle = { position: 'absolute' as const, right: 0, top: '50%' as any, transform: [{ translateY: -24 }], zIndex: 50 };

const NavButton = React.memo(({ direction, onPress }: { direction: 'left' | 'right'; onPress: () => void }) => (
    <SmoothButton
        onPress={onPress}
        containerStyle={direction === 'left' ? LeftNavStyle : RightNavStyle}
        buttonStyle="w-12 h-12 bg-white rounded-full border-[3px] border-black items-center justify-center"
        shadowStyle="bg-black rounded-full"
        depth={4}
    >
        {direction === 'left' ? <ArrowLeft size={24} color="black" strokeWidth={3} /> : <ArrowRight size={24} color="black" strokeWidth={3} />}
    </SmoothButton>
));

// ─── Pagination Dot (pure UI-thread animation) ────────────────────────────────
const PaginationDot = React.memo(({ index, scrollProgress, length, onPress }: {
    index: number; scrollProgress: SharedValue<number>; length: number; onPress: () => void;
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        const cur = Math.abs(scrollProgress.value) % length;
        let dist = Math.abs(cur - index);
        if (dist > length / 2) dist = length - dist;
        return {
            width: interpolate(dist, [0, 1], [32, 8], Extrapolation.CLAMP),
            opacity: interpolate(dist, [0, 1], [1, 0.3], Extrapolation.CLAMP),
            backgroundColor: dist < 0.5 ? 'black' : '#D1D5DB',
        };
    });
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} hitSlop={DOT_HIT_SLOP}>
            <Animated.View className="h-2 rounded-full" style={animatedStyle} />
        </TouchableOpacity>
    );
});

// ─── Video Event Card (only mounted for cards with videoUrl) ───────────────────
interface VideoCardProps {
    videoUrl: string;
    isActive: boolean;
    onVideoPlay: () => void;
    onVideoStop: () => void;
}
const VideoMedia = React.memo(({ videoUrl, isActive, onVideoPlay, onVideoStop }: VideoCardProps) => {
    const [isMuted, setIsMuted] = useState(true);

    const player = useVideoPlayer(videoUrl, (p) => {
        p.loop = true;
        p.muted = true;
    });

    useEffect(() => {
        if (isActive) {
            player.play();
        } else {
            player.pause();
            player.currentTime = 0;
            if (!isMuted) {
                player.muted = true;
                setIsMuted(true);
                onVideoStop();
            }
        }
    }, [isActive]);

    const toggleMute = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsMuted(prev => {
            const newMuted = !prev;
            player.muted = newMuted;
            if (!newMuted) onVideoPlay();
            else onVideoStop();
            return newMuted;
        });
    }, [player, onVideoPlay, onVideoStop]);

    return (
        <View style={S.full}>
            <VideoView player={player} style={S.full} contentFit="cover" nativeControls={false} />
            <SmoothButton
                onPress={toggleMute}
                containerStyle={S.muteContainer}
                buttonStyle="bg-black/60 rounded-full w-10 h-10 items-center justify-center border border-white/20"
                depth={0}
            >
                {isMuted ? <VolumeX size={18} color="white" /> : <Volume2 size={18} color="white" />}
            </SmoothButton>
        </View>
    );
});

// ─── Image Media (no video overhead) ───────────────────────────────────────────
const ImageMedia = React.memo(({ imageUrl }: { imageUrl: any }) => {
    const source = useMemo(() => {
        if (typeof imageUrl === 'string' && (imageUrl.startsWith('http') || imageUrl.startsWith('https'))) {
            return { uri: imageUrl };
        }
        return imageUrl;
    }, [imageUrl]);

    return (
        <View style={S.full}>
            <Image source={source} style={S.full} contentFit="cover" transition={200} cachePolicy="memory-disk" />
        </View>
    );
});

// ─── Placeholder Media ─────────────────────────────────────────────────────────
const PlaceholderMedia = React.memo(({ color }: { color: string }) => {
    const bg = useMemo(() => ({ backgroundColor: color }), [color]);
    return (
        <View className="w-full h-full items-center justify-center" style={bg}>
            <Text className="text-black font-bold opacity-20">POSTER GOES HERE</Text>
        </View>
    );
});

// ─── Event Card (split media — no video player for image-only cards) ───────────
interface EventCardProps {
    title: string;
    date: string;
    category: string;
    description: string;
    prizePool: string;
    imageColor: string;
    buttonColor: string;
    imageUrl?: any;
    videoUrl?: string;
    isActive: boolean;
    onVideoPlay: () => void;
    onVideoStop: () => void;
    onRegisterPress: () => void;
    onViewDetailsPress: () => void;
}

const EventCard = React.memo(({ title, date, category, description, prizePool, imageColor, buttonColor, imageUrl, videoUrl, isActive, onVideoPlay, onVideoStop, onRegisterPress, onViewDetailsPress }: EventCardProps) => {
    const detailButtonBg = useMemo(() => ({ backgroundColor: buttonColor }), [buttonColor]);

    const handleViewDetails = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onViewDetailsPress();
    }, [onViewDetailsPress]);

    return (
        <View className="relative w-full h-full">
            <View className="absolute top-2 left-2 w-full h-full bg-black rounded-[32px]" />
            <View className="bg-black border-[3px] border-black rounded-[32px] overflow-hidden w-full h-full" style={S.cardBackface}>
                {/* Media Area */}
                <View className="relative w-full bg-black overflow-hidden" style={S.cardMediaWrap}>
                    <View className="absolute inset-0 w-full h-full bg-black">
                        {videoUrl ? (
                            <VideoMedia videoUrl={videoUrl} isActive={isActive} onVideoPlay={onVideoPlay} onVideoStop={onVideoStop} />
                        ) : imageUrl ? (
                            <ImageMedia imageUrl={imageUrl} />
                        ) : (
                            <PlaceholderMedia color={imageColor} />
                        )}
                    </View>
                    <View style={S.cardBottomLine} pointerEvents="none" />
                    <View className="absolute top-4 right-4 bg-black px-4 py-2 rounded-full border-2 border-white/20">
                        <Text className="text-white text-[10px] tracking-widest uppercase" style={S.badgeFont}>{category}</Text>
                    </View>
                </View>

                {/* Info Area */}
                <View className={`bg-white ${IS_SMALL ? 'p-3' : 'p-5'}`} style={S.cardInfo}>
                    <View style={S.cardInfoInner}>
                        <Text className="text-black uppercase leading-8 mb-1 text-center" style={S.titleFont} numberOfLines={2}>{title}</Text>
                        <Text className="text-[#8e99af] mb-3 text-center" style={S.dateFont}>{date}</Text>
                        <View className={`bg-[#B9F6CA] rounded-full border-black mb-4 ${IS_SMALL ? 'px-3 py-1' : 'px-4 py-1.5'}`}>
                            <Text className="text-black text-xs text-center" style={S.prizeLabel}>Prize pool: <Text style={S.prizeValue}>{prizePool}</Text></Text>
                        </View>
                        <Text className="text-black/80 text-sm leading-5 mb-4 text-center px-2" style={S.descSmall} numberOfLines={3}>{description}</Text>
                    </View>
                    <View className={`gap-4 w-full ${IS_SMALL ? 'mt-1' : 'mt-4'}`}>
                        <SmoothButton onPress={handleViewDetails} buttonStyle={`border-[3px] border-black rounded-2xl items-center ${IS_SMALL ? 'py-3' : 'py-4'}`} innerButtonStyle={detailButtonBg} shadowStyle="bg-black rounded-2xl" depth={6}>
                            <Text className="text-black uppercase tracking-widest" style={S.buttonFont}>VIEW DETAILS</Text>
                        </SmoothButton>
                        <SmoothButton onPress={onRegisterPress} buttonStyle={`bg-black rounded-2xl items-center ${IS_SMALL ? 'py-3' : 'py-4'}`} shadowStyle="bg-black rounded-2xl" depth={6}>
                            <Text className="text-white uppercase tracking-widest" style={S.buttonFont}>REGISTER</Text>
                        </SmoothButton>
                    </View>
                </View>
            </View>
        </View>
    );
});

// ─── CustomItem wrapper (carousel animation isolation) ─────────────────────────
const CustomItem = React.memo(({ item, animationValue, isActive, onVideoPlay, onVideoStop, onRegisterPress, onViewDetailsPress }: {
    item: EventData; animationValue: SharedValue<number>; isActive: boolean;
    onVideoPlay: () => void; onVideoStop: () => void; onRegisterPress: () => void; onViewDetailsPress: () => void;
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(animationValue.value, [-1, 0, 1], [0.9, 1, 0.9], Extrapolation.CLAMP);
        const opacity = interpolate(animationValue.value, [-1, 0, 1], [0.7, 1, 0.7], Extrapolation.CLAMP);
        return { transform: [{ scale }], opacity, zIndex: isActive ? 10 : 1 };
    });

    return (
        <Animated.View style={[S.customItemRoot, animatedStyle]}>
            <View style={S.customItemInner}>
                <EventCard
                    title={item.title}
                    date={item.date}
                    category={item.category}
                    description={item.description}
                    prizePool={item.prizePool}
                    imageColor={item.imageColor}
                    buttonColor={item.buttonColor}
                    imageUrl={item.imageUrl}
                    videoUrl={item.videoUrl}
                    isActive={isActive}
                    onVideoPlay={onVideoPlay}
                    onVideoStop={onVideoStop}
                    onRegisterPress={onRegisterPress}
                    onViewDetailsPress={onViewDetailsPress}
                />
            </View>
        </Animated.View>
    );
});

// ─── Main Component ────────────────────────────────────────────────────────────
const DepartmentsEvents = ({ scrollY }: { scrollY?: SharedValue<number> }) => {
    // Entrance animation
    const enterOpacity = useSharedValue(0);
    const enterTranslateY = useSharedValue(30);

    const { setIsPlaying: setGlobalMusicPlaying } = useMusicDispatch();
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    // State
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
    const [textWidth, setTextWidth] = useState(0);

    // Ref-based index — avoids full tree re-render on every snap
    const currentIndexRef = useRef(0);
    // We only need a state-based index for the isActive derivation when it actually changes
    const [activeSnapIndex, setActiveSnapIndex] = useState(0);

    // Visibility tracking — layout values stored as refs (not state)
    const sectionYRef = useRef(0);
    const sectionHeightRef = useRef(0);
    const [isSectionVisible, setIsSectionVisible] = useState(true);

    const translateX = useSharedValue(0);
    const scrollProgress = useSharedValue(0);

    // Animation shared values
    const containerOpacity = useSharedValue(1);
    const containerScale = useSharedValue(1);
    const containerTranslateY = useSharedValue(0);

    const carouselRef = useRef<any>(null);

    // Entrance
    useEffect(() => {
        enterOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        enterTranslateY.value = withSpring(0, { damping: 14, stiffness: 100 });
    }, []);

    const entranceStyle = useAnimatedStyle(() => ({
        opacity: enterOpacity.value,
        transform: [{ translateY: enterTranslateY.value }],
    }));

    // ─── Visibility (useAnimatedReaction — fires ONLY when threshold flips) ────
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

    // Sync layout measurements → shared values (one-shot, not per-frame)
    const handleSectionLayout = useCallback((e: any) => {
        const { y, height } = e.nativeEvent.layout;
        sectionYRef.current = y;
        sectionHeightRef.current = height;
        sectionYShared.value = y;
        sectionHeightShared.value = height;
    }, [sectionYShared, sectionHeightShared]);

    // Marquee
    useEffect(() => {
        if (textWidth > 0) {
            translateX.value = withRepeat(
                withTiming(-textWidth, { duration: 4000, easing: Easing.linear }),
                -1, false,
            );
        }
    }, [textWidth]);

    const marqueeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handleTextLayout = useCallback((e: any) => setTextWidth(e.nativeEvent.layout.width), []);

    // Filtered events (memoized)
    const filteredEvents = useMemo(() =>
        selectedCategory === 'ALL'
            ? EVENTS_DATA
            : EVENTS_DATA.filter(event => event.category === selectedCategory),
        [selectedCategory],
    );

    // ─── Filter change (animated transition, NO key-based remount) ─────────────
    const handleFilterChange = useCallback((filter: string) => {
        if (filter === activeFilter) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setActiveFilter(filter);

        // EXIT animation
        containerOpacity.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) });
        containerScale.value = withTiming(0.95, { duration: 200, easing: Easing.out(Easing.quad) });
        containerTranslateY.value = withTiming(10, { duration: 200, easing: Easing.out(Easing.quad) }, () => {
            runOnJS(applyFilter)(filter);
        });
    }, [activeFilter, containerOpacity, containerScale, containerTranslateY]);

    const applyFilter = useCallback((filter: string) => {
        setSelectedCategory(filter);
        currentIndexRef.current = 0;
        setActiveSnapIndex(0);
        scrollProgress.value = 0;
        containerTranslateY.value = -10;

        if (carouselRef.current) carouselRef.current.scrollTo({ index: 0, animated: false });

        requestAnimationFrame(() => {
            containerOpacity.value = withTiming(1, { duration: 300 });
            containerScale.value = withSpring(1, { damping: 15, stiffness: 120 });
            containerTranslateY.value = withSpring(0, { damping: 15, stiffness: 120 });
        });
    }, [containerOpacity, containerScale, containerTranslateY, scrollProgress]);

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
        transform: [
            { scale: containerScale.value },
            { translateY: containerTranslateY.value },
        ],
    }));

    // ─── Carousel snap handler (ref + batched setState) ────────────────────────
    const handleSnapToItem = useCallback((index: number) => {
        currentIndexRef.current = index;
        setActiveSnapIndex(index);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    const handleProgressChange = useCallback((_: number, abs: number) => {
        scrollProgress.value = abs;
    }, [scrollProgress]);

    // Audio handlers
    const handleVideoPlay = useCallback(async () => {
        if (MusicService.isPlaying()) {
            await MusicService.pauseMusic();
            setGlobalMusicPlaying(false);
        }
    }, [setGlobalMusicPlaying]);

    const handleVideoStop = useCallback(async () => {
        if (!MusicService.isPlaying()) {
            await MusicService.resumeMusic();
            setGlobalMusicPlaying(true);
        }
    }, [setGlobalMusicPlaying]);

    const handleRegister = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        (navigation as any).navigate('EventRegistration');
    }, [navigation]);

    const handleViewDetails = useCallback(() => {
        (navigation as any).navigate('Main', { screen: 'Events' });
    }, [navigation]);

    // Container width callback
    const handleContainerLayout = useCallback((e: any) => setContainerWidth(e.nativeEvent.layout.width), []);

    // Nav callbacks (stable refs)
    const scrollPrev = useCallback(() => carouselRef.current?.scrollTo({ count: -1, animated: true }), []);
    const scrollNext = useCallback(() => carouselRef.current?.scrollTo({ count: 1, animated: true }), []);

    // renderItem — memoized, uses ref-based active index
    const renderItem = useCallback(({ item, index, animationValue }: { item: EventData; index: number; animationValue: SharedValue<number> }) => (
        <CustomItem
            item={item}
            animationValue={animationValue}
            isActive={index === activeSnapIndex && isSectionVisible && isFocused}
            onVideoPlay={handleVideoPlay}
            onVideoStop={handleVideoStop}
            onRegisterPress={handleRegister}
            onViewDetailsPress={handleViewDetails}
        />
    ), [activeSnapIndex, isSectionVisible, isFocused, handleVideoPlay, handleVideoStop, handleRegister, handleViewDetails]);

    // Pagination dot press generators (stable per-index)
    const dotPressHandlers = useMemo(() =>
        filteredEvents.map((_, i) => () => carouselRef.current?.scrollTo({ index: i, animated: true })),
        [filteredEvents.length],
    );

    return (
        <Animated.View style={entranceStyle}>
            <View className="w-full">
                {/* ABOUT SOET */}
                <View className="bg-[#E3F2FD] rounded-[30px] border-[3px] border-black pb-6 relative mb-4" style={S.aboutCardPad}>
                    <View className="absolute top-6 left-6 bg-red-400 p-2 rounded-full border-2 border-black">
                        <Star color="black" fill="black" size={20} />
                    </View>
                    <View className="mb-4 mt-2">
                        <View className="flex-row" style={S.aboutHeaderAlign}>
                            <Text className="text-4xl text-black" style={S.fontGilton}>ABOUT </Text>
                            <Text className="text-4xl text-black" style={S.fontGilton}>SOET</Text>
                        </View>
                    </View>
                    <Text className="text-black text-center leading-7 p-4 pl-4 text-lg" style={S.fontSoftura}>
                        The School of Engineering and Technology stands as a beacon of technical excellence, fostering innovation and shaping the future engineers who will build tomorrow's world.
                    </Text>
                </View>

                {/* MARQUEE */}
                <View className="bg-[#FFEB3B] border-[3px] border-black py-3 overflow-hidden mb-4" style={S.marqueeRotation}>
                    <Animated.View style={[marqueeStyle, S.marqueeRow]}>
                        <Text onLayout={handleTextLayout} className="absolute opacity-0 font-[Gilton] text-black text-lg tracking-widest">{MARQUEE_TEXT}</Text>
                        {[...Array(6)].map((_, i) => <Text key={i} className="font-[Gilton] text-black text-lg tracking-widest">{MARQUEE_TEXT}</Text>)}
                    </Animated.View>
                </View>

                {/* EVENTS SECTION */}
                <View
                    className="bg-[#FFF8E1] border-[3px] border-black rounded-[30px] p-4 pb-10 min-h-[500px]"
                    style={S.eventsOverflow}
                    onLayout={handleSectionLayout}
                >
                    <View className="items-center my-6">
                        <Text className="text-4xl text-black mb-2" style={S.headerFontPad}>SIGNIFIYA</Text>
                        <Text className="text-4xl text-black" style={S.headerFontPad}>EVENTS</Text>
                        <Text className="text-gray-500 text-center mt-2 px-8" style={S.descFont}>Discover the diverse range of events happening at Signifiya'26.</Text>
                    </View>

                    {/* FILTERS */}
                    <View className="flex-row flex-wrap justify-center gap-2 mb-8">
                        {FILTERS.map((filter) => (
                            <SmoothButton
                                key={filter}
                                onPress={() => handleFilterChange(filter)}
                                buttonStyle={`px-4 py-2 rounded-full border-2 border-black ${activeFilter === filter ? 'bg-[#9d4edd]' : 'bg-white'}`}
                                shadowStyle="bg-black rounded-full"
                                depth={4}
                            >
                                <Text className={`text-[12px] uppercase tracking-wider ${activeFilter === filter ? 'text-white' : 'text-black'}`} style={S.filterFont}>{filter}</Text>
                            </SmoothButton>
                        ))}
                    </View>

                    {/* CAROUSEL — NO key={selectedCategory} — avoids full unmount/remount */}
                    <Animated.View style={[S.carouselMinH, containerAnimatedStyle]}>
                        {filteredEvents.length > 0 ? (
                            <View onLayout={handleContainerLayout} style={S.containerCenter}>
                                <View className="relative w-full items-center justify-center">
                                    <Carousel
                                        loop={true}
                                        ref={carouselRef}
                                        width={containerWidth}
                                        height={CARD_HEIGHT}
                                        autoPlay={false}
                                        data={filteredEvents}
                                        scrollAnimationDuration={600}
                                        onSnapToItem={handleSnapToItem}
                                        onProgressChange={handleProgressChange}
                                        windowSize={3}
                                        renderItem={renderItem}
                                    />
                                    <NavButton direction="left" onPress={scrollPrev} />
                                    <NavButton direction="right" onPress={scrollNext} />
                                </View>

                                {/* DOTS */}
                                {filteredEvents.length > 1 && (
                                    <View className="flex-row justify-center items-center mt-8 gap-2">
                                        {filteredEvents.map((_, index) => (
                                            <PaginationDot
                                                key={index}
                                                index={index}
                                                scrollProgress={scrollProgress}
                                                length={filteredEvents.length}
                                                onPress={dotPressHandlers[index]}
                                            />
                                        ))}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View className="items-center py-12">
                                <Text className="text-gray-400 text-lg">No events in this category yet!</Text>
                            </View>
                        )}
                    </Animated.View>
                </View>
            </View>
        </Animated.View>
    );
};

export default React.memo(DepartmentsEvents);
