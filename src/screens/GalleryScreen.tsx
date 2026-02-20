import React, { useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    cancelAnimation,
    Easing,
    useAnimatedScrollHandler,
    useAnimatedRef,
} from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

// Components
import SmoothButton from '../components/ui/SmoothButton';
import NewsletterSupport from '../components/NewsletterSupport';
import FooterSection from '../components/FooterSection';
import { PageTransition } from '../components/navigation/PageTransition';
import GlobalMusicButton from '../components/GlobalMusicButton';
import GalleryCard from '../components/GalleryCard';

// Data
import { GALLERY_ITEMS, GALLERY_FILTERS } from '../data/GalleryData';
import type { GalleryItem } from '../data/GalleryData';

/* ── module-scope constants ───────────────────────────────── */
const MARQUEE_TEXT = '★ CAPTURING MOMENTS ★ MAKING MEMORIES ★ SIGNIFIYA 2026 ★';
const MARQUEE_COPIES = 8;

/** Pre-computed font lookup — avoids `.find()` on every render */
const FILTER_FONT_MAP: Record<string, string> = Object.fromEntries(
    GALLERY_FILTERS.map(f => [f.label, f.font]),
);

/* ── sub-components ───────────────────────────────────────── */

const FilterButton = React.memo(({ label, isActive, onPress }: {
    label: string; isActive: boolean; onPress: () => void;
}) => {
    const scale = useSharedValue(1);

    useLayoutEffect(() => {
        scale.value = isActive ? 1.05 : 1;
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = 0.95;
        onPress();
    };
    const handlePressOut = () => {
        scale.value = isActive ? 1.05 : 1;
    };
    const handlePress = () => {
        scale.value = 1.05;
    };

    const font = FILTER_FONT_MAP[label] ?? 'Gilton';

    return (
        <Animated.View style={animatedStyle}>
            <SmoothButton
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                containerStyle={s.filterBtnContainer}
                buttonStyle={`px-8 py-2.5 border-[2.5px] border-black rounded-2xl items-center ${isActive ? 'bg-[#9d4edd]' : 'bg-white'}`}
                shadowStyle="bg-black rounded-2xl"
                depth={6}
            >
                <Text
                    className={`uppercase text-[13px] tracking-widest ${isActive ? 'text-white' : 'text-black'}`}
                    style={{ fontFamily: font }}
                >
                    {label}
                </Text>
            </SmoothButton>
        </Animated.View>
    );
});

const ItemSeparator = React.memo(() => <View style={s.separator} />);

const ListFooter = React.memo(() => (
    <View style={s.footerWrap}>
        <View style={s.footerInner}>
            <NewsletterSupport />
        </View>
        <FooterSection />
        <View style={s.footerPad} />
    </View>
));

/* ── memoized marquee — focus-aware, pauses when screen loses focus ── */
const Marquee = React.memo(({ isFocused }: { isFocused: boolean }) => {
    const measuredRef = useRef(false);
    const widthRef = useRef(0);
    const translateX = useSharedValue(0);

    const handleLayout = useCallback((e: any) => {
        if (measuredRef.current) return;
        const w = e.nativeEvent.layout.width;
        if (w > 0) {
            measuredRef.current = true;
            widthRef.current = w;
            // Initial start handled by the isFocused effect below
        }
    }, []);

    useEffect(() => {
        if (isFocused && widthRef.current > 0) {
            translateX.value = withRepeat(
                withTiming(-widthRef.current, { duration: 4000, easing: Easing.linear }),
                -1,
                false,
            );
        } else {
            cancelAnimation(translateX);
        }
        return () => { cancelAnimation(translateX); };
    }, [isFocused]);

    // Also kick off when width first measured (if focused)
    useEffect(() => {
        if (widthRef.current > 0 && isFocused) {
            translateX.value = withRepeat(
                withTiming(-widthRef.current, { duration: 4000, easing: Easing.linear }),
                -1,
                false,
            );
        }
    }, [widthRef.current]);

    const marqueeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={s.marqueeOuter}>
            <Animated.View style={[marqueeStyle, s.marqueeRow]}>
                {/* Hidden copy for measuring one segment */}
                <Text onLayout={handleLayout} style={[s.marqueeHidden, s.marqueeFont]}>
                    {MARQUEE_TEXT}
                </Text>
                {Array.from({ length: MARQUEE_COPIES }).map((_, i) => (
                    <Text key={i} style={[s.marqueeText, s.marqueeFont]}>{MARQUEE_TEXT}</Text>
                ))}
            </Animated.View>
        </View>
    );
});

