import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Star, Plus, X, Volume2, VolumeX, ArrowLeft, ArrowRight } from 'lucide-react-native';
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
    SharedValue,
    Extrapolation
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { VideoView, useVideoPlayer } from 'expo-video';
import Carousel from 'react-native-reanimated-carousel';
import { EVENTS_DATA } from '../data/EventsData';
import SmoothButton from './ui/SmoothButton';

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

    // Shared value for real-time scroll sync (smoother dots)
    const scrollProgress = useSharedValue(0);
    const carouselRef = useRef<any>(null);

    const filters = ['ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'];
    const MARQUEE_TEXT = "EVENTS ★ ★ SOET ★ ★ ";

    // Carousel configuration - Center + Previews
    // We use a smaller card width so side items (previews) are visible
    const PEAK_WIDTH = 40; // Amount of next/prev card visible
    const CARD_WIDTH = width * 0.78; // 78% of screen width
    const CARD_HEIGHT = isSmallDevice ? 580 : 640;

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
        scrollProgress.value = 0; // Reset scroll

        // Reset ScrollView to first item
        setTimeout(() => {
            if (carouselRef.current) {
                carouselRef.current.scrollTo({ index: 0, animated: false });
            }
        }, 50);
    };

    return (
        <View className="w-full">
            {/* ============================================ */}
            {/* SECTION A: ABOUT SOET CARD                  */}
            {/* ============================================ */}
            <View className="bg-[#E3F2FD] rounded-[30px] border-[3px] border-black pb-6 relative mb-4" style={{ padding: 24 }}>
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
                <Text className=" text-black text-center leading-7 text-base p-4 pl-4 text-lg"
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
            <View className="bg-[#FFF8E1] border-[3px] border-black rounded-[30px] p-4 pb-10 min-h-[500px]" style={{ overflow: 'hidden' }}>

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
                        <View key={index}>
                            <SmoothButton
                                onPress={() => handleFilterChange(filter)}
                                buttonStyle={`px-4 py-2 rounded-full border-2 border-black ${selectedCategory === filter ? 'bg-[#9d4edd]' : 'bg-white'}`}
                                shadowStyle="bg-black rounded-full"
                                depth={4}
                            >
                                <Text
                                    className={`text-[12px] uppercase tracking-wider ${selectedCategory === filter ? 'text-white' : 'text-black'}`}
                                    style={{ fontFamily: SECTION_FONTS.FILTER_LABEL }}
                                >
                                    {filter}
                                </Text>
                            </SmoothButton>
                        </View>
                    ))}
                </View>

                {/* CAROUSEL: Swipeable Event Cards             */}
                {/* ============================================ */}
                {filteredEvents.length > 0 ? (
                    <View
                        onLayout={(e) => {
                            const { width: layoutWidth } = e.nativeEvent.layout;
                            setContainerWidth(layoutWidth);
                        }}
                        style={{ height: isSmallDevice ? 620 : 720, alignItems: 'center' }}
                    >
                        <View className="relative w-full items-center justify-center">
                            <Carousel
                                key={selectedCategory} // Force re-render on category change
                                loop={true} // Infinite loop for smoother feel
                                ref={carouselRef}
                                width={containerWidth} // Full container width for parallax calculation
                                height={CARD_HEIGHT}
                                autoPlay={false}
                                data={filteredEvents}
                                scrollAnimationDuration={600} // Snappier but smooth
                                onSnapToItem={(index) => {
                                    runOnJS(setCurrentIndex)(index);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                                onProgressChange={(progress, absoluteProgress) => {
                                    scrollProgress.value = absoluteProgress;
                                }}
                                // Parallax mode removed to prevent video clipping artifacts
                                windowSize={3} // Rendering optimization
                                renderItem={({ item, index, animationValue }) => {
                                    return (
                                        <CustomItem
                                            item={item}
                                            animationValue={animationValue}
                                            isActive={index === currentIndex}
                                            width={CARD_WIDTH}
                                        />
                                    );
                                }}
                            />

                            {/* Navigation Buttons - With Press Animation */}
                            <NavButton
                                direction="left"
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    carouselRef.current?.scrollTo({ count: -1, animated: true });
                                }}
                            />

                            <NavButton
                                direction="right"
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    carouselRef.current?.scrollTo({ count: 1, animated: true });
                                }}
                            />
                        </View>

                        {/* ============================================ */}
                        {/* PAGINATION DOTS (Real-time Sync)             */}
                        {/* ============================================ */}
                        {filteredEvents.length > 1 && (
                            <View className="flex-row justify-center items-center mt-8 gap-2">
                                {filteredEvents.map((_, index) => (
                                    <PaginationDot
                                        key={index}
                                        index={index}
                                        scrollProgress={scrollProgress}
                                        length={filteredEvents.length}
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
// CUSTOM ANIMATED ITEM (Simpler 3D Effect)
// ============================================
// ============================================
// CUSTOM ANIMATED ITEM (Simpler 3D Effect)
// ============================================
const CustomItem = React.memo(({ item, animationValue, isActive, width }: { item: any, animationValue: SharedValue<number>, isActive: boolean, width: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
        // Simple Scale - Middle is 1, Sides are 0.9
        const scale = interpolate(
            animationValue.value,
            [-1, 0, 1],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
        );

        // Simple Opacity - Middle is 1, Sides are 0.7
        const opacity = interpolate(
            animationValue.value,
            [-1, 0, 1],
            [0.7, 1, 0.7],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { scale },
                // removed heavy 3D rotation for a cleaner "preview" look
            ],
            opacity,
            zIndex: isActive ? 10 : 1, // Ensure active card is on top
        };
    });

    return (
        <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, animatedStyle]}>
            <View style={{ width: width, height: '100%', alignItems: 'center', paddingBottom: 12 }}>
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
                />
            </View>
        </Animated.View>
    );
});

// ============================================
// PAGINATION DOT COMPONENT (Reanimated)
// ============================================
// ============================================
// PAGINATION DOT COMPONENT (Reanimated)
// ============================================
const PaginationDot = React.memo(({ index, scrollProgress, length, onPress }: { index: number, scrollProgress: SharedValue<number>, length: number, onPress: () => void }) => {

    // Animate width based on scroll progress (0 to length-1)
    const animatedStyle = useAnimatedStyle(() => {
        // We use absolute progress which naturally handles loops in some carousel configs,
        // but for basic length, we might need modulo if loop is purely index based.
        // However, standard absolute progress usually maps directly to index.
        // Let's use a "distance" approach for highlighting.

        // Handle varying loop indices if necessary, but direct diff is usually fine for these props
        // We'll create a range around the current index.

        // Clamp scrollProgress for safer interpolation if mostly linear
        // Note: infinite loop scrollProgress keeps increasing. 
        // We need modulo logic for infinite loop dots:
        const currentScrollIndex = Math.abs(scrollProgress.value) % length;

        // Check "distance" from this dot's index
        // Circular distance for infinite loop
        let dist = Math.abs(currentScrollIndex - index);
        if (dist > length / 2) {
            dist = length - dist;
        }

        // Active if distance is close to 0
        const isActive = dist < 0.5;

        // Smooth Interpolation
        const width = interpolate(dist, [0, 1], [32, 8], Extrapolation.CLAMP);
        const opacity = interpolate(dist, [0, 1], [1, 0.3], Extrapolation.CLAMP);
        const color = isActive ? 'black' : '#D1D5DB'; // black vs gray-300

        return {
            width,
            opacity,
            backgroundColor: color
        };
    });

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
            <Animated.View
                className="h-2 rounded-full"
                style={animatedStyle}
            />
        </TouchableOpacity>
    );
});

