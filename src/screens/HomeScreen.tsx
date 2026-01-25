import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
    useAnimatedRef,
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

export default function HomeScreen() {
    // 🔑 Use Reanimated Ref for Animated Components
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const navigation = useNavigation();
    const route = useRoute();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // ⬆️ Scroll Logic (2 Taps)
    const handleScrollToTop = useCallback(() => {
        // Use optional chaining for safety - standard way to scroll from JS
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, []);

    // 🔄 Pull to Refresh Logic
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        // Simulate a network request or data reload
        setTimeout(() => {
            setRefreshing(false);
            setRefreshKey(prev => prev + 1); // 🔄 Trigger Re-mount to replay animations
        }, 2000);
    }, []);

    // 🚀 Listen for Double-Click (params passed from TabNavigator)
    useEffect(() => {
        const params = route.params as any;
        if (params?.scrollToTop) {
            handleScrollToTop();
            // Reset param
            navigation.setParams({ scrollToTop: undefined } as any);
        }
    }, [(route.params as any)?.scrollToTop]);

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>

                {/* Main Scroll Content */}
                <Animated.ScrollView
                    ref={scrollRef}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 0,
                        minHeight: '100%'
                    }}
                    scrollEventThrottle={16}

                    // Native elastic bounce
                    bounces={true}
                    overScrollMode="always"

                    // Performance Props
                    removeClippedSubviews={true}
                    decelerationRate="normal"
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}

                    // 🔄 Native Refresh Control
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#ffffff" // iOS
                            colors={['#ffffff']} // Android
                            progressBackgroundColor="#171717" // Android
                        />
                    }
                >
                    <StaggerEntrance key={refreshKey}>
                        <View className="mb-4">
                            <HeroSection />
                        </View>
                        <View className="px-4 gap-4">
                            <AboutSection />
                            <GallerySection />
                            <DepartmentsEvents />
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

            {/* Global Music Button - Fixed Top Right */}
            <GlobalMusicButton />
        </SafeAreaView >
    );
}
