import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Star, Plus, X, Volume2, VolumeX } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    Easing,
    interpolate,
    runOnJS,
    useAnimatedScrollHandler,
    SharedValue
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { VideoView, useVideoPlayer } from 'expo-video';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Carousel from 'react-native-reanimated-carousel';
import { EVENTS_DATA } from '../data/EventsData';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

// ============================================
// DESIGN SYSTEM: FONTS (EASY TO CHANGE)
// ============================================
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


const DepartmentsEvents = () => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const [selectedCategory, setSelectedCategory] = useState('ESPORTS');
    const [containerWidth, setContainerWidth] = useState(width);
    const [textWidth, setTextWidth] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const translateX = useSharedValue(0);
    const scrollX = useSharedValue(0);
    const carouselRef = useRef<any>(null);

    const filters = ['ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'];
    const MARQUEE_TEXT = "EVENTS ★ ★ SOET ★ ★ ";

    // Carousel configuration - 72% width for better peek visibility
    const CARD_WIDTH = Math.round(width * 0.72);
    const CARD_SPACING = 20;
    const SIDE_PADDING = (width - CARD_WIDTH) / 2;

    // ============================================
    // MARQUEE ANIMATION
    // ============================================
    useEffect(() => {
        if (textWidth > 0) {
            translateX.value = withRepeat(
                withTiming(-textWidth, {
                    duration: 4000,
                    easing: Easing.linear,
                }),
                -1,
                false
            );
        }
    }, [textWidth]);

    const marqueeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    // ============================================
    // FILTER EVENTS BY CATEGORY
    // ============================================
    const filteredEvents = EVENTS_DATA.filter(event => event.category === selectedCategory);

    // ============================================
    // SMOOTH FILTER TRANSITION
    // ============================================
    const handleFilterChange = (filter: string) => {
        // Smooth layout animation for category change
        LayoutAnimation.configureNext(
            LayoutAnimation.create(
                350,
                LayoutAnimation.Types.easeInEaseOut,
                LayoutAnimation.Properties.opacity
            )
        );

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setSelectedCategory(filter);
        setCurrentIndex(0);

        // Reset ScrollView to first item
        setTimeout(() => {
            if (carouselRef.current) {
                carouselRef.current.scrollTo({ x: 0, animated: false });
            }
        }, 50);
    };

    return (
        <View className="w-full">
            {/* ============================================ */}
            {/* SECTION A: ABOUT SOET CARD                  */}
            {/* ============================================ */}
            <View className="bg-[#E3F2FD] rounded-3xl border-[3px] border-black pb-6 relative mb-4" style={{ padding: 24 }}>
                {/* Star Icon */}
                <View className="absolute top-6 left-6 bg-red-400 p-2 rounded-full border-2 border-black">
                    <Star color="black" fill="black" size={20} />
                </View>

                {/* Header - Restructured to fix italic "SOET" text clipping */}
                <View className="mb-4 mt-2">
                    <View className="flex-row" style={{ alignSelf: 'flex-end', marginRight: 8 }}>
                        <Text className="text-4xl text-black"
                            style={{ fontFamily: 'Gilton' }}>ABOUT </Text>
                        <Text className="text-4xl text-black"
                            style={{ fontFamily: 'Gilton' }}>SOET</Text>
                    </View>
                </View>

                {/* Body Text */}
                <Text className=" text-black text-center leading-7 text-base p-4 pl-4 text-lg"  //test
                    style={{ fontFamily: 'Softura' }}>
                    The School of Engineering and Technology stands as a beacon of technical excellence, fostering innovation and shaping the future engineers who will build tomorrow's world.
                </Text>
            </View>

            {/* ============================================ */}
            {/* SECTION B: MARQUEE LABEL (SQUARE CORNERS)   */}
            {/* ============================================ */}
            <View
                className="bg-[#FFEB3B] border-[3px] border-black py-3 overflow-hidden mb-4"
                style={{
                    transform: [{ rotate: '-1deg' }] // Subtle tilt for dynamic Neo-Brutalism effect
                }}
            >
                <Animated.View style={[marqueeStyle, { flexDirection: 'row', width: 2000 }]}>
                    {/* Measure text width */}
                    <Text
                        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
                        className="absolute opacity-0 font-[Gilton] text-black text-lg tracking-widest"
                    >
                        {MARQUEE_TEXT}
                    </Text>

                    {/* Render multiple copies for infinite loop */}
                    {[...Array(12)].map((_, i) => (
                        <Text key={i} className="font-[Gilton] text-black text-lg tracking-widest">
                            {MARQUEE_TEXT}
                        </Text>
                    ))}
                </Animated.View>
            </View>

            {/* ============================================ */}
            {/* SECTION C: SIGNIFIYA EVENTS CARD             */}
            {/* ============================================ */}
            <View className="bg-[#FFF8E1] border-[3px] border-black rounded-3xl p-4 pb-10 min-h-[500px]" style={{ overflow: 'hidden' }}>

                {/* Header */}
                <View className="items-center my-6">
                    <Text className="text-4xl text-black  mb-2"
                        style={{ fontFamily: SECTION_FONTS.SECTION_HEADER, paddingRight: 10 }}>SIGNIFIYA</Text>
                    <Text className="text-4xl text-black "
                        style={{ fontFamily: SECTION_FONTS.SECTION_HEADER, paddingRight: 10 }}>EVENTS</Text>
                    <Text className="text-gray-500 text-center mt-2 px-8"
                        style={{ fontFamily: SECTION_FONTS.DESCRIPTION }}>
                        Discover the diverse range of events happening at Signifiya'26.
                    </Text>
                </View>

                {/* ============================================ */}
                {/* FILTER PILLS (Interactive)                  */}
                {/* ============================================ */}
                <View className="flex-row flex-wrap justify-center gap-2 mb-8" >
                    {filters.map((filter, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleFilterChange(filter)}
                            className={`px-4 py-2 rounded-full border-2 border-black ${selectedCategory === filter ? 'bg-black' : 'bg-white'
                                }`}
                        >
                            <Text
                                className={`text-[12px] uppercase tracking-wider ${selectedCategory === filter ? 'text-white' : 'text-black'}`}
                                style={{ fontFamily: SECTION_FONTS.FILTER_LABEL }}
                            >
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* CAROUSEL: Swipeable Event Cards             */}
                {/* ============================================ */}
                {/* CAROUSEL: Swipeable Event Cards             */}
                {/* ============================================ */}
                {filteredEvents.length > 0 ? (
                    <View
                        onLayout={(e) => {
                            const { width: layoutWidth } = e.nativeEvent.layout;
                            setContainerWidth(layoutWidth);
                        }}
                        style={{ height: isSmallDevice ? 600 : 700, alignItems: 'center' }}
                    >
                        <View className="relative w-full items-center justify-center">
                            <Carousel
                                key={selectedCategory} // Force re-render on category change to reset index
                                loop={false}
                                ref={carouselRef}
                                width={containerWidth}
                                height={isSmallDevice ? 580 : 640}
                                style={{
                                    width: containerWidth,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                mode="parallax"
                                modeConfig={{
                                    parallaxScrollingScale: 0.9,
                                    parallaxScrollingOffset: 50,
                                    parallaxAdjacentItemScale: 0.8,
                                }}
                                {...({
                                    panGestureHandlerProps: {
                                        activeOffsetX: [-10, 10],
                                    }
                                } as any)}
                                data={filteredEvents}
                                renderItem={({ item, index }: { item: any; index: number }) => (
                                    <View
                                        style={{
                                            width: containerWidth,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            // Z-Index Hack: Active item higher (approximated by index vs current)
                                            // Since we can't easily animate zIndex here without shared values,
                                            // we rely on Parallax mode's default z-ordering (usually center on top).
                                            // We ensure strict clipping:
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <View style={{ width: CARD_WIDTH, marginHorizontal: CARD_SPACING / 2 }}>
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
                                                isActive={index === currentIndex}
                                            />
                                        </View>
                                    </View>
                                )}
                                onSnapToItem={(index: number) => {
                                    runOnJS(setCurrentIndex)(index);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                                onProgressChange={(offset: number, absoluteProgress: number) => {
                                    scrollX.value = absoluteProgress * (CARD_WIDTH + CARD_SPACING);
                                }}
                            />

                            {/* Navigation Buttons (Floating - Fixed Position) */}
                            <TouchableOpacity
                                onPress={() => {
                                    if (currentIndex > 0) {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        carouselRef.current?.scrollTo({ index: currentIndex - 1, animated: true });
                                    }
                                }}
                                className="absolute left-1 w-9 h-9 bg-white rounded-full border-[2px] border-black items-center justify-center z-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                style={{
                                    top: '50%',
                                    transform: [{ translateY: -18 }]
                                }}
                                activeOpacity={0.7}
                            >
                                <ChevronLeft size={20} color={currentIndex === 0 ? "#D1D5DB" : "black"} strokeWidth={3} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    if (currentIndex < filteredEvents.length - 1) {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        carouselRef.current?.scrollTo({ index: currentIndex + 1, animated: true });
                                    }
                                }}
                                className="absolute right-1 w-9 h-9 bg-white rounded-full border-[2px] border-black items-center justify-center z-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                style={{
                                    top: '50%',
                                    transform: [{ translateY: -18 }]
                                }}
                                activeOpacity={0.7}
                            >
                                <ChevronRight size={20} color={currentIndex === filteredEvents.length - 1 ? "#D1D5DB" : "black"} strokeWidth={3} />
                            </TouchableOpacity>
                        </View>

                        {/* ============================================ */}
                        {/* PAGINATION DOTS (Animated)                   */}
                        {/* ============================================ */}
                        {filteredEvents.length > 1 && (
                            <View className="flex-row justify-center items-center mt-6 gap-2">
                                {filteredEvents.map((_, index) => (
                                    <PaginationDot
                                        key={index}
                                        index={index}
                                        isActive={index === currentIndex}
                                        scrollX={scrollX}
                                        cardWidth={CARD_WIDTH}
                                        cardSpacing={CARD_SPACING}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            carouselRef.current?.scrollTo({ index, animated: true });
                                        }}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                ) : ( // No events found message
                    <View className="items-center py-12">
                        <Text className="font-[Inter_700Bold] text-gray-400 text-lg">
                            No events in this category yet!
                        </Text>
                        <Text className="font-[Inter_400Regular] text-gray-400 text-sm mt-2">
                            Check back soon for updates.
                        </Text>
                    </View>
                )
                }
            </View>
        </View>
    );
};

// ============================================
// PAGINATION DOT COMPONENT (Animated)
// ============================================
interface PaginationDotProps {
    index: number;
    isActive: boolean;
    onPress: () => void;
    scrollX: SharedValue<number>;
    cardWidth: number;
    cardSpacing: number;
}

const PaginationDot = ({ index, isActive, onPress, scrollX, cardWidth, cardSpacing }: PaginationDotProps) => {
    // Real-time scroll-based animation for fluid expansion
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * (cardWidth + cardSpacing),
            index * (cardWidth + cardSpacing),
            (index + 1) * (cardWidth + cardSpacing),
        ];

        const widthInterpolation = interpolate(
            scrollX.value,
            inputRange,
            [8, 24, 8], // Inactive: 8px, Active: 24px (3x expansion)
            'clamp'
        );

        const opacityInterpolation = interpolate(
            scrollX.value,
            inputRange,
            [0.4, 1, 0.4], // Inactive: dim, Active: full
            'clamp'
        );

        return {
            width: widthInterpolation,
            opacity: opacityInterpolation,
        };
    });

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Animated.View
                style={[
                    {
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'black',
                    },
                    animatedStyle
                ]}
            />
        </TouchableOpacity>
    );
};

