import React, { useState } from 'react';
import { View, Text, LayoutAnimation, Platform, UIManager, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EVENTS_DATA } from '../data/EventsData';
import { useEvents } from '../hooks/useEvents'; // [NEW]
import SmoothButton from '../components/ui/SmoothButton';
import EventsHeader from '../components/ui/EventsHeader';
import SketchyEventCard from '../components/ui/SketchyEventCard';
import { PageTransition } from '../components/navigation/PageTransition';
import Svg, { Text as SvgText } from 'react-native-svg';

// Enable LayoutAnimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SECTION_FONTS = {
    FILTER_LABEL: 'Gilton',
    DAY_HEADER: 'Gilton',
};

const EventsScreen = () => {

    // State
    const navigation = useNavigation();
    const [activeFilter, setActiveFilter] = useState('ALL');
    const { events } = useEvents(); // [NEW] Use hook

    const filters = ['ALL', 'ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'];

    // 📂 Filter Logic
    const day1Events = activeFilter === 'ALL'
        ? events.filter(e => e.date && (e.date === '25th March' || e.date.includes('25'))) // Relaxed date check
        : events.filter(e => (e.date === '25th March' || e.date?.includes('25')) && e.category === activeFilter);

    const day2Events = activeFilter === 'ALL'
        ? events.filter(e => e.date && (e.date === 'Day 2' || e.date === '26th March' || e.date.includes('26')))
        : events.filter(e => (e.date === 'Day 2' || e.date === '26th March' || e.date?.includes('26')) && e.category === activeFilter);

    const handleFilterChange = (filter: string) => {
        if (filter === activeFilter) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // Removed LayoutAnimation for instant filter switching
        setActiveFilter(filter);
    };

    const handleDetailPress = (event: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleRegisterPress = (event: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        (navigation as any).navigate('EventRegistration');
    };

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>
                <ScrollView
                    className="flex-1 bg-black"
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="w-full pb-20 px-4">
                        {/* 
                           CARD 1: EVENTS HEADER 
                           Added marginTop (mt-4) as requested to separate from top edge.
                        */}
                        <View className="mt-4 mb-8">
                            <EventsHeader />
                        </View>



                        {/* 
                           CARD 2: DAY 1 EVENTS
                           This whole block is now a "Card" with the cream background.
                        */}
                        <View className="w-full bg-[#FFF8E1] rounded-[30px] border-[3px] border-black pb-8 mb-12 overflow-hidden">
                            {/* Sticker Header - REF MATCH */}
                            <View className="items-end px-6 pt-8 mb-4">

                                {/* Date Pill (Yellow, Rotated) */}
                                {/* Date Pill (Yellow, Rotated) - Double Layer for Hard 3D Shadow */}
                                <View className="z-20 mb-[-12px] mr-2" style={{ transform: [{ rotate: '2deg' }] }}>
                                    <View className="relative">
                                        {/* Hard Shadow Layer */}
                                        <View className="absolute top-[5px] left-[5px] bg-black rounded-[6px] w-full h-full" />

                                        {/* Main Pill Layer */}
                                        <View className="bg-[#FFEB3B] border-[2.5px] border-black px-5 py-2 rounded-[6px]">
                                            <Text className="text-sm text-black tracking-tighter font-bold" style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                                                13th March, 2026
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Day 1 Text (SVG for Outline + 3D) */}
                                <View className="z-10 relative h-[100px] w-[260px] mt-[-10px]">
                                    <Svg height="100%" width="100%">
                                        {/* 1. Shadow Layer (Deep Black Block) */}
                                        <SvgText
                                            fill="black"
                                            fontSize="85"
                                            fontFamily="ArchivoBlack_400Regular"
                                            x="6"
                                            y="86"
                                            letterSpacing="-4"
                                        >
                                            Day 1
                                        </SvgText>

                                        {/* 2. Outline Layer (Thick Stroke Background) */}
                                        <SvgText
                                            stroke="black"
                                            strokeWidth="5"
                                            fill="black"
                                            fontSize="85"
                                            fontFamily="ArchivoBlack_400Regular"
                                            x="0"
                                            y="80"
                                            letterSpacing="-4"
                                        >
                                            Day 1
                                        </SvgText>

                                        {/* 3. Face Layer (Clean White Fill) */}
                                        <SvgText
                                            fill="white"
                                            fontSize="85"
                                            fontFamily="ArchivoBlack_400Regular"
                                            x="0"
                                            y="80"
                                            letterSpacing="-4"
                                        >
                                            Day 1
                                        </SvgText>
                                    </Svg>
                                </View>

                                {/* Guidelines Badge (Tucked Under) */}
                                <View className="bg-white border-[1.5px]  px-3 py-1 rounded-[6px] mt-[-8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] z-20 mr-2 transform rotate-1">
                                    <Text className="text-[10px] uppercase tracking-wide" style={{ fontFamily: 'Gilton' }}>
                                        Events & Guidelines
                                    </Text>
                                </View>
                            </View>

                            {/* List */}
                            <View className="min-h-[300px]">
                                {day1Events.length > 0 ? (
                                    day1Events.map((event, index) => (
                                        <SketchyEventCard
                                            key={`${event.title}-${index}`}
                                            item={event}
                                            index={index}
                                            onPressRegister={() => handleRegisterPress(event)}
                                            onPressDetails={() => handleDetailPress(event)}
                                        />
                                    ))
                                ) : (
                                    <View className="items-center py-20">
                                        <Text className="text-gray-400 text-lg font-bold">No Day 1 events for this category!</Text>
                                    </View>
                                )}
                            </View>
                        </View>


                        {/* 
                           CARD 3: DAY 2 EVENTS
                        */}
                        <View className="w-full bg-[#E0F7FA] rounded-[30px] border-[3px] border-black pb-8 overflow-hidden">
                            {/* Sticker Header - REF MATCH (Day 2) */}
                            <View className="items-end px-6 pt-8 mb-4">
                                {/* Date Pill (Cyan/White, Rotated) */}
                                {/* Date Pill (Cyan/White, Rotated) - Double Layer for Hard 3D Shadow */}
                                <View className="z-20 mb-[-12px] mr-2" style={{ transform: [{ rotate: '2deg' }] }}>
                                    <View className="relative">
                                        {/* Hard Shadow Layer */}
                                        <View className="absolute top-[5px] left-[5px] bg-black rounded-[6px] w-full h-full" />

                                        {/* Main Pill Layer */}
                                        <View className="bg-[#4DD0E1] border-[2.5px] border-black px-5 py-2 rounded-[6px]">
                                            <Text className="text-sm text-black tracking-tighter font-bold" style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                                                14th March, 2026
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Day 2 Text (SVG for Outline + 3D) */}
                                <View className="z-10 relative h-[100px] w-[260px] mt-[-10px]">
                                    <Svg height="100%" width="100%">
                                        {/* 1. Shadow Layer */}
                                        <SvgText
                                            fill="black"
                                            fontSize="85"
                                            fontFamily="ArchivoBlack_400Regular"
                                            x="6"
                                            y="86"
                                            letterSpacing="-4"
                                        >
                                            Day 2
                                        </SvgText>

                                        {/* 2. Outline Layer */}
                                        <SvgText
                                            stroke="black"
                                            strokeWidth="5"
                                            fill="black"
                                            fontSize="85"
                                            fontFamily="ArchivoBlack_400Regular"
                                            x="0"
                                            y="80"
                                            letterSpacing="-4"
                                        >
                                            Day 2
                                        </SvgText>

                                        {/* 3. Face Layer */}
                                        <SvgText
                                            fill="white"
                                            fontSize="85"
                                            fontFamily="ArchivoBlack_400Regular"
                                            x="0"
                                            y="80"
                                            letterSpacing="-4"
                                        >
                                            Day 2
                                        </SvgText>
                                    </Svg>
                                </View>

                                {/* Guidelines Badge */}
                                <View className="bg-white border-[1.5px]  px-3 py-1 rounded-[6px] mt-[-8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] z-20 mr-2 transform rotate-1">
                                    <Text className="text-[10px] uppercase tracking-wide" style={{ fontFamily: 'Gilton' }}>
                                        Events & Guidelines
                                    </Text>
                                </View>
                            </View>

                            {/* List */}
                            <View className="min-h-[200px]">
                                {day2Events.length > 0 ? (
                                    day2Events.map((event, index) => (
                                        <SketchyEventCard
                                            key={`${event.title}-${index}`}
                                            item={event}
                                            index={index}
                                            onPressRegister={() => handleRegisterPress(event)}
                                            onPressDetails={() => handleDetailPress(event)}
                                        />
                                    ))
                                ) : (
                                    <View className="items-center py-20">
                                        <Text className="text-gray-400 text-lg font-bold">No Day 2 events for this category!</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
};

export default EventsScreen;