/* ── memoized header — only re-renders on selectedFilter change ─ */
interface GalleryHeaderProps {
    selectedFilter: string;
    filterHandlers: (() => void)[];
    elasticStyle: any;
    isFocused: boolean;
}

const GalleryHeader = React.memo(({ selectedFilter, filterHandlers, elasticStyle, isFocused }: GalleryHeaderProps) => (
    <View>
        {/* Purple Block Header */}
        <LinearGradient
            colors={['#4a0e95', '#9844b2', '#c489d8', '#e6c8f0']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="mx-4 my-2 rounded-[30px] overflow-hidden pt-12 pb-16 items-center"
            style={s.gradientMin}
        >
            <Text className="text-white text-6xl tracking-tighter mb-12 shadow-sm" style={s.gilton}>
                GALLERY
            </Text>

            {/* Year cards */}
            <View className="items-center mb-10">
                {YEAR_CARDS.map(({ year, highlight }, idx) => (
                    <View key={year} className="w-52 h-14 relative mb-[-4px]" style={{ zIndex: (idx + 1) * 10 }}>
                        <View className={`absolute top-1.5 left-1.5 w-48 h-12 rounded-md ${highlight ? 'bg-[#5b21b6]' : 'bg-black'}`} />
                        <View className={`w-48 h-12 border-[3px] border-black rounded-md items-center justify-center ${highlight ? 'bg-black' : 'bg-white'}`}>
                            <Text className={`text-xl tracking-widest ${highlight ? 'text-white' : 'text-black'}`} style={s.gilton}>
                                EST. {year}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Subtitle */}
            <View className="items-center mt-8">
                <Text className="text-white text-lg opacity-90 tracking-tight" style={s.gilton}>
                    A collection of chaotic, beautiful, and
                </Text>
                <View style={s.subtitleRow}>
                    <View style={s.subtitleTag}>
                        <Text className="text-white text-lg tracking-wide" style={s.gilton}>unforgettable</Text>
                    </View>
                    <Text className="text-white text-lg opacity-90 tracking-tight" style={s.gilton}>moments.</Text>
                </View>
            </View>
        </LinearGradient>

        {/* Marquee — focus-aware, pauses when screen is not active */}
        <View style={s.marqueePad}>
            <Marquee isFocused={isFocused} />
        </View>

        {/* Filter grid */}
        <Animated.View style={elasticStyle} className="mx-4 mt-8 bg-white border-[3px] border-black rounded-[30px] p-6 pb-0">
            <View style={s.filterGrid}>
                <View style={s.filterRow}>
                    <FilterButton label="ALL" isActive={selectedFilter === 'ALL'} onPress={filterHandlers[0]} />
                    <FilterButton label="TECH" isActive={selectedFilter === 'TECH'} onPress={filterHandlers[1]} />
                </View>
                <View style={s.filterRow}>
                    <FilterButton label="CULTURAL" isActive={selectedFilter === 'CULTURAL'} onPress={filterHandlers[2]} />
                    <FilterButton label="VIBES" isActive={selectedFilter === 'VIBES'} onPress={filterHandlers[3]} />
                </View>
                <View style={s.filterRowSingle}>
                    <FilterButton label="BTS" isActive={selectedFilter === 'BTS'} onPress={filterHandlers[4]} />
                </View>
            </View>
        </Animated.View>
    </View>
));

const YEAR_CARDS = Object.freeze([
    { year: 2022, highlight: false },
    { year: 2023, highlight: false },
    { year: 2024, highlight: false },
    { year: 2025, highlight: true },
]);

/* ── gallery item row — wraps GalleryCard with stable onToggle ─ */
const GalleryRow = React.memo(({ item, onToggle }: {
    item: GalleryItem; onToggle: (id: string) => void;
}) => {
    const handleToggle = useCallback(() => onToggle(item.id), [onToggle, item.id]);
    return (
        <View style={s.cardPad}>
            <GalleryCard item={item} isActive={false} onToggle={handleToggle} />
        </View>
    );
});

/* ── main screen ──────────────────────────────────────────── */
const GalleryScreen: React.FC = () => {
    const scrollRef = useAnimatedRef<Animated.FlatList<any>>();
    const scrollY = useSharedValue(0);
    const isFocused = useIsFocused();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    }, []);

    const elasticStyle = useAnimatedStyle(() => {
        'worklet';
        const y = scrollY.value < 0 ? -scrollY.value * 0.6 : 0;
        return { transform: [{ translateY: y }] };
    }, []);

    const [selectedFilter, setSelectedFilter] = useState('ALL');

    const handleFilterPress = useCallback((label: string) => {
        setSelectedFilter(label);
    }, []);

    /** Pre-bound per-filter handlers — stable array, avoids inline closures in header */
    const filterHandlers = useMemo(
        () => GALLERY_FILTERS.map(f => () => handleFilterPress(f.label)),
        [handleFilterPress],
    );

    const handleCardToggle = useCallback((id: string) => {
        // Toggle is now local to each card; this callback kept for potential cross-card logic
    }, []);

    /* Filter logic — pre-grouped once, selected by key */
    const itemsByFilter = useMemo(() => {
        const grouped: Record<string, GalleryItem[]> = { ALL: GALLERY_ITEMS };
        GALLERY_ITEMS.forEach(item => {
            (grouped[item.tag] ??= []).push(item);
        });
        return grouped;
    }, []);

    const filteredItems = itemsByFilter[selectedFilter] ?? GALLERY_ITEMS;

    /* Stable renderItem — zero dependency on active state */
    const renderItem = useCallback(({ item }: { item: GalleryItem }) => (
        <GalleryRow item={item} onToggle={handleCardToggle} />
    ), [handleCardToggle]);

    const keyExtractor = useCallback((item: GalleryItem) => item.id, []);

    const listHeader = useMemo(() => (
        <GalleryHeader
            selectedFilter={selectedFilter}
            filterHandlers={filterHandlers}
            elasticStyle={elasticStyle}
            isFocused={isFocused}
        />
    ), [selectedFilter, filterHandlers, elasticStyle, isFocused]);

    const renderListHeader = useCallback(() => listHeader, [listHeader]);

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>
                <GlobalMusicButton />
                <View style={s.flex1bg}>
                    <Animated.FlatList
                        ref={scrollRef}
                        onScroll={scrollHandler}
                        scrollEventThrottle={1}
                        data={filteredItems}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        ListHeaderComponent={renderListHeader}
                        ListFooterComponent={ListFooter}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={Platform.OS === 'android'}
                        initialNumToRender={2}
                        maxToRenderPerBatch={2}
                        updateCellsBatchingPeriod={50}
                        windowSize={5}
                        ItemSeparatorComponent={ItemSeparator}
                        style={s.flex1}
                    />
                </View>
            </PageTransition>
        </SafeAreaView>
    );
};

