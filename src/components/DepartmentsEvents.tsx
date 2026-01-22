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
import Carousel from 'react-native-reanimated-carousel';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

// ============================================
// EVENT DATA STRUCTURE
// ============================================
// TO ADD NEW EVENTS: Simply add a new object to the array below
// Categories: 'ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'
// Every event now supports both imageUrl and videoUrl. Video takes priority if provided.

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

const EVENTS_DATA = [
    // --- ESPORTS EVENTS ---
    {
        title: 'VALORANT',
        date: 'MARCH 13TH - 14TH',
        category: 'ESPORTS',
        description: 'Join the ultimate tactical FPS showdown. Form your squad and compete for glory!',
        prizePool: 'TBA',
        imageColor: '#ccff00',
        buttonColor: '#D194FF',
        imageUrl: '',
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/44fe63af-47e0-4df6-8fc3-0a984c7337da.mp4' // Valorant Agent Gekko
    },
    {
        title: 'BGMI',
        date: 'MARCH 13TH - 14TH',
        category: 'ESPORTS',
        description: 'Battle it out in the most popular mobile battle royale championship.',
        prizePool: '10K',
        imageColor: '#ff9966',
        buttonColor: '#D194FF',
        imageUrl: '',
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/465c6e8d-1d24-4084-b576-5f613dd1829b.mp4'
    },


    // --- CSE EVENTS ---
    {
        title: 'HACKATHON',
        date: 'MARCH 15TH - 16TH',
        category: 'CSE',
        description: 'Build innovative solutions in 24 hours. Code, create, and conquer!',
        prizePool: '50K',
        imageColor: '#66ccff',
        buttonColor: '#FFD700',
        // imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Coding/Tech
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/1359c8e8-57aa-482e-8af0-31d92af491e5.mp4'
    },
    {
        title: 'CODE RELAY',
        date: 'MARCH 15TH',
        category: 'CSE',
        description: 'Team-based coding challenge. Pass the code, solve the problem!',
        prizePool: 'TBA',
        imageColor: '#9933ff',
        buttonColor: '#FFD700',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },

    // --- CIVIL EVENTS ---
    {
        title: 'BRIDGE BUILDING',
        date: 'MARCH 16TH',
        category: 'CIVIL',
        description: 'Design and build the strongest bridge using limited materials.',
        prizePool: '15K',
        imageColor: '#ff6666',
        buttonColor: '#90EE90',
        imageUrl: 'https://images.unsplash.com/photo-1545139224-7eb9c2acc995?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Bridge
        videoUrl: ''
    },
    {
        title: 'CAD MASTER',
        date: 'MARCH 17TH',
        category: 'CIVIL',
        description: 'Showcase your AutoCAD and design skills in this technical challenge.',
        prizePool: 'TBA',
        imageColor: '#ffaa66',
        buttonColor: '#90EE90',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Engineering
        videoUrl: ''
    },

    // --- MECHANICAL EVENTS ---
    {
        title: 'ROBO RACE',
        date: 'MARCH 16TH - 17TH',
        category: 'MECHANICAL',
        description: 'Build autonomous robots and race them through challenging obstacle courses.',
        prizePool: '25K',
        imageColor: '#66ff66',
        buttonColor: '#FFB6C1',
        imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Robotics
        videoUrl: ''
    },
    {
        title: 'MECHANISM DESIGN',
        date: 'MARCH 17TH',
        category: 'MECHANICAL',
        description: 'Create innovative mechanical solutions for real-world problems.',
        prizePool: 'TBA',
        imageColor: '#66ffcc',
        buttonColor: '#FFB6C1',
        imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Gears/Mech
        videoUrl: ''
    },

    // --- EEE EVENTS ---
    {
        title: 'CIRCUIT DEBUGGING',
        date: 'MARCH 18TH',
        category: 'EEE',
        description: 'Find and fix errors in complex electrical circuits under time pressure.',
        prizePool: '20K',
        imageColor: '#ff99cc',
        buttonColor: '#87CEEB',
        imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Electronics
        videoUrl: ''
    },
    {
        title: 'SMART HOME',
        date: 'MARCH 18TH',
        category: 'EEE',
        description: 'Design an IoT-based smart home automation system.',
        prizePool: 'TBA',
        imageColor: '#cc99ff',
        buttonColor: '#87CEEB',
        imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Smart home
        videoUrl: ''
    },

    // --- ROBOTICS EVENTS ---
    {
        title: 'LINE FOLLOWER',
        date: 'MARCH 19TH',
        category: 'ROBOTICS',
        description: 'Program robots to follow complex line patterns at maximum speed.',
        prizePool: '30K',
        imageColor: '#ffcc66',
        buttonColor: '#DDA0DD',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },
    {
        title: 'DRONE RACING',
        date: 'MARCH 19TH - 20TH',
        category: 'ROBOTICS',
        description: 'Pilot your drone through challenging aerial obstacles and courses.',
        prizePool: '35K',
        imageColor: '#66cccc',
        buttonColor: '#DDA0DD',
        imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Drones
        videoUrl: ''
    },

    // --- NON-TECH EVENTS ---
    {
        title: 'TREASURE HUNT',
        date: 'MARCH 20TH',
        category: 'NON-TECH',
        description: 'Solve clues and puzzles to find hidden treasures across the campus.',
        prizePool: '10K',
        imageColor: '#ffff99',
        buttonColor: '#98FB98',
        // imageUrl: 'https://images.unsplash.com/photo-1519074063912-ad2fe3f5113c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Map/Adventure
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/4ebcf404-4545-45bd-817e-5e6cc8b6c361.mp4'
    },
    {
        title: 'TALENT SHOW',
        date: 'MARCH 21ST',
        category: 'NON-TECH',
        description: 'Showcase your unique talents - singing, dancing, comedy, and more!',
        prizePool: 'TBA',
        imageColor: '#ffccff',
        buttonColor: '#98FB98',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Stage/Performance
        videoUrl: ''
    },
];



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
                <Text className=" text-black text-center leading-7 text-base font-semibold p-4 pl-4 text-lg"  //test
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
                    <Text className="text-gray-500 text-center mt-2 px-8 font-semibold"
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
                        style={{ height: 650, alignItems: 'center' }}
                    >
                        <Carousel
                            loop={false}
                            ref={carouselRef}
                            width={containerWidth}
                            height={600}
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
                            data={filteredEvents}
                            renderItem={({ item, index }: { item: any; index: number }) => (
                                <View style={{ width: containerWidth, alignItems: 'center', justifyContent: 'center' }}>
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
}

const EventCard = ({ title, date, category, description, prizePool, imageColor, buttonColor, imageUrl, videoUrl }: EventCardProps) => {
    // Track muted state for UI updates
    const [isMuted, setIsMuted] = useState(true);

    // Initialize video player for expo-video
    const player = useVideoPlayer(videoUrl || '', (player) => {
        player.loop = true;
        player.play();
        player.muted = true;
    });

    const toggleMute = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        player.muted = newMutedState;
    };

    // ============================================
    // EXPERIMENTAL: ACCORDION ANIMATION (COMMENTED OUT AS PER USER REQUEST)
    // ============================================
    /*
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const heightValue = useSharedValue(0);
    const rotationValue = useSharedValue(0);
    const buttonOpacity = useSharedValue(0);

    const animatedHeight = useAnimatedStyle(() => {
        return {
            height: heightValue.value,
            opacity: interpolate(
                heightValue.value,
                [0, contentHeight * 0.3, contentHeight],
                [0, 0.6, 1]
            ),
        };
    });

    const animatedButtons = useAnimatedStyle(() => {
        return {
            opacity: buttonOpacity.value,
            transform: [
                { translateY: interpolate(buttonOpacity.value, [0, 1], [10, 0]) }
            ],
        };
    });

    const animatedIconRotation = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${rotationValue.value}deg` },
                { scale: interpolate(rotationValue.value, [0, 90, 180], [1, 1.1, 1]) },
            ],
        };
    });

    const toggleExpand = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsExpanded(!isExpanded);

        heightValue.value = withTiming(
            isExpanded ? 0 : contentHeight,
            {
                duration: 450,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }
        );

        rotationValue.value = withTiming(
            isExpanded ? 0 : 180,
            {
                duration: 300,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            }
        );

        buttonOpacity.value = withTiming(
            isExpanded ? 0 : 1,
            {
                duration: 350,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }
        );
    };
    */

    return (
        <View
            className="bg-black border-[3px] border-black rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ height: 600 }}
        >
            {/* Poster Header - Fixed Height */}
            <View
                className="relative w-full bg-black overflow-hidden"
                style={{
                    height: 300,
                    marginBottom: -5 // Ensure seamless connection with content
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
            <View className="p-5 bg-white" style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                    {/* Event Title - Max 2 Lines */}
                    <Text
                        className="text-black text-3xl uppercase leading-8 mb-1"
                        style={{ fontFamily: SECTION_FONTS.EVENT_TITLE }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>

                    {/* Event Date - Max 1 Line */}
                    <Text
                        className="text-[#8e99af] text-lg mb-3"
                        style={{ fontFamily: SECTION_FONTS.DATE }}
                        numberOfLines={1}
                    >
                        {date}
                    </Text>

                    {/* Prize Pool Tag */}
                    <View className="bg-[#B9F6CA] self-start px-4 py-1.5 rounded-full border-black mb-4">
                        <Text className="text-black text-xs" style={{ fontFamily: SECTION_FONTS.PRIZE_POOL_LABEL }} numberOfLines={1}>
                            Prize pool: <Text style={{ fontFamily: SECTION_FONTS.PRIZE_POOL_VALUE }}>{prizePool}</Text>
                        </Text>
                    </View>

                    {/* Short Description - Max 2 Lines */}
                    <Text
                        className="text-black/80 text-sm leading-5 mb-4"
                        style={{ fontFamily: SECTION_FONTS.DESCRIPTION }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {description || "Join this exciting event and showcase your skills! More details coming soon."}
                    </Text>
                </View>

                {/* Action Buttons - Fixed At Bottom */}
                <View className="gap-4">
                    <TouchableOpacity
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                        className="border-[3px] border-black py-4 rounded-2xl items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        style={{ backgroundColor: buttonColor }}
                    >
                        <Text className="text-black uppercase tracking-widest text-[13px]" style={{ fontFamily: SECTION_FONTS.BUTTON }}>
                            VIEW DETAILS
                        </Text>
                    </TouchableOpacity>

                    {/* Register Button */}
                    <TouchableOpacity
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                        className="bg-black py-4 rounded-2xl items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Text className="text-white uppercase tracking-widest text-[13px]" style={{ fontFamily: SECTION_FONTS.BUTTON }}>
                            REGISTER
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default DepartmentsEvents;