// ============================================
// REUSABLE EVENT CARD COMPONENT
// ============================================
interface EventCardProps {
    title: string;
    date: string;
    category: string;
    description: string;
    prizePool: string;
    imageColor: string;
    buttonColor: string;
    imageUrl?: string;
    videoUrl?: string; // New field for video support
    isActive: boolean; // Controls video playback visibility
}

const EventCard = ({ title, date, category, description, prizePool, imageColor, buttonColor, imageUrl, videoUrl, isActive }: EventCardProps) => {
    // Track muted state for UI updates
    const [isMuted, setIsMuted] = useState(true);

    // Initialize video player for expo-video
    const player = useVideoPlayer(videoUrl || '', (player) => {
        player.loop = true;
        // Only play if active to save resources and prevent bleeding
        if (isActive) {
            player.play();
        } else {
            player.pause();
        }
        player.muted = true;
    });

    // Effect to control playback based on active state
    useEffect(() => {
        if (isActive) {
            player.play();
        } else {
            player.pause();
            player.currentTime = 0; // Reset video when scrolling away

            // Reset mute state so it's fresh (muted) next time
            if (!player.muted) {
                player.muted = true;
                setIsMuted(true);
            }
        }
    }, [isActive, player]);

    const toggleMute = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        player.muted = newMutedState;
    };

    return (
        <View
            className="bg-black border-[3px] border-black rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ height: isSmallDevice ? 580 : 640, overflow: 'hidden', backfaceVisibility: 'hidden' }} // Strict overflow and backface visibility
        >
            {/* Poster Header - Fixed Height */}
            <View
                className="relative w-full bg-black overflow-hidden"
                style={{
                    height: isSmallDevice ? 220 : 280,
                    marginBottom: -5, // Ensure seamless connection with content
                    overflow: 'hidden',
                    borderTopLeftRadius: 29,
                    borderTopRightRadius: 29
                }}
            >
                {/* Media Container with absolute positioning fixes */}
                <View className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                    {videoUrl ? (
                        <View className="w-full h-full" pointerEvents="box-none">
                            <VideoView
                                player={player}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                contentFit="cover"
                                nativeControls={false}
                                pointerEvents="none"
                            />
                            <TouchableOpacity
                                onPress={toggleMute}
                                className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-full border border-white/20 z-10"
                            >
                                {isMuted ? (
                                    <VolumeX size={18} color="white" />
                                ) : (
                                    <Volume2 size={18} color="white" />
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-full items-center justify-center" style={{ backgroundColor: imageColor }}>
                            <Text className="text-black font-bold opacity-20">POSTER GOES HERE</Text>
                        </View>
                    )}
                </View>

                {/* Perfect Border Bottom Overlay */}
                <View
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'black' }}
                    pointerEvents="none"
                />

                {/* Category Badge */}
                <View className="absolute top-4 right-4 bg-black px-4 py-2 rounded-full border-2 border-white/20">
                    <Text
                        className="text-white text-[10px] tracking-widest uppercase"
                        style={{ fontFamily: SECTION_FONTS.BADGE }}
                        numberOfLines={1}
                    >
                        {category}
                    </Text>
                </View>
            </View>

            {/* Content Area - Fixed Layout */}
            <View className={`bg-white ${isSmallDevice ? 'p-3' : 'p-5'}`} style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                    {/* Event Title - Max 2 Lines */}
                    <Text
                        className="text-black uppercase leading-8 mb-1"
                        style={{ fontFamily: SECTION_FONTS.EVENT_TITLE, fontSize: isSmallDevice ? 24 : 30, lineHeight: isSmallDevice ? 28 : 32 }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>

                    {/* Event Date - Max 1 Line */}
                    <Text
                        className="text-[#8e99af] mb-3"
                        style={{ fontFamily: SECTION_FONTS.DATE, fontSize: isSmallDevice ? 14 : 18 }}
                        numberOfLines={1}
                    >
                        {date}
                    </Text>

                    {/* Prize Pool Tag */}
                    <View className={`bg-[#B9F6CA] self-start rounded-full border-black mb-4 ${isSmallDevice ? 'px-3 py-1' : 'px-4 py-1.5'}`}>
                        <Text className="text-black text-xs" style={{ fontFamily: SECTION_FONTS.PRIZE_POOL_LABEL }} numberOfLines={1}>
                            Prize pool: <Text style={{ fontFamily: SECTION_FONTS.PRIZE_POOL_VALUE }}>{prizePool}</Text>
                        </Text>
                    </View>

                    {/* Short Description - Max 2 Lines */}
                    <Text
                        className="text-black/80 text-sm leading-5 mb-4"
                        style={{ fontFamily: SECTION_FONTS.DESCRIPTION, fontSize: isSmallDevice ? 12 : 14 }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        {description || "Join this exciting event and showcase your skills! More details coming soon."}
                    </Text>
                </View>

                {/* Action Buttons - Fixed At Bottom */}
                <View className={`gap-3 ${isSmallDevice ? 'mt-1' : 'mt-4'}`}>
                    <TouchableOpacity
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                        className={`border-[3px] border-black rounded-2xl items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isSmallDevice ? 'py-3' : 'py-4'}`}
                        style={{ backgroundColor: buttonColor }}
                    >
                        <Text className="text-black uppercase tracking-widest" style={{ fontFamily: SECTION_FONTS.BUTTON, fontSize: isSmallDevice ? 11 : 13 }}>
                            VIEW DETAILS
                        </Text>
                    </TouchableOpacity>

                    {/* Register Button */}
                    <TouchableOpacity
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                        className={`bg-black rounded-2xl items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isSmallDevice ? 'py-3' : 'py-4'}`}
                    >
                        <Text className="text-white uppercase tracking-widest" style={{ fontFamily: SECTION_FONTS.BUTTON, fontSize: isSmallDevice ? 11 : 13 }}>
                            REGISTER
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default DepartmentsEvents;
