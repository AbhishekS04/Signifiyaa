import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, RefreshControl, FlatList } from 'react-native';
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
import FooterSection from '../components/FooterSection';
import { PageTransition } from '../components/navigation/PageTransition';
import GlobalMusicButton from '../components/GlobalMusicButton';

// ─── Stable constants hoisted outside render ───────────────────────────────────
const SAFE_AREA_EDGES = ['top', 'left', 'right'] as const;
const FLATLIST_CONTENT_STYLE = { paddingBottom: 0, backgroundColor: '#4ADE80' };
const MUSIC_BUTTON_POSITION = { position: 'absolute' as const, zIndex: 50, right: 20, top: 20 };
const REFRESH_COLORS = ['#ffffff'];

// ─── Section data (static — never changes, never re-created) ──────────────────
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

    // Stable callbacks
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

    // Scroll-to-top on tab re-press
    useEffect(() => {
        const params = route.params as any;
        if (params?.scrollToTop) {
            handleScrollToTop();
            navigation.setParams({ scrollToTop: undefined } as any);
        }
    }, [(route.params as any)?.scrollToTop]);

    // 60fps scroll tracking — runs on UI thread via Reanimated
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Music button follows overscroll — pure UI thread
    const musicButtonStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scrollY.value < 0 ? -scrollY.value : 0 }],
    }));

    // ─── Section renderer (memoized, keyed by section key) ─────────────────────
    const renderSection = useCallback(({ item, index }: { item: SectionItem; index: number }) => {
        let content: React.ReactNode;

        switch (item.key) {
            case 'hero':
                content = (
                    <View className="mb-4">
                        <HeroSection onSignInPress={handleSignInPress} scrollY={scrollY} />
                    </View>
                );
                break;
            case 'about':
                content = (
                    <View className="px-4 gap-4 pb-4">
                        <AboutSection />
                    </View>
                );
                break;
            case 'gallery':
                content = <GallerySection />;
                break;
            case 'departmentsEvents':
                content = (
                    <View className="px-4 gap-4">
                        <DepartmentsEvents scrollY={scrollY} />
                    </View>
                );
                break;
            case 'prizesSponsors':
                content = (
                    <View className="px-4 gap-4">
                        <PrizesSponsors scrollY={scrollY} />
                    </View>
                );
                break;
            case 'pastGlimpses':
                content = (
                    <View className="px-4 gap-4">
                        <PastGlimpses />
                    </View>
                );
                break;
            case 'teamSection':
                content = (
                    <View className="px-4 gap-4">
                        <TeamSection />
                    </View>
                );
                break;
            case 'faqSection':
                content = (
                    <View className="px-4 gap-4">
                        <FAQSection />
                    </View>
                );
                break;
            case 'newsletterSupport':
                content = (
                    <View className="px-4 gap-4">
                        <NewsletterSupport />
                    </View>
                );
                break;
            case 'socialConnect':
                content = <SocialConnect />;
                break;
            case 'footerSection':
                content = <FooterSection />;
                break;
            default:
                content = null;
        }

        return content;
    }, [handleSignInPress, scrollY]);

    const keyExtractor = useCallback((item: SectionItem) => item.key, []);

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={SAFE_AREA_EDGES}>
            <PageTransition style={{ flex: 1 }}>
                {/* Music Button — UI-thread animated, no JS re-renders */}
                <Animated.View style={[musicButtonStyle, MUSIC_BUTTON_POSITION]}>
                    <GlobalMusicButton />
                </Animated.View>

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
                    // Virtualization tuning — mount only nearby sections
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