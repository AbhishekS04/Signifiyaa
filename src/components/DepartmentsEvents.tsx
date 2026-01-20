import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Star } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// ============================================
// EVENT DATA STRUCTURE
// ============================================
// TO ADD NEW EVENTS: Simply add a new object to the array below
// Each event MUST have: title, date, category, description, prizePool, imageColor, buttonColor
// Categories: 'ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'

const EVENTS_DATA = [
    // --- ESPORTS EVENTS ---
    {
        title: 'VALORANT TOURNAMENT',
        date: 'MARCH 13TH - 14TH',
        category: 'ESPORTS',
        description: 'Join the ultimate tactical FPS showdown. Form your squad and compete for glory!',
        prizePool: '10K',
        imageColor: '#ccff00', // Lime green
        buttonColor: '#D0A0FF', // Purple
    },
    {
        title: 'BGMI',
        date: 'MARCH 13TH - 14TH',
        category: 'ESPORTS',
        description: 'Battle it out in the most popular mobile battle royale championship.',
        prizePool: '10K',
        imageColor: '#ff9966', // Orange
        buttonColor: '#D0A0FF',
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
    },
    {
        title: 'CODE RELAY',
        date: 'MARCH 15TH',
        category: 'CSE',
        description: 'Team-based coding challenge. Pass the code, solve the problem!',
        prizePool: 'TBA',
        imageColor: '#9933ff',
        buttonColor: '#FFD700',
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
    },
    {
        title: 'CAD MASTER',
        date: 'MARCH 17TH',
        category: 'CIVIL',
        description: 'Showcase your AutoCAD and design skills in this technical challenge.',
        prizePool: 'TBA',
        imageColor: '#ffaa66',
        buttonColor: '#90EE90',
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
    },
    {
        title: 'MECHANISM DESIGN',
        date: 'MARCH 17TH',
        category: 'MECHANICAL',
        description: 'Create innovative mechanical solutions for real-world problems.',
        prizePool: 'TBA',
        imageColor: '#66ffcc',
        buttonColor: '#FFB6C1',
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
    },
    {
        title: 'SMART HOME',
        date: 'MARCH 18TH',
        category: 'EEE',
        description: 'Design an IoT-based smart home automation system.',
        prizePool: 'TBA',
        imageColor: '#cc99ff',
        buttonColor: '#87CEEB',
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
    },
    {
        title: 'DRONE RACING',
        date: 'MARCH 19TH - 20TH',
        category: 'ROBOTICS',
        description: 'Pilot your drone through challenging aerial obstacles and courses.',
        prizePool: '35K',
        imageColor: '#66cccc',
        buttonColor: '#DDA0DD',
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
    },
    {
        title: 'TALENT SHOW',
        date: 'MARCH 21ST',
        category: 'NON-TECH',
        description: 'Showcase your unique talents - singing, dancing, comedy, and more!',
        prizePool: 'TBA',
        imageColor: '#ffccff',
        buttonColor: '#98FB98',
    },
];

