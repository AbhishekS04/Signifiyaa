import React, { useState, useEffect, memo } from 'react';
import { View, Text, FlatList, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';

// Import footer components as requested
import SmoothButton from '../components/ui/SmoothButton';
import SocialConnect from '../components/SocialConnect';
import NewsletterSupport from '../components/NewsletterSupport';
import FooterSection from '../components/FooterSection';
import { PageTransition } from '../components/navigation/PageTransition';
import GlobalMusicButton from '../components/GlobalMusicButton';

// Mock Data matching the reference image
import { GALLERY_ITEMS, GALLERY_FILTERS } from '../data/GalleryData';
import GalleryCard from '../components/GalleryCard';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Extracted Filter Button with Tactile Click (Font Configurable)
const FilterButton = memo(({ label, isActive, onPress, font }: { label: string, isActive: boolean, onPress: () => void, font: string }) => (
    <SmoothButton
        onPress={onPress}
        containerStyle={{ minWidth: 100 }}
        buttonStyle={`px-8 py-2.5 border-[2.5px] border-black rounded-2xl items-center ${isActive ? 'bg-[#9d4edd]' : 'bg-white'}`}
        shadowStyle="bg-black rounded-2xl"
        depth={6}
    >
        <Text className={`uppercase text-[13px] tracking-widest ${isActive ? 'text-white' : 'text-black'}`} style={{ fontFamily: font }}>
            {label}
        </Text>
    </SmoothButton>
));

const GalleryScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState('ALL');

    // Marquee State
    const [textWidth, setTextWidth] = useState(0);
    const translateX = useSharedValue(0);
    const MARQUEE_TEXT = "★ CAPTURING MOMENTS ★ MAKING MEMORIES ★ SIGNIFIYA 2026 ★";

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

    // Single Active Image State
    const [activeImageId, setActiveImageId] = useState<string | null>(null);

    const handleCardToggle = (id: string) => {
        setActiveImageId(id);
    };

    const filteredItems = selectedFilter === 'ALL'
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter(item => item.tag === selectedFilter);

    // Helper to get font for a specific filter label
    const getFilterFont = (label: string) => {
        return GALLERY_FILTERS.find(f => f.label === label)?.font || 'Gilton';
    }

    const renderItem = ({ item }: { item: typeof GALLERY_ITEMS[0] }) => (
        <View className="px-4">
            <GalleryCard
                item={item}
                isActive={activeImageId === item.id}
                onToggle={() => handleCardToggle(item.id)}
            />
        </View>
    );

    const ListHeaderComponent = () => (
        <View>
            {/* Main Purple Block Header */}
            <LinearGradient
                colors={['#4a0e95', '#9844b2', '#c489d8', '#e6c8f0']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                className="mx-4 my-2 rounded-[30px] overflow-hidden pt-12 pb-16 items-center"
                style={{ minHeight: 500 }}
            >
                {/* Title */}
                <Text className="text-white text-6xl tracking-tighter mb-12 shadow-sm"
                    style={{ fontFamily: 'Gilton' }}>
                    GALLERY
                </Text>

                {/* 3D Neubrutalist Vertical Stacked Cards */}
                <View className="items-center mb-10">
                    {[2022, 2023, 2024, 2025].map((year, idx) => {
                        const isHighlighted = year === 2025;
                        return (
                            <View key={year} className="w-52 h-14 relative mb-[-4px]" style={{ zIndex: (idx + 1) * 10 }}>
                                <View className={`absolute top-1.5 left-1.5 w-48 h-12 rounded-md ${isHighlighted ? 'bg-[#5b21b6]' : 'bg-black'}`} />
                                <View className={`w-48 h-12 border-[3px] border-black rounded-md items-center justify-center ${isHighlighted ? 'bg-black' : 'bg-white'}`}>
                                    <Text className={`text-xl tracking-widest ${isHighlighted ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'Gilton' }}>
                                        EST. {year}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Subtitle */}
                <View className="items-center mt-8">
                    <Text className="text-white text-lg opacity-90 tracking-tight" style={{ fontFamily: 'Gilton' }}>
                        A collection of chaotic, beautiful, and
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <View className="bg-black px-2 py-0.5 mr-1 rotate-[-2deg] rounded-sm">
                            <Text className="text-white text-lg tracking-wide" style={{ fontFamily: 'Gilton' }}>unforgettable</Text>
                        </View>
                        <Text className="text-white text-lg opacity-90 tracking-tight" style={{ fontFamily: 'Gilton' }}>moments.</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Mannequin Section (Yellow Tilted Marquee) */}
            <View className="mt-8 px-4">
                <View
                    className="bg-[#FFEB3B] border-[3px] border-black py-3 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    style={{ transform: [{ rotate: '-1.5deg' }] }}
                >
                    <Animated.View style={[marqueeStyle, { flexDirection: 'row', width: 2500 }]}>
                        <Text
                            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
                            className="absolute opacity-0 text-black text-lg tracking-widest"
                            style={{ fontFamily: 'Gilton' }}
                        >
                            {MARQUEE_TEXT}
                        </Text>
                        {[...Array(8)].map((_, i) => (
                            <Text key={i} className="text-black text-lg tracking-widest" style={{ fontFamily: 'Gilton' }}>
                                {MARQUEE_TEXT}
                            </Text>
                        ))}
                    </Animated.View>
                </View>
            </View>

            {/* Filter Container Start */}
            <View className="mx-4 mt-8 bg-white border-[3px] border-black rounded-[30px] p-6 pb-0">
                <View className="items-center mb-6">
                    {/* Row 1: ALL, TECH */}
                    <View className="flex-row gap-4 mb-4">
                        <FilterButton
                            label="ALL"
                            isActive={selectedFilter === 'ALL'}
                            onPress={() => setSelectedFilter('ALL')}
                            font={getFilterFont('ALL')}
                        />
                        <FilterButton
                            label="TECH"
                            isActive={selectedFilter === 'TECH'}
                            onPress={() => setSelectedFilter('TECH')}
                            font={getFilterFont('TECH')}
                        />
                    </View>

                    {/* Row 2: CULTURAL, VIBES */}
                    <View className="flex-row gap-4 mb-4">
                        <FilterButton
                            label="CULTURAL"
                            isActive={selectedFilter === 'CULTURAL'}
                            onPress={() => setSelectedFilter('CULTURAL')}
                            font={getFilterFont('CULTURAL')}
                        />
                        <FilterButton
                            label="VIBES"
                            isActive={selectedFilter === 'VIBES'}
                            onPress={() => setSelectedFilter('VIBES')}
                            font={getFilterFont('VIBES')}
                        />
                    </View>

                    {/* Row 3: BTS */}
                    <View className="flex-row">
                        <FilterButton
                            label="BTS"
                            isActive={selectedFilter === 'BTS'}
                            onPress={() => setSelectedFilter('BTS')}
                            font={getFilterFont('BTS')}
                        />
                    </View>
                </View>
            </View>
        </View>
    );

    const ListFooterComponent = () => (
        <View className="mt-8">
            <View className="px-4 gap-4">
                <NewsletterSupport />
            </View>
            <SocialConnect />
            <FooterSection />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>
                <GlobalMusicButton />
                <View className="flex-1 bg-black">
                    <FlatList
                        data={filteredItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={ListHeaderComponent}
                        ListFooterComponent={ListFooterComponent}
                        contentContainerStyle={{ paddingBottom: 0 }}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={Platform.OS === 'android'}
                        initialNumToRender={4}
                        maxToRenderPerBatch={4}
                        windowSize={5}
                        getItemLayout={(_, index) => ({
                            length: 450,
                            offset: 450 * index,
                            index,
                        })}
                        ItemSeparatorComponent={() => <View className="h-10" />}
                        style={{ flex: 1 }}
                    />
                </View>
            </PageTransition>
        </SafeAreaView>
    );
};

export default GalleryScreen;