// ============================================
// NAV BUTTON (With Press Animation)
// ============================================
// ============================================
// NAV BUTTON (With Press Animation)
// ============================================
const NavButton = React.memo(({ direction, onPress }: { direction: 'left' | 'right', onPress: () => void }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.9);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            className={`absolute ${direction === 'left' ? 'left-0' : 'right-0'} w-12 h-12 bg-white rounded-full border-[3px] border-black items-center justify-center z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
            style={{
                top: '105%', // To move UP/DOWN change this percentage (e.g. 50% is center, 60% is lower)
                transform: [{ translateY: -24 }] // Centers the button itself
            }}
            activeOpacity={0.9}
        >
            <Animated.View style={animatedStyle}>
                {direction === 'left' ? (
                    <ArrowLeft size={24} color="black" strokeWidth={3} />
                ) : (
                    <ArrowRight size={24} color="black" strokeWidth={3} />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
});

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

const EventCard = React.memo(({ title, date, category, description, prizePool, imageColor, buttonColor, imageUrl, videoUrl, isActive }: EventCardProps) => {
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
        <View className="relative w-full h-full">
            {/* Main 3D Shadow for Card */}
            <View className="absolute top-2 left-2 w-full h-full bg-black rounded-[32px]" />

            <View
                className="bg-black border-[3px] border-black rounded-[32px] overflow-hidden w-full h-full"
                style={{ backfaceVisibility: 'hidden' }} // Strict overflow and backface visibility
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
                <View className={`bg-white ${isSmallDevice ? 'p-3' : 'p-5'}`} style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', width: '100%' }}>
                        {/* Event Title - Max 2 Lines */}
                        <Text
                            className="text-black uppercase leading-8 mb-1 text-center"
                            style={{ fontFamily: SECTION_FONTS.EVENT_TITLE, fontSize: isSmallDevice ? 24 : 30, lineHeight: isSmallDevice ? 28 : 32 }}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {title}
                        </Text>

                        {/* Event Date - Max 1 Line */}
                        <Text
                            className="text-[#8e99af] mb-3 text-center"
                            style={{ fontFamily: SECTION_FONTS.DATE, fontSize: isSmallDevice ? 14 : 18 }}
                            numberOfLines={1}
                        >
                            {date}
                        </Text>

                        {/* Prize Pool Tag */}
                        <View className={`bg-[#B9F6CA] rounded-full border-black mb-4 ${isSmallDevice ? 'px-3 py-1' : 'px-4 py-1.5'}`}>
                            <Text className="text-black text-xs text-center" style={{ fontFamily: SECTION_FONTS.PRIZE_POOL_LABEL }} numberOfLines={1}>
                                Prize pool: <Text style={{ fontFamily: SECTION_FONTS.PRIZE_POOL_VALUE }}>{prizePool}</Text>
                            </Text>
                        </View>

                        {/* Short Description - Max 2 Lines */}
                        <Text
                            className="text-black/80 text-sm leading-5 mb-4 text-center px-2"
                            style={{ fontFamily: SECTION_FONTS.DESCRIPTION, fontSize: isSmallDevice ? 12 : 14 }}
                            numberOfLines={3}
                            ellipsizeMode="tail"
                        >
                            {description || "Join this exciting event and showcase your skills! More details coming soon."}
                        </Text>
                    </View>

                    {/* Action Buttons - Fixed At Bottom */}
                    <View className={`gap-4 w-full ${isSmallDevice ? 'mt-1' : 'mt-4'}`}>
                        <SmoothButton
                            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                            buttonStyle={`border-[3px] border-black rounded-2xl items-center ${isSmallDevice ? 'py-3' : 'py-4'}`}
                            innerButtonStyle={{ backgroundColor: buttonColor }}
                            shadowStyle="bg-black rounded-2xl"
                            depth={6}
                        >
                            <Text className="text-black uppercase tracking-widest" style={{ fontFamily: SECTION_FONTS.BUTTON, fontSize: isSmallDevice ? 11 : 13 }}>
                                VIEW DETAILS
                            </Text>
                        </SmoothButton>

                        {/* Register Button */}
                        <SmoothButton
                            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                            buttonStyle={`bg-black rounded-2xl items-center ${isSmallDevice ? 'py-3' : 'py-4'}`}
                            shadowStyle="bg-black rounded-2xl"
                            depth={6}
                        >
                            <Text className="text-white uppercase tracking-widest" style={{ fontFamily: SECTION_FONTS.BUTTON, fontSize: isSmallDevice ? 11 : 13 }}>
                                REGISTER
                            </Text>
                        </SmoothButton>
                    </View>
                </View>
            </View>
        </View>
    );
});

export default React.memo(DepartmentsEvents);
