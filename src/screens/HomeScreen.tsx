import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 0 }}

                // 🚀 Premium Scroll Performance
                removeClippedSubviews={false} // Disabled to prevent stuttering on some devices
                decelerationRate={0.988} // Stable momentum - not too fast to prevent jank
                scrollEventThrottle={16} // 60fps - sweet spot for smoothness without over-processing

                // 🎨 Visual Smoothness
                overScrollMode="never" // Cleaner scroll experience (Android)
                bounces={true} // Natural iOS bounce
                alwaysBounceVertical={false} // Only bounce when content exceeds screen
                disableIntervalMomentum={true} // Smoother continuous scrolling
                keyboardShouldPersistTaps="handled" // Prevent scroll interruption

                // ⚡ Performance Optimizations
                nestedScrollEnabled={true} // Better Android compatibility
                persistentScrollbar={false} // Hide scrollbar for cleaner look
                snapToAlignment="start" // Crisp scroll stopping

                // 🧈 Anti-Jitter Specifics
                directionalLockEnabled={true} // Prevent diagonal scrolling jank
                scrollToOverflowEnabled={false} // Prevent over-scroll jank
                pagingEnabled={false} // Continuous smooth scroll
            >
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

                {/* Social Connect at the very bottom, effectively part of the footer but distinct */}
                <SocialConnect />
                <FooterSection />

            </ScrollView>
        </SafeAreaView>
    );
}
