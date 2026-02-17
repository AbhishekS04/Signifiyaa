import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Platform, UIManager, Dimensions, TouchableOpacity } from 'react-native';
import { Star, Volume2, VolumeX, ArrowLeft, ArrowRight } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    withDelay,
    Easing,
    interpolate,
    runOnJS,
    SharedValue,
    Extrapolation,
    useDerivedValue
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { VideoView, useVideoPlayer } from 'expo-video';
import Carousel from 'react-native-reanimated-carousel';
import { EVENTS_DATA } from '../data/EventsData';
import SmoothButton from './ui/SmoothButton';
import MusicService from '../services/MusicService';
import { useMusicContext } from '../context/MusicContext';
import { Image } from 'expo-image';
import { useIsFocused, useNavigation } from '@react-navigation/native';

// Enable LayoutAnimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height: screenHeight } = Dimensions.get('window');
const isSmallDevice = width < 380;

const SECTION_FONTS = {
    SECTION_HEADER: 'Gilton',
    EVENT_TITLE: 'Gilton',
    DATE: 'Softura',
    PRIZE_POOL_LABEL: 'Softura',
    PRIZE_POOL_VALUE: 'Softura',
    DESCRIPTION: 'Softura',
    FILTER_LABEL: 'Gilton',
    BADGE: 'Gilton',
    BUTTON: 'Gilton',
};


