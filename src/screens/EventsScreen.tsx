import React, { useState, memo } from 'react';
import { View, Text, LayoutAnimation, Platform, UIManager, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EVENTS_DATA } from '../data/EventsData';
import { useEvents } from '../hooks/useEvents';
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
    const { events } = useEvents();

    const filters = ['ALL', 'ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'];

    // 📂 Filter Logic
    const day1Events = activeFilter === 'ALL'
        ? events.filter(e => e.date && (e.date === '13th March' || e.date.includes('13')))
        : events.filter(e => (e.date === '13th March' || e.date?.includes('13')) && e.category === activeFilter);

    const day2Events = activeFilter === 'ALL'
        ? events.filter(e => e.date && (e.date === 'Day 2' || e.date === '14th March' || e.date.includes('14')))
        : events.filter(e => (e.date === 'Day 2' || e.date === '14th March' || e.date?.includes('14')) && e.category === activeFilter);

    const handleFilterChange = (filter: string) => {
        if (filter === activeFilter) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setActiveFilter(filter);
    };

    const handleDetailPress = (event: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleRegisterPress = (event: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        (navigation as any).navigate('EventRegistration');
    };

    const renderEvent = (event: any, index: number) => (
        <SketchyEventCard
            key={`${event.title}-${index}`}
            item={event}
            index={index}
            onPressRegister={() => handleRegisterPress(event)}
            onPressDetails={() => handleDetailPress(event)}
        />
    );

    const ListHeader = () => (
        <View className="px-4">
            <View className="mt-4 mb-8">
                <EventsHeader />
            </View>
        </View>
    );

    const data = [
        { id: 'header' },
        { id: 'day1' },
        { id: 'day2' }
    ];

    const renderItem = ({ item }: { item: any }) => {
        if (item.id === 'header') return <ListHeader />;

        if (item.id === 'day1') return (
            <View className="px-4 mb-12">
                <View className="w-full bg-[#FFF8E1] rounded-[30px] border-[3px] border-black pb-8 overflow-hidden">
                    <View className="items-end px-6 pt-8 mb-4">
                        <View className="z-20 mb-[-12px] mr-2" style={{ transform: [{ rotate: '2deg' }] }}>
                            <View className="relative">
                                <View className="absolute top-[5px] left-[5px] bg-black rounded-[6px] w-full h-full" />
                                <View className="bg-[#FFEB3B] border-[2.5px] border-black px-5 py-2 rounded-[6px]">
                                    <Text className="text-sm text-black tracking-tighter font-bold" style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                                        13th March, 2026
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className="z-10 relative h-[100px] w-[260px] mt-[-10px]">
                            <Svg height="100%" width="100%">
                                <SvgText fill="black" fontSize="85" fontFamily="ArchivoBlack_400Regular" x="6" y="86" letterSpacing="-4">Day 1</SvgText>
                                <SvgText stroke="black" strokeWidth="5" fill="black" fontSize="85" fontFamily="ArchivoBlack_400Regular" x="0" y="80" letterSpacing="-4">Day 1</SvgText>
                                <SvgText fill="white" fontSize="85" fontFamily="ArchivoBlack_400Regular" x="0" y="80" letterSpacing="-4">Day 1</SvgText>
                            </Svg>
                        </View>
                        <View className="bg-white border-[1.5px] px-3 py-1 rounded-[6px] mt-[-8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] z-20 mr-2 transform rotate-1">
                            <Text className="text-[10px] uppercase tracking-wide" style={{ fontFamily: 'Gilton' }}>Events & Guidelines</Text>
                        </View>
                    </View>
                    <View className="min-h-[100px]">
                        {day1Events.length > 0 ? (
                            day1Events.map((event, index) => renderEvent(event, index))
                        ) : (
                            <View className="items-center py-10">
                                <Text className="text-gray-400 text-lg font-bold">No Day 1 events!</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );

        if (item.id === 'day2') return (
            <View className="px-4 pb-20">
                <View className="w-full bg-[#E0F7FA] rounded-[30px] border-[3px] border-black pb-8 overflow-hidden">
                    <View className="items-end px-6 pt-8 mb-4">
                        <View className="z-20 mb-[-12px] mr-2" style={{ transform: [{ rotate: '2deg' }] }}>
                            <View className="relative">
                                <View className="absolute top-[5px] left-[5px] bg-black rounded-[6px] w-full h-full" />
                                <View className="bg-[#4DD0E1] border-[2.5px] border-black px-5 py-2 rounded-[6px]">
                                    <Text className="text-sm text-black tracking-tighter font-bold" style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                                        14th March, 2026
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className="z-10 relative h-[100px] w-[260px] mt-[-10px]">
                            <Svg height="100%" width="100%">
                                <SvgText fill="black" fontSize="85" fontFamily="ArchivoBlack_400Regular" x="6" y="86" letterSpacing="-4">Day 2</SvgText>
                                <SvgText stroke="black" strokeWidth="5" fill="black" fontSize="85" fontFamily="ArchivoBlack_400Regular" x="0" y="80" letterSpacing="-4">Day 2</SvgText>
                                <SvgText fill="white" fontSize="85" fontFamily="ArchivoBlack_400Regular" x="0" y="80" letterSpacing="-4">Day 2</SvgText>
                            </Svg>
                        </View>
                        <View className="bg-white border-[1.5px] px-3 py-1 rounded-[6px] mt-[-8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] z-20 mr-2 transform rotate-1">
                            <Text className="text-[10px] uppercase tracking-wide" style={{ fontFamily: 'Gilton' }}>Events & Guidelines</Text>
                        </View>
                    </View>
                    <View className="min-h-[100px]">
                        {day2Events.length > 0 ? (
                            day2Events.map((event, index) => renderEvent(event, index))
                        ) : (
                            <View className="items-center py-10">
                                <Text className="text-gray-400 text-lg font-bold">No Day 2 events!</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );

        return null;
    };

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={Platform.OS === 'android'}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </PageTransition>
        </SafeAreaView>
    );
};

export default EventsScreen;
