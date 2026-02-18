import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
    useAnimatedRef,
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    withTiming,
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
import { StaggerEntrance } from '../components/animations/StaggerEntrance';
import GlobalMusicButton from '../components/GlobalMusicButton';

// Stable style objects hoisted outside render — avoids new object allocation every frame
const SAFE_AREA_EDGES = ['top', 'left', 'right'] as const;
const CONTENT_CONTAINER_STYLE = { paddingBottom: 0, minHeight: '100%' as const };
const MUSIC_BUTTON_POSITION = { position: 'absolute' as const, zIndex: 50, right: 20, top: 20 };
const REFRESH_COLORS = ['#ffffff'];

export default function HomeScreen() {
    const scrollRef = useAnimatedRef<ScrollView>();
    const scrollY = useSharedValue(0);
    const navigation = useNavigation();
    const route = useRoute();
    const [refreshing, setRefreshing] = useState(false);

    // Stable callback ref — prevents HeroSection re-render from prop change
    const handleSignInPress = useCallback(() => {
        (navigation as any).navigate('Auth');
    }, [navigation]);

    const handleScrollToTop = useCallback(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        const params = route.params as any;
        if (params?.scrollToTop) {
            handleScrollToTop();
            navigation.setParams({ scrollToTop: undefined } as any);
        }
    }, [(route.params as any)?.scrollToTop]);

    // 60fps scroll handler — runs on UI thread via Reanimated
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Music button follows overscroll — pure UI thread, no JS re-renders
    const musicButtonStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: scrollY.value < 0 ? -scrollY.value : 0 }
        ]
    }));

    // Memoize RefreshControl to prevent re-creation on every render
    const refreshControl = useMemo(() => (
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
            colors={REFRESH_COLORS}
            progressBackgroundColor="#171717"
        />
    ), [refreshing, onRefresh]);

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={SAFE_AREA_EDGES}>
            <PageTransition style={{ flex: 1 }}>
                {/* Music Button — UI-thread animated, no JS re-renders */}
                <Animated.View style={[musicButtonStyle, MUSIC_BUTTON_POSITION]}>
                    <GlobalMusicButton />
                </Animated.View>

                <Animated.ScrollView
                    ref={scrollRef as any}
                    onScroll={scrollHandler}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={CONTENT_CONTAINER_STYLE}
                    scrollEventThrottle={16}
                    bounces={true}
                    overScrollMode="always"
                    removeClippedSubviews={true}
                    decelerationRate="normal"
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    refreshControl={refreshControl}
                >
                    <StaggerEntrance>
                        <View className="mb-4">
                            <HeroSection onSignInPress={handleSignInPress} />
                        </View>
                        <View className="px-4 gap-4 pb-4">
                            <AboutSection />
                        </View>

                        <View className="mb-0">
                            <GallerySection />
                        </View>

                        <View className="px-4 gap-4">
                            <DepartmentsEvents scrollY={scrollY} />
                            <PrizesSponsors />
                            <PastGlimpses />
                            <TeamSection />
                            <FAQSection />
                            <NewsletterSupport />
                        </View>
                        <SocialConnect />
                        <FooterSection />
                    </StaggerEntrance>
                </Animated.ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}