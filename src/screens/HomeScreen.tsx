import { ScrollView, View, SafeAreaView } from 'react-native';
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
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 0 }}
                // Buttery smooth momentum scrolling
                decelerationRate={0.985} // Very slow deceleration = maximum momentum
                scrollEventThrottle={16} // 60fps scroll events
                overScrollMode="never" // Cleaner scroll experience (Android)
                bounces={true} // Natural iOS bounce
                nestedScrollEnabled={true} // Better Android compatibility
            >
                <View className="mb-4">
                    <HeroSection />
                </View>

                <View className="p-2 gap-4">
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