const DepartmentsEvents = ({ scrollY }: { scrollY?: SharedValue<number> }) => {
    // 🎵 Global Context & Focus
    const { isPlaying: isGlobalMusicPlaying, setIsPlaying: setGlobalMusicPlaying } = useMusicContext();
    const isFocused = useIsFocused(); // Track Tab Focus
    const navigation = useNavigation();

    // State
    const [activeFilter, setActiveFilter] = useState('ALL'); // Default to ALL
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [containerWidth, setContainerWidth] = useState(width);
    const [textWidth, setTextWidth] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Visibility Tracking
    const [sectionY, setSectionY] = useState(0);
    const [sectionHeight, setSectionHeight] = useState(0);
    const [isSectionVisible, setIsSectionVisible] = useState(true);

    const translateX = useSharedValue(0);
    const scrollProgress = useSharedValue(0);

    // 🎬 Animation Shared Values
    const containerOpacity = useSharedValue(1);
    const containerScale = useSharedValue(1);
    const containerTranslateY = useSharedValue(0); // Vertical Motion

    const carouselRef = useRef<any>(null);

    // ➕ Added 'ALL' to filters
    const filters = ['ALL', 'ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'];
    const MARQUEE_TEXT = "EVENTS ★ ★ SOET ★ ★ ";
    const CARD_WIDTH = width * 0.78;
    const CARD_HEIGHT = isSmallDevice ? 580 : 640;

    // 🕵️‍♂️ VISIBILITY LOGIC
    useDerivedValue(() => {
        if (!scrollY) return;
        const y = scrollY.value;
        const isVisible = (y + screenHeight > sectionY + 100) && (y < sectionY + sectionHeight - 100);
        runOnJS(setIsSectionVisible)(isVisible);
    }, [scrollY, sectionY, sectionHeight]);


    // Marquee
    useEffect(() => {
        if (textWidth > 0) {
            translateX.value = withRepeat(
                withTiming(-textWidth, { duration: 4000, easing: Easing.linear }),
                -1, false
            );
        }
    }, [textWidth]);

    const marqueeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    // 📂 Filter Logic: Handle 'ALL' case
    const filteredEvents = selectedCategory === 'ALL'
        ? EVENTS_DATA
        : EVENTS_DATA.filter(event => event.category === selectedCategory);

    // 🌟 POLISHED ANIMATION (Scale + Fade + Slide)
    const handleFilterChange = (filter: string) => {
        if (filter === activeFilter) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setActiveFilter(filter);

        // 1. EXIT: Shrink, Fade Out, Slide Down
        containerOpacity.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) });
        containerScale.value = withTiming(0.95, { duration: 200, easing: Easing.out(Easing.quad) });
        containerTranslateY.value = withTiming(10, { duration: 200, easing: Easing.out(Easing.quad) }, () => {
            runOnJS(updateCategoryData)(filter);
        });
    };

    const updateCategoryData = (filter: string) => {
        setSelectedCategory(filter);
        setCurrentIndex(0);
        scrollProgress.value = 0;

        // Reset Position for Entry (Start slightly above)
        containerTranslateY.value = -10;

        if (carouselRef.current) carouselRef.current.scrollTo({ index: 0, animated: false });

        // 2. ENTRY: Expand, Fade In, Slide Up (Spring)
        setTimeout(() => {
            containerOpacity.value = withTiming(1, { duration: 300 });
            containerScale.value = withSpring(1, { damping: 15, stiffness: 120 });
            containerTranslateY.value = withSpring(0, { damping: 15, stiffness: 120 });
        }, 50);
    };

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
        transform: [
            { scale: containerScale.value },
            { translateY: containerTranslateY.value }
        ]
    }));

    // Audio Handlers
    const handleVideoPlay = async () => {
        if (MusicService.isPlaying()) {
            await MusicService.pauseMusic();
            setGlobalMusicPlaying(false);
        }
    };

    const handleVideoStop = async () => {
        // Only resume if implied
        if (!MusicService.isPlaying()) {
            await MusicService.resumeMusic();
            setGlobalMusicPlaying(true);
        }
    };

    // Handler
    const handleRegister = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        (navigation as any).navigate('EventRegistration');
    };

    return (
        <View className="w-full">
            {/* ABOUT SOET */}
            <View className="bg-[#E3F2FD] rounded-[30px] border-[3px] border-black pb-6 relative mb-4" style={{ padding: 24 }}>
                <View className="absolute top-6 left-6 bg-red-400 p-2 rounded-full border-2 border-black"><Star color="black" fill="black" size={20} /></View>
                <View className="mb-4 mt-2">
                    <View className="flex-row" style={{ alignSelf: 'flex-end', marginRight: 8 }}>
                        <Text className="text-4xl text-black" style={{ fontFamily: 'Gilton' }}>ABOUT </Text>
                        <Text className="text-4xl text-black" style={{ fontFamily: 'Gilton' }}>SOET</Text>
                    </View>
                </View>
                <Text className="text-black text-center leading-7 text-base p-4 pl-4 text-lg" style={{ fontFamily: 'Softura' }}>
                    The School of Engineering and Technology stands as a beacon of technical excellence, fostering innovation and shaping the future engineers who will build tomorrow's world.
                </Text>
            </View>

            {/* MARQUEE */}
            <View className="bg-[#FFEB3B] border-[3px] border-black py-3 overflow-hidden mb-4" style={{ transform: [{ rotate: '-1deg' }] }}>
                <Animated.View style={[marqueeStyle, { flexDirection: 'row', width: 2000 }]}>
                    <Text onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)} className="absolute opacity-0 font-[Gilton] text-black text-lg tracking-widest">{MARQUEE_TEXT}</Text>
                    {[...Array(12)].map((_, i) => <Text key={i} className="font-[Gilton] text-black text-lg tracking-widest">{MARQUEE_TEXT}</Text>)}
                </Animated.View>
            </View>

            {/* EVENTS SECTION - Track Layout for Visibility */}
            <View
                className="bg-[#FFF8E1] border-[3px] border-black rounded-[30px] p-4 pb-10 min-h-[500px]"
                style={{ overflow: 'hidden' }}
                onLayout={(e) => {
                    // Capture layout header offset
                    setSectionY(e.nativeEvent.layout.y);
                    setSectionHeight(e.nativeEvent.layout.height);
                }}
            >
                <View className="items-center my-6">
                    <Text className="text-4xl text-black mb-2" style={{ fontFamily: SECTION_FONTS.SECTION_HEADER, paddingRight: 10 }}>SIGNIFIYA</Text>
                    <Text className="text-4xl text-black" style={{ fontFamily: SECTION_FONTS.SECTION_HEADER, paddingRight: 10 }}>EVENTS</Text>
                    <Text className="text-gray-500 text-center mt-2 px-8" style={{ fontFamily: SECTION_FONTS.DESCRIPTION }}>Discover the diverse range of events happening at Signifiya'26.</Text>
                </View>

                {/* FILTERS */}
                <View className="flex-row flex-wrap justify-center gap-2 mb-8">
                    {filters.map((filter) => (
                        <SmoothButton
                            key={filter}
                            onPress={() => handleFilterChange(filter)}
                            buttonStyle={`px-4 py-2 rounded-full border-2 border-black ${activeFilter === filter ? 'bg-[#9d4edd]' : 'bg-white'}`}
                            shadowStyle="bg-black rounded-full"
                            depth={4}
                        >
                            <Text className={`text-[12px] uppercase tracking-wider ${activeFilter === filter ? 'text-white' : 'text-black'}`} style={{ fontFamily: SECTION_FONTS.FILTER_LABEL }}>{filter}</Text>
                        </SmoothButton>
                    ))}
                </View>

                {/* CAROUSEL */}
                <Animated.View style={[{ minHeight: isSmallDevice ? 620 : 720 }, containerAnimatedStyle]}>
                    {filteredEvents.length > 0 ? (
                        <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} style={{ alignItems: 'center' }}>
                            <View className="relative w-full items-center justify-center">
                                <Carousel
                                    key={selectedCategory} // Key forces wipe clean if needed, but smooth update is better
                                    loop={true}
                                    ref={carouselRef}
                                    width={containerWidth}
                                    height={CARD_HEIGHT}
                                    autoPlay={false}
                                    data={filteredEvents}
                                    scrollAnimationDuration={600}
                                    onSnapToItem={(index) => {
                                        runOnJS(setCurrentIndex)(index);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                    onProgressChange={(_, absoluteProgress) => scrollProgress.value = absoluteProgress}
                                    windowSize={3}
                                    renderItem={({ item, index, animationValue }) => (
                                        <CustomItem
                                            item={item}
                                            animationValue={animationValue}
                                            // 🎯 PLAY LOGIC: Active Index + Section Visible + Screen Focused
                                            isActive={index === currentIndex && isSectionVisible && isFocused}
                                            width={CARD_WIDTH}
                                            onVideoPlay={handleVideoPlay}
                                            onVideoStop={handleVideoStop}
                                            onRegisterPress={handleRegister} // [NEW] Pass handler
                                        />
                                    )}
                                />

                                {/* ⏪ 3D ARROWS RESTORED & CENTERED */}
                                <NavButton direction="left" onPress={() => carouselRef.current?.scrollTo({ count: -1, animated: true })} />
                                <NavButton direction="right" onPress={() => carouselRef.current?.scrollTo({ count: 1, animated: true })} />
                            </View>

                            {/* DOTS (Simple) */}
                            {filteredEvents.length > 1 && (
                                <View className="flex-row justify-center items-center mt-8 gap-2">
                                    {filteredEvents.map((_, index) => (
                                        <PaginationDot
                                            key={index}
                                            index={index}
                                            scrollProgress={scrollProgress}
                                            length={filteredEvents.length}
                                            onPress={() => carouselRef.current?.scrollTo({ index, animated: true })}
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
    );
};

// CustomItem wrapper
const CustomItem = React.memo(({ item, animationValue, isActive, width, onVideoPlay, onVideoStop, onRegisterPress }: {
    item: any, animationValue: SharedValue<number>, isActive: boolean, width: number,
    onVideoPlay: () => void, onVideoStop: () => void, onRegisterPress: () => void
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(animationValue.value, [-1, 0, 1], [0.9, 1, 0.9], Extrapolation.CLAMP);
        const opacity = interpolate(animationValue.value, [-1, 0, 1], [0.7, 1, 0.7], Extrapolation.CLAMP);
        return { transform: [{ scale }], opacity, zIndex: isActive ? 10 : 1 };
    });

    return (
        <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, animatedStyle]}>
            <View style={{ width: width, height: '100%', alignItems: 'center', paddingBottom: 12 }}>
                <EventCard {...item} isActive={isActive} onVideoPlay={onVideoPlay} onVideoStop={onVideoStop} onRegisterPress={onRegisterPress} />
            </View>
        </Animated.View>
    );
});

// EventCard with Instant Image & Video Logic
const EventCard = React.memo(({ title, date, category, description, prizePool, imageColor, buttonColor, imageUrl, videoUrl, isActive, onVideoPlay, onVideoStop, onRegisterPress }: any) => {
    const [isMuted, setIsMuted] = useState(true);

    const player = useVideoPlayer(videoUrl || '', (player) => {
        player.loop = true;
        player.muted = true;
    });

    // ⚡ CONTROL PLAYBACK
    useEffect(() => {
        if (isActive) {
            player.play();
        } else {
            // STOP immediately if scrolled away or hidden
            player.pause();
            player.currentTime = 0;
            if (!isMuted) {
                // Determine if we need to release audio focus
                // If it was playing (unmuted), we stop it and tell parent to resume global
                player.muted = true;
                setIsMuted(true);
                onVideoStop();
            }
        }
    }, [isActive]);

    const toggleMute = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        player.muted = newMutedState;
        if (!newMutedState) onVideoPlay();
        else onVideoStop();
    };

    return (
        <View className="relative w-full h-full">
            <View className="absolute top-2 left-2 w-full h-full bg-black rounded-[32px]" />
            <View className="bg-black border-[3px] border-black rounded-[32px] overflow-hidden w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                <View className="relative w-full bg-black overflow-hidden" style={{ height: isSmallDevice ? 220 : 280, marginBottom: -5, borderTopLeftRadius: 29, borderTopRightRadius: 29 }}>
                    <View className="absolute inset-0 w-full h-full bg-black">
                        {videoUrl ? (
                            <View className="w-full h-full">
                                <VideoView player={player} style={{ width: '100%', height: '100%' }} contentFit="cover" nativeControls={false} />
                                <SmoothButton
                                    onPress={toggleMute}
                                    containerStyle={{ position: 'absolute', bottom: 16, right: 16, zIndex: 20 }}
                                    buttonStyle="bg-black/60 rounded-full w-10 h-10 items-center justify-center border border-white/20"
                                    depth={0}
                                >
                                    {isMuted ? <VolumeX size={18} color="white" /> : <Volume2 size={18} color="white" />}
                                </SmoothButton>
                            </View>
                        ) : imageUrl ? (
                            <View className="w-full h-full">
                                <Image
                                    source={
                                        typeof imageUrl === 'string' && (imageUrl.startsWith('http') || imageUrl.startsWith('https'))
                                            ? { uri: imageUrl }
                                            : imageUrl
                                    }
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                    transition={200}
                                    cachePolicy="memory-disk"
                                />
                            </View>
                        ) : (
                            <View className="w-full h-full items-center justify-center" style={{ backgroundColor: imageColor }}><Text className="text-black font-bold opacity-20">POSTER GOES HERE</Text></View>
                        )}
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'black' }} pointerEvents="none" />
                    <View className="absolute top-4 right-4 bg-black px-4 py-2 rounded-full border-2 border-white/20"><Text className="text-white text-[10px] tracking-widest uppercase" style={{ fontFamily: SECTION_FONTS.BADGE }}>{category}</Text></View>
                </View>

                <View className={`bg-white ${isSmallDevice ? 'p-3' : 'p-5'}`} style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Text className="text-black uppercase leading-8 mb-1 text-center" style={{ fontFamily: SECTION_FONTS.EVENT_TITLE, fontSize: isSmallDevice ? 24 : 30 }} numberOfLines={2}>{title}</Text>
                        <Text className="text-[#8e99af] mb-3 text-center" style={{ fontFamily: SECTION_FONTS.DATE, fontSize: isSmallDevice ? 14 : 18 }}>{date}</Text>
                        <View className={`bg-[#B9F6CA] rounded-full border-black mb-4 ${isSmallDevice ? 'px-3 py-1' : 'px-4 py-1.5'}`}><Text className="text-black text-xs text-center" style={{ fontFamily: SECTION_FONTS.PRIZE_POOL_LABEL }}>Prize pool: <Text style={{ fontFamily: SECTION_FONTS.PRIZE_POOL_VALUE }}>{prizePool}</Text></Text></View>
                        <Text className="text-black/80 text-sm leading-5 mb-4 text-center px-2" style={{ fontFamily: SECTION_FONTS.DESCRIPTION, fontSize: isSmallDevice ? 12 : 14 }} numberOfLines={3}>{description}</Text>
                    </View>
                    <View className={`gap-4 w-full ${isSmallDevice ? 'mt-1' : 'mt-4'}`}>
                        <SmoothButton onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)} buttonStyle={`border-[3px] border-black rounded-2xl items-center ${isSmallDevice ? 'py-3' : 'py-4'}`} innerButtonStyle={{ backgroundColor: buttonColor }} shadowStyle="bg-black rounded-2xl" depth={6}><Text className="text-black uppercase tracking-widest" style={{ fontFamily: SECTION_FONTS.BUTTON, fontSize: isSmallDevice ? 11 : 13 }}>VIEW DETAILS</Text></SmoothButton>
                        <SmoothButton onPress={() => onRegisterPress()} buttonStyle={`bg-black rounded-2xl items-center ${isSmallDevice ? 'py-3' : 'py-4'}`} shadowStyle="bg-black rounded-2xl" depth={6}><Text className="text-white uppercase tracking-widest" style={{ fontFamily: SECTION_FONTS.BUTTON, fontSize: isSmallDevice ? 11 : 13 }}>REGISTER</Text></SmoothButton>
                    </View>
                </View>
            </View>
        </View>
    );
});

