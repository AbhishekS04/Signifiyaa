import React, { useState, useEffect, useLayoutEffect, useMemo, useCallback, memo } from 'react';
import { View, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    Easing,
    useAnimatedScrollHandler,
    useAnimatedRef
} from 'react-native-reanimated';

// Components
import SmoothButton from '../components/ui/SmoothButton';
import SocialConnect from '../components/SocialConnect';
import NewsletterSupport from '../components/NewsletterSupport';
import FooterSection from '../components/FooterSection';
import { PageTransition } from '../components/navigation/PageTransition';
import GlobalMusicButton from '../components/GlobalMusicButton';
import GalleryCard from '../components/GalleryCard';

// Data
import { GALLERY_ITEMS, GALLERY_FILTERS } from '../data/GalleryData';

// --- Sub-Components ---

// filter font helper
const getFilterFont = (label: string) => {
    return GALLERY_FILTERS.find(f => f.label === label)?.font || 'Gilton';
};

const FilterButton = memo(({ label, isActive, onPress, font }: { label: string, isActive: boolean, onPress: () => void, font: string }) => {
    // Smooth press effect: scale down on press, instant scale up on filter switch
    const scale = useSharedValue(1);

    useLayoutEffect(() => {
        // Use layout effect for instant scale update on filter switch
        scale.value = isActive ? 1.05 : 1;
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Press in/out handlers for tactile feedback
    const handlePressIn = () => {
        scale.value = 0.95;
        onPress();
    };
    const handlePressOut = () => {
        // Restore correct scale instantly based on active state
        scale.value = isActive ? 1.05 : 1;
    };

    const handlePress = () => {
        // Visual release state only; filter already switched on press-in
        scale.value = 1.05;
    };

    return (
        <Animated.View style={animatedStyle}>
            <SmoothButton
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                containerStyle={{ minWidth: 100 }}
                buttonStyle={`px-8 py-2.5 border-[2.5px] border-black rounded-2xl items-center ${isActive ? 'bg-[#9d4edd]' : 'bg-white'}`}
                shadowStyle="bg-black rounded-2xl"
                depth={6}
            >
                <Text className={`uppercase text-[13px] tracking-widest ${isActive ? 'text-white' : 'text-black'}`} style={{ fontFamily: font }}>
                    {label}
                </Text>
            </SmoothButton>
        </Animated.View>
    );
});

const ItemSeparator = memo(() => <View className="h-10" />);

const ListFooterComponent = memo(() => (
    <View className="mt-8">
        <View className="px-4 gap-4">
            <NewsletterSupport />
        </View>
        <SocialConnect />
        <FooterSection />
        {/* Padding for Floating Filter */}
        <View className="h-48" />
    </View>
));

interface ListHeaderProps {
    selectedFilter: string;
    onFilterPress: (label: string) => void;
    elasticStyle: any;
}

const ListHeaderComponent = memo(({ selectedFilter, onFilterPress, elasticStyle }: ListHeaderProps) => {
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

    return (
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
            <View className="mt-8 px-4 mb-4">
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

            {/* Filter Container */}
            <Animated.View style={elasticStyle} className="mx-4 mt-8 bg-white border-[3px] border-black rounded-[30px] p-6 pb-0">
                <View className="items-center mb-6">
                    {/* Row 1: ALL, TECH */}
                    <View className="flex-row gap-4 mb-4">
                        <FilterButton
                            label="ALL"
                            isActive={selectedFilter === 'ALL'}
                            onPress={() => onFilterPress('ALL')}
                            font={getFilterFont('ALL')}
                        />
                        <FilterButton
                            label="TECH"
                            isActive={selectedFilter === 'TECH'}
                            onPress={() => onFilterPress('TECH')}
                            font={getFilterFont('TECH')}
                        />
                    </View>

                    {/* Row 2: CULTURAL, VIBES */}
                    <View className="flex-row gap-4 mb-4">
                        <FilterButton
                            label="CULTURAL"
                            isActive={selectedFilter === 'CULTURAL'}
                            onPress={() => onFilterPress('CULTURAL')}
                            font={getFilterFont('CULTURAL')}
                        />
                        <FilterButton
                            label="VIBES"
                            isActive={selectedFilter === 'VIBES'}
                            onPress={() => onFilterPress('VIBES')}
                            font={getFilterFont('VIBES')}
                        />
                    </View>

                    {/* Row 3: BTS */}
                    <View className="flex-row">
                        <FilterButton
                            label="BTS"
                            isActive={selectedFilter === 'BTS'}
                            onPress={() => onFilterPress('BTS')}
                            font={getFilterFont('BTS')}
                        />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
});

// --- Main Screen ---

const GalleryScreen: React.FC = () => {
    // --- Animated FlatList and Elastic Overscroll ---
    const scrollRef = useAnimatedRef<Animated.FlatList<any>>();
    const scrollY = useSharedValue(0);

    // 60fps-optimized scroll handler
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    }, []);

    // Elastic filter card transform (only on negative overscroll)
    const elasticStyle = useAnimatedStyle(() => {
        'worklet';
        // Only animate when pulling DOWN (negative scrollY)
        const y = scrollY.value < 0 ? -scrollY.value * 0.6 : 0;
        return { transform: [{ translateY: y }] };
    }, []);

    const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
    const [activeImageId, setActiveImageId] = useState<string | null>(null);

    // Immediate filter switch: update state only, no scroll or delay
    const handleFilterPress = useCallback((label: string) => {
        setSelectedFilter(label);
    }, []);

    const handleCardToggle = useCallback((id: string) => {
        setActiveImageId(id);
    }, []);

    // Filter Logic
    const itemsByFilter = useMemo(() => {
        const grouped: Record<string, typeof GALLERY_ITEMS> = { ALL: GALLERY_ITEMS };

        GALLERY_ITEMS.forEach((item) => {
            if (!grouped[item.tag]) {
                grouped[item.tag] = [] as typeof GALLERY_ITEMS;
            }
            grouped[item.tag].push(item as (typeof GALLERY_ITEMS)[number]);
        });

        return grouped;
    }, []);

    const filteredItems = itemsByFilter[selectedFilter] || GALLERY_ITEMS;

    // Render Items
    const renderItem = useCallback(({ item }: { item: typeof GALLERY_ITEMS[0] }) => (
        <View className="px-4">
            <GalleryCard
                item={item}
                isActive={activeImageId === item.id}
                onToggle={() => handleCardToggle(item.id)}
            />
        </View>
    ), [activeImageId, handleCardToggle]);

    const keyExtractor = useCallback((item: typeof GALLERY_ITEMS[0]) => item.id, []);

    // Memoize the Header render function to pass down to FlatList
    // Note: We use a render function that returns the memoized component
    const renderHeader = useCallback(() => (
        <ListHeaderComponent
            selectedFilter={selectedFilter}
            onFilterPress={handleFilterPress}
            elasticStyle={elasticStyle}
        />
    ), [selectedFilter, handleFilterPress, elasticStyle]); // elasticStyle is stable from useAnimatedStyle

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>
                <GlobalMusicButton />
                <View className="flex-1 bg-black">
                    <Animated.FlatList
                        ref={scrollRef}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        data={filteredItems}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        ListHeaderComponent={renderHeader}
                        ListFooterComponent={ListFooterComponent}
                        contentContainerStyle={{ paddingBottom: 0 }}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={Platform.OS === 'android'}
                        initialNumToRender={2}
                        maxToRenderPerBatch={2}
                        updateCellsBatchingPeriod={50}
                        windowSize={5}
                        getItemLayout={(_, index) => ({
                            length: 450, // Approximate height
                            offset: 450 * index,
                            index,
                        })}
                        ItemSeparatorComponent={ItemSeparator}
                        style={{ flex: 1 }}
                        // Crucial: extraData ensures list updates when selectedFilter changes
                        // even if data reference remains same (though here data changes so it's fine)
                        extraData={selectedFilter}
                    />
                </View>
            </PageTransition>
        </SafeAreaView>
    );
};

export default GalleryScreen;
