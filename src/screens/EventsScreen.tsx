import React, { useState } from 'react';
import { View, Text, LayoutAnimation, Platform, UIManager, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EVENTS_DATA } from '../data/EventsData';
import SmoothButton from '../components/ui/SmoothButton';
import EventsHeader from '../components/ui/EventsHeader';
import SketchyEventCard from '../components/ui/SketchyEventCard';
import { PageTransition } from '../components/navigation/PageTransition';

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
    const [activeFilter, setActiveFilter] = useState('ALL');

    const filters = ['ALL', 'ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'];

    // 📂 Filter Logic
    const day1Events = activeFilter === 'ALL'
        ? EVENTS_DATA.filter(e => e.date === '25th March')
        : EVENTS_DATA.filter(e => e.date === '25th March' && e.category === activeFilter);

    const day2Events = activeFilter === 'ALL'
        ? EVENTS_DATA.filter(e => e.date === 'Day 2')
        : EVENTS_DATA.filter(e => e.date === 'Day 2' && e.category === activeFilter);

    const handleFilterChange = (filter: string) => {
        if (filter === activeFilter) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveFilter(filter);
    };

    const handleDetailPress = (event: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleRegisterPress = (event: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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
                                <View className="bg-[#FFEB3B] border-[2.5px] border-black px-5 py-2 rounded-full transform -rotate-2 shadow-[4px_4px_0px_#000] z-20 mb-[-12px] mr-2">
                                    <Text className="text-sm text-black tracking-tighter" style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', fontWeight: 'bold' }}>
                                        13th March, 2026
                                    </Text>
                                </View>

                                {/* Day 1 Text (Layered for 3D Effect) */}
                                <View className="z-10 relative">
                                    {/* Shadow Layer (Black Background Block) */}
                                    <Text
                                        className="text-[85px] text-white tracking-tighter absolute top-[6px] left-[6px]"
                                        style={{
                                            fontFamily: 'ArchivoBlack_400Regular',
                                            includeFontPadding: false,
                                            lineHeight: 90
                                        }}
                                    >
                                        Day 1
                                    </Text>

                                    {/* Main Layer (White Foreground) */}
                                    <Text
                                        className="text-[85px] text-black tracking-tighter"
                                        style={{
                                            fontFamily: 'ArchivoBlack_400Regular',
                                            includeFontPadding: false,
                                            lineHeight: 90,
                                            textShadowColor: '#000',
                                            textShadowOffset: { width: 1, height: 1 },
                                            textShadowRadius: 1
                                        }}
                                    >
                                        Day 1
                                    </Text>
                                </View>

                                {/* Guidelines Badge (Tucked Under) */}
                                <View className="bg-white border-[1.5px] border-black px-3 py-1 rounded-[6px] mt-[-8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] z-20 mr-2 transform rotate-1">
                                    <Text className="text-[10px] uppercase tracking-wide" style={{ fontFamily: SECTION_FONTS.FILTER_LABEL }}>
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
                                <View className="bg-[#4DD0E1] border-[2.5px] border-black px-5 py-2 rounded-full transform rotate-1 shadow-[4px_4px_0px_#000] z-20 mb-[-12px] mr-2">
                                    <Text className="text-sm text-black tracking-tighter" style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', fontWeight: 'bold' }}>
                                        14th March, 2026
                                    </Text>
                                </View>

                                {/* Day 2 Text (Layered) */}
                                <View className="z-10 relative">
                                    {/* Shadow Layer */}
                                    <Text
                                        className="text-[85px] text-black tracking-tighter absolute top-[6px] left-[6px]"
                                        style={{
                                            fontFamily: 'ArchivoBlack_400Regular',
                                            includeFontPadding: false,
                                            lineHeight: 90
                                        }}
                                    >
                                        Day 2
                                    </Text>

                                    {/* Main Layer */}
                                    <Text
                                        className="text-[85px] text-white tracking-tighter"
                                        style={{
                                            fontFamily: 'ArchivoBlack_400Regular',
                                            includeFontPadding: false,
                                            lineHeight: 90,
                                            textShadowColor: '#000',
                                            textShadowOffset: { width: 1, height: 1 },
                                            textShadowRadius: 1
                                        }}
                                    >
                                        Day 2
                                    </Text>
                                </View>

                                {/* Guidelines Badge */}
                                <View className="bg-white border-[1.5px] border-black px-3 py-1 rounded-[6px] mt-[-8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] z-20 mr-2 transform -rotate-1">
                                    <Text className="text-[10px] font-bold text-black uppercase tracking-wide" style={{ fontFamily: SECTION_FONTS.FILTER_LABEL }}>
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