const PaginationDot = React.memo(({ index, scrollProgress, length, onPress }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
        const currentScrollIndex = Math.abs(scrollProgress.value) % length;
        let dist = Math.abs(currentScrollIndex - index);
        if (dist > length / 2) dist = length - dist;
        const isActive = dist < 0.5;
        const width = interpolate(dist, [0, 1], [32, 8], Extrapolation.CLAMP);
        const opacity = interpolate(dist, [0, 1], [1, 0.3], Extrapolation.CLAMP);
        return { width, opacity, backgroundColor: isActive ? 'black' : '#D1D5DB' };
    });
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
            <Animated.View className="h-2 rounded-full" style={animatedStyle} />
        </TouchableOpacity>
    );
});

// 🔄 RESTORED: 3D NAV BUTTONS, CENTERED
const NavButton = React.memo(({ direction, onPress }: { direction: 'left' | 'right', onPress: () => void }) => {
    return (
        <SmoothButton
            onPress={onPress}
            containerStyle={{
                position: 'absolute',
                [direction === 'left' ? 'left' : 'right']: 0,
                // Centered Alignment
                top: '50%',
                transform: [{ translateY: -24 }],
                zIndex: 50
            }}
            buttonStyle="w-12 h-12 bg-white rounded-full border-[3px] border-black items-center justify-center"
            shadowStyle="bg-black rounded-full"
            depth={4}
        >
            {direction === 'left' ? <ArrowLeft size={24} color="black" strokeWidth={3} /> : <ArrowRight size={24} color="black" strokeWidth={3} />}
        </SmoothButton>
    );
});

export default React.memo(DepartmentsEvents);
