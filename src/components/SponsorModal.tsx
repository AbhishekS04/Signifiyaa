import React, { useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Dimensions, StyleSheet, Linking } from 'react-native';
import { Download, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SmoothButton from './ui/SmoothButton';

const { width } = Dimensions.get('window');

// ─── Static constants (module scope) ───────────────────────────────────────────
const FONT_HEADING = 'BBHBartle';
const FONT_BODY = 'Gilton';
const FONT_SUB = 'Softura';

const S = StyleSheet.create({
    fontHeading: { fontFamily: FONT_HEADING },
    fontBody: { fontFamily: FONT_BODY },
    fontSub: { fontFamily: FONT_SUB },
    scrollContent: { paddingBottom: 60, paddingTop: 80 },
    closeHitSlop: { top: 10, bottom: 10, left: 10, right: 10 } as any,
    cardContainer: { width: width * 0.75 },
});

const FADE_ENTER = FadeInDown.delay(100).springify();

interface SponsorModalProps {
    visible: boolean;
    onClose: () => void;
}

const TECH_BROCHURE_URL = 'https://mkjxhijmvlzsijgsfvyy.supabase.co/storage/v1/object/sign/signifiya/SPONSORSHIP%20BROCHURE%20SIGNIFIYA\'26_TECH.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iYTc1Y2FmZi1lOWU3LTQ2YWItODc1Ni00NjZkMmZlYWY3ZWIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaWduaWZpeWEvU1BPTlNPUlNISVAgQlJPQ0hVUkUgU0lHTklGSVlBJzI2X1RFQ0gucGRmIiwiaWF0IjoxNzcxNTEyMDYxLCJleHAiOjIwODY4NzIwNjF9.PjUzGIAyIxZBOVTUIbSEhjTuaNXfspVZRTSF0GoM-Ik';

const NON_TECH_BROCHURE_URL = 'https://mkjxhijmvlzsijgsfvyy.supabase.co/storage/v1/object/sign/signifiya/SPONSORSHIP%20BROCHURE%20SIGNIFIYA\'26_NON-TECH.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iYTc1Y2FmZi1lOWU3LTQ2YWItODc1Ni00NjZkMmZlYWY3ZWIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaWduaWZpeWEvU1BPTlNPUlNISVAgQlJPQ0hVUkUgU0lHTklGSVlBJzI2X05PTi1URUNILnBkZiIsImlhdCI6MTc3MTUxMTkyMCwiZXhwIjoyMDg2ODcxOTIwfQ.EzFG73tmHHuAGTgl5HjVvfnoLAjrGIwplZch84UtzPM';

const SponsorModal = React.memo(({ visible, onClose }: SponsorModalProps) => {

    const handleDownloadTech = useCallback(() => {
        Linking.openURL(TECH_BROCHURE_URL);
    }, []);

    const handleDownloadNonTech = useCallback(() => {
        Linking.openURL(NON_TECH_BROCHURE_URL);
    }, []);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-[#FFF8E7]">
                {/* Close Button */}
                <TouchableOpacity
                    onPress={onClose}
                    className="absolute top-12 right-6 z-50 bg-black/5 p-2 rounded-full"
                    hitSlop={S.closeHitSlop}
                >
                    <X color="black" size={28} />
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.scrollContent}>
                    <Animated.View entering={FADE_ENTER} className="px-6">

                        {/* 1. MAIN TITLE */}
                        <View className="items-center mb-6">
                            <Text className="text-4xl text-center text-black mb-2" style={S.fontHeading}>
                                BECOME A SPONSOR
                            </Text>
                        </View>

                        {/* 2. SUBTITLE */}
                        <Text className="text-center text-[#4B5563] text-lg mb-12 leading-6 px-4" style={S.fontBody}>
                            Partner with Signifiya'26 and{'\n'}be part of something{'\n'}extraordinary.
                        </Text>

                        {/* 3. SECTION HEADER */}
                        <View className="items-center mb-8">
                            <Text className="text-3xl text-center text-black leading-9" style={S.fontHeading}>
                                Download Our
                            </Text>
                            <Text className="text-3xl text-center text-black leading-9" style={S.fontHeading}>
                                Brochures
                            </Text>
                        </View>

                        {/* 4. BROCHURE CARDS */}
                        <View className="gap-8 items-center">
                            <BrochureCard
                                title="TECH BROCHURE"
                                onPress={handleDownloadTech}
                            />
                            <BrochureCard
                                title="NON-TECH"
                                subtitle="BROCHURE"
                                onPress={handleDownloadNonTech}
                            />
                        </View>

                    </Animated.View>
                </ScrollView>
            </View>
        </Modal>
    );
});

// ─── BrochureCard (memoized) ───────────────────────────────────────────────────
const BrochureCard = React.memo(({ title, subtitle, onPress }: {
    title: string; subtitle?: string; onPress: () => void;
}) => (
    <SmoothButton
        onPress={onPress}
        containerStyle={S.cardContainer}
        buttonStyle="bg-white border-[3px] border-black rounded-[30px] py-10 items-center justify-center"
        shadowStyle="bg-black rounded-[30px]"
        depth={10}
    >
        <View className="bg-black w-20 h-20 rounded-full items-center justify-center mb-5">
            <View className="items-center justify-center translate-y-1">
                <Download color="white" size={32} strokeWidth={2.5} />
            </View>
        </View>

        <Text className="text-xl text-center uppercase tracking-wide mb-1 text-black" style={S.fontSub}>
            {title}
        </Text>
        {subtitle && (
            <Text className="text-xl text-center uppercase tracking-wide mb-1 text-black" style={S.fontSub}>
                {subtitle}
            </Text>
        )}

        <Text className="text-sm text-[#6B7280] mt-3" style={S.fontBody}>
            Click to download
        </Text>
    </SmoothButton>
));

export default SponsorModal;
