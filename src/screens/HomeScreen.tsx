import React, { useRef, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
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

export default function HomeScreen() {
    const scrollRef = useRef<ScrollView>(null);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const savedScrollPosition = useRef(0);

    // 🚀 Save scroll position when leaving the screen
    const handleScroll = (event: any) => {
        if (isFocused) {
            savedScrollPosition.current = event.nativeEvent.contentOffset.y;
        }
    };

    // 🚀 Restore scroll position when returning to the screen
    useEffect(() => {
        if (isFocused && savedScrollPosition.current > 0) {
            // Restore position after a brief delay to ensure content is rendered
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: savedScrollPosition.current, animated: false });
            }, 50);
        }
    }, [isFocused]);

    // 🚀 Listen for scroll-to-top event from CustomTabBar
    useEffect(() => {
        const unsubscribe = (navigation as any).addListener('homeScrollToTop', () => {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
            savedScrollPosition.current = 0; // Reset saved position
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollRef}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 0 }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}

                    // 🚀 Premium Scroll Performance
                    removeClippedSubviews={true}
                    decelerationRate="normal"

                    // 🎨 Visual Smoothness
                    overScrollMode="never"
                    bounces={true}
                    alwaysBounceVertical={false}
                    keyboardShouldPersistTaps="handled"

                    // ⚡ Performance Optimizations
                    nestedScrollEnabled={true}
                    persistentScrollbar={false}
                    snapToAlignment="start"

                    // 🧈 Anti-Jitter Specifics
                    directionalLockEnabled={true}
                    scrollToOverflowEnabled={false}
                    pagingEnabled={false}
                >
                    <StaggerEntrance>
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

                        {/* Social Connect at the very bottom */}
                        <SocialConnect />
                        <FooterSection />
                    </StaggerEntrance>

                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