export default GalleryScreen;

/* ── styles ───────────────────────────────────────────────── */
const s = StyleSheet.create({
    flex1: { flex: 1 },
    flex1bg: { flex: 1, backgroundColor: '#000' },
    separator: { height: 40 },
    cardPad: { paddingHorizontal: 16 },
    gilton: { fontFamily: 'Gilton' },

    /* filter button */
    filterBtnContainer: { minWidth: 100 },
    filterGrid: { alignItems: 'center', marginBottom: 24 },
    filterRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    filterRowSingle: { flexDirection: 'row' },

    /* footer */
    footerWrap: { marginTop: 32, backgroundColor: '#4ADE80' },
    footerInner: { paddingHorizontal: 16, gap: 16 },
    footerPad: { height: 0 },

    /* gradient */
    gradientMin: { minHeight: 500 },

    /* subtitle */
    subtitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    subtitleTag: {
        backgroundColor: '#000',
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 4,
        borderRadius: 2,
        transform: [{ rotate: '-2deg' }],
    },

    /* marquee */
    marqueePad: { marginTop: 32, paddingHorizontal: 16, marginBottom: 16 },
    marqueeOuter: {
        backgroundColor: '#FFEB3B',
        borderWidth: 3,
        borderColor: '#000',
        paddingVertical: 12,
        overflow: 'hidden',
        transform: [{ rotate: '-1.5deg' }],
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    marqueeRow: { flexDirection: 'row', width: 2500 },
    marqueeHidden: { position: 'absolute', opacity: 0 },
    marqueeText: { color: '#000', fontSize: 18, letterSpacing: 3 },
    marqueeFont: { fontFamily: 'Gilton' },
});