const DepartmentsEvents = () => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const [selectedCategory, setSelectedCategory] = useState('ESPORTS'); // Default filter
    const [textWidth, setTextWidth] = useState(0);
    const translateX = useSharedValue(0);

    const filters = ['ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'];
    const MARQUEE_TEXT = "EVENTS ★ ★ SOET ★ ★ ";

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
                        <Text className="font-[ArchivoBlack_400Regular] text-3xl text-black">ABOUT </Text>
                        <Text className="font-[ArchivoBlack_400Regular] text-3xl text-black" style={{ paddingRight: 4 }}>SOET</Text>
                    </View>
                </View>

                {/* Body Text */}
                <Text className="font-[Inter_400Regular] text-black text-center leading-6 text-base font-semibold">
                    The School of Engineering and Technology stands as a beacon of technical excellence, fostering innovation and shaping the future engineers who will build tomorrow's world.
                </Text>
            </View>

            {/* ============================================ */}
            {/* SECTION B: MARQUEE LABEL (SQUARE CORNERS)   */}
            {/* ============================================ */}
            <View
                className="bg-[#FFEB3B] border-[3px] border-black py-3 overflow-hidden mb-4"
                style={{
                    marginHorizontal: 4,
                    transform: [{ rotate: '-1deg' }] // Subtle tilt for dynamic Neo-Brutalism effect
                }}
            >
                <Animated.View style={[marqueeStyle, { flexDirection: 'row', width: 2000 }]}>
                    {/* Measure text width */}
                    <Text
                        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
                        className="absolute opacity-0 font-[ArchivoBlack_400Regular] text-black text-lg tracking-widest"
                    >
                        {MARQUEE_TEXT}
                    </Text>

                    {/* Render multiple copies for infinite loop */}
                    {[...Array(12)].map((_, i) => (
                        <Text key={i} className="font-[ArchivoBlack_400Regular] text-black text-lg tracking-widest">
                            {MARQUEE_TEXT}
                        </Text>
                    ))}
                </Animated.View>
            </View>

            {/* ============================================ */}
            {/* SECTION C: SIGNIFIYA EVENTS CARD             */}
            {/* ============================================ */}
            <View className="bg-[#FFF8E1] border-[3px] border-black rounded-3xl p-4 pb-10 min-h-[500px]">

                {/* Header */}
                <View className="items-center my-6">
                    <Text className="font-[Inter_700Bold] text-4xl text-black italic -mb-2">SIGNIFIYA</Text>
                    <Text className="font-[Inter_700Bold] text-4xl text-black italic">EVENTS</Text>
                    <Text className="font-[Inter_400Regular] text-gray-500 text-center mt-2 px-8">
                        Discover the diverse range of events happening at Signifiya'26.
                    </Text>
                </View>

                {/* ============================================ */}
                {/* FILTER PILLS (Interactive)                  */}
                {/* ============================================ */}
                <View className="flex-row flex-wrap justify-center gap-2 mb-8">
                    {filters.map((filter, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedCategory(filter)} // Change active filter
                            className={`px-4 py-2 rounded-full border-2 border-black ${selectedCategory === filter ? 'bg-black' : 'bg-white'
                                }`}
                        >
                            <Text className={`font-bold text-sm ${selectedCategory === filter ? 'text-white' : 'text-black'
                                }`}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ============================================ */}
                {/* EVENT CARDS (Filtered by category)          */}
                {/* ============================================ */}
                <View className="gap-6">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => (
                            <EventCard
                                key={index}
                                title={event.title}
                                date={event.date}
                                category={event.category}
                                description={event.description}
                                prizePool={event.prizePool}
                                imageColor={event.imageColor}
                                buttonColor={event.buttonColor}
                            />
                        ))
                    ) : (
                        // No events found message
                        <View className="items-center py-12">
                            <Text className="font-[Inter_700Bold] text-gray-400 text-lg">
                                No events in this category yet!
                            </Text>
                            <Text className="font-[Inter_400Regular] text-gray-400 text-sm mt-2">
                                Check back soon for updates.
                            </Text>
                        </View>
                    )}
                </View>

            </View>
        </View>
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
}

const EventCard = ({ title, date, category, description, prizePool, imageColor, buttonColor }: EventCardProps) => {
    return (
        <View className="bg-white border-[3px] border-black rounded-3xl overflow-hidden shadow-sm">
            {/* Image Area Placeholder */}
            <View className="h-48 relative p-4 flex-row justify-between" style={{ backgroundColor: imageColor }}>
                {/* TODO: Replace with actual event images */}
                {/* Category Badge */}
                <View className="absolute top-4 right-4 bg-black px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">{category}</Text>
                </View>
            </View>

            {/* Content Area */}
            <View className="p-4 bg-white">
                {/* Event Title */}
                <Text className="font-[ArchivoBlack_400Regular] text-2xl text-black uppercase leading-7 mb-1">
                    {title}
                </Text>

                {/* Event Date */}
                <Text className="font-[Inter_700Bold] text-gray-400 text-sm mb-2">
                    {date}
                </Text>

                {/* Prize Pool Tag */}
                <View className="bg-[#B9F6CA] self-start px-3 py-1 rounded-full mb-2">
                    <Text className="font-bold text-xs text-black">Prize pool: {prizePool}</Text>
                </View>

                {/* Description */}
                <Text className="font-[Inter_400Regular] text-black mb-4">{description}</Text>

                {/* Action Buttons */}
                <View className="gap-3">
                    {/* View Details Button */}
                    <TouchableOpacity
                        className="border-2 border-black py-3 rounded-xl items-center"
                        style={{ backgroundColor: buttonColor }}
                    >
                        <Text className="font-[Inter_700Bold] text-black">VIEW DETAILS</Text>
                    </TouchableOpacity>

                    {/* Register Button */}
                    <TouchableOpacity className="bg-black py-3 rounded-xl items-center">
                        <Text className="font-[Inter_700Bold] text-white">REGISTER</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default DepartmentsEvents;
