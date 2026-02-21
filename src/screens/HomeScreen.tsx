import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, RefreshControl, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
} from 'react-native-reanimated';

import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import GallerySection from '../components/GallerySection';
import DepartmentsEvents from '../components/DepartmentsEvents';
import PrizesSponsors from '../components/PrizesSponsors';
import PastGlimpses from '../components/PastGlimpses';
import TeamSection from '../components/TeamSection';
import FAQSection from '../components/FAQSection';
import NewsletterSupport from '../components/NewsletterSupport';
import SocialConnect from '../components/SocialConnect';
import BlinkitFooter from '../components/BlinkitFooter';
import { PageTransition } from '../components/navigation/PageTransition';
import GlobalMusicButton from '../components/GlobalMusicButton';

import { getOfferConfig } from '../../remoteConfig.js';

// ─── Stable constants ──────────────────────────────────────────────────────────
const SAFE_AREA_EDGES = ['top', 'left', 'right'] as const;
const FLATLIST_CONTENT_STYLE = { paddingBottom: 0 };
const MUSIC_BUTTON_POSITION = { position: 'absolute' as const, zIndex: 50, right: 20, top: 20 };
const REFRESH_COLORS = ['#ffffff'];

// ─── Section Types ─────────────────────────────────────────────────────────────
type SectionKey =
    | 'hero' | 'about' | 'gallery' | 'departmentsEvents'
    | 'prizesSponsors' | 'pastGlimpses' | 'teamSection'
    | 'faqSection' | 'newsletterSupport' | 'socialConnect' | 'footerSection';

interface SectionItem {
    key: SectionKey;
}

const SECTIONS: SectionItem[] = [
    { key: 'hero' },
    { key: 'about' },
    { key: 'gallery' },
    { key: 'departmentsEvents' },
    { key: 'prizesSponsors' },
    { key: 'pastGlimpses' },
    { key: 'teamSection' },
    { key: 'faqSection' },
    { key: 'newsletterSupport' },
    { key: 'socialConnect' },
    { key: 'footerSection' },
];

// ─── Home Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const flatListRef = useRef<FlatList>(null);
    const scrollY = useSharedValue(0);
    const navigation = useNavigation();
    const route = useRoute();

    const [refreshing, setRefreshing] = useState(false);
    const [offer, setOffer] = useState<any>(null);

    // ─── Load Offer On Mount ───────────────────────────────────────────────────
    useEffect(() => {
        async function loadOffer() {
            const data = await getOfferConfig();
            setOffer(data);
        }
        loadOffer();
    }, []);

    // ─── Navigation Handlers ───────────────────────────────────────────────────
    const handleSignInPress = useCallback(() => {
        (navigation as any).navigate('Auth');
    }, [navigation]);

    const handleScrollToTop = useCallback(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    useEffect(() => {
        const params = route.params as any;
        if (params?.scrollToTop) {
            handleScrollToTop();
            navigation.setParams({ scrollToTop: undefined } as any);
        }
    }, [(route.params as any)?.scrollToTop]);

    // ─── Scroll Tracking ───────────────────────────────────────────────────────
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const musicButtonStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scrollY.value < 0 ? -scrollY.value : 0 }],
    }));

    // ─── Section Renderer ──────────────────────────────────────────────────────
    const renderSection = useCallback(({ item }: { item: SectionItem }) => {
        switch (item.key) {
            case 'hero':
                return (
                    <View className="mb-4">
                        <HeroSection onSignInPress={handleSignInPress} scrollY={scrollY} />
                    </View>
                );
            case 'about':
                return (
                    <View className="px-4 gap-4 pb-4">
                        <AboutSection />
                    </View>
                );
            case 'gallery':
                return <GallerySection />;
            case 'departmentsEvents':
                return (
                    <View className="px-4 gap-4">
                        <DepartmentsEvents scrollY={scrollY} />
                    </View>
                );
            case 'prizesSponsors':
                return (
                    <View className="px-4 gap-4">
                        <PrizesSponsors />
                    </View>
                );
            case 'pastGlimpses':
                return (
                    <View className="px-4 gap-4">
                        <PastGlimpses />
                    </View>
                );
            case 'teamSection':
                return (
                    <View className="px-4 gap-4">
                        <TeamSection />
                    </View>
                );
            case 'faqSection':
                return (
                    <View className="px-4 gap-4">
                        <FAQSection />
                    </View>
                );
            case 'newsletterSupport':
                return (
                    <View className="px-4 gap-4">
                        <NewsletterSupport />
                    </View>
                );
            case 'socialConnect':
                return <SocialConnect />;
            case 'footerSection':
                return <BlinkitFooter />;
            default:
                return null;
        }
    }, [handleSignInPress, scrollY]);

    const keyExtractor = useCallback((item: SectionItem) => item.key, []);

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={SAFE_AREA_EDGES}>
            <PageTransition style={{ flex: 1 }}>

                {/* Offer Banner */}
                {offer && (
                    <View
                        style={{
                            backgroundColor: '#FFD700',
                            padding: 12,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 16 }}>
                            {offer.title}
                        </Text>
                        <Text style={{ color: '#000', marginTop: 4 }}>
                            {offer.message}
                        </Text>
                    </View>
                )}

                {/* Music Button */}
                <Animated.View style={[musicButtonStyle, MUSIC_BUTTON_POSITION]}>
                    <GlobalMusicButton />
                </Animated.View>

                {/* Main Scroll Content */}
                <Animated.FlatList
                    ref={flatListRef as any}
                    data={SECTIONS}
                    renderItem={renderSection}
                    keyExtractor={keyExtractor}
                    onScroll={scrollHandler}
                    scrollEventThrottle={1}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={FLATLIST_CONTENT_STYLE}
                    bounces={true}
                    overScrollMode="always"
                    removeClippedSubviews={true}
                    decelerationRate="normal"
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    initialNumToRender={3}
                    maxToRenderPerBatch={2}
                    windowSize={5}
                    updateCellsBatchingPeriod={50}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#ffffff"
                            colors={REFRESH_COLORS}
                            progressBackgroundColor="#171717"
                        />
                    }
                />
            </PageTransition>
        </SafeAreaView>
    );
}