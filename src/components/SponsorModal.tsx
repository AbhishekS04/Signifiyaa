import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Download, X, FileText } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SmoothButton from './ui/SmoothButton';

const { width } = Dimensions.get('window');

interface SponsorModalProps {
    visible: boolean;
    onClose: () => void;
}

const SponsorModal = ({ visible, onClose }: SponsorModalProps) => {
    // Fonts
    const FONT_HEADING = 'BBHBartle'; // Bubbly font
    const FONT_BODY = 'Gilton'; // Clean sans-serif
    const FONT_SUB = 'Softura'; // Wide/Modern font

    const handleDownload = (type: 'Tech' | 'Non-Tech') => {
        Alert.alert('Download Started', `Downloading ${type} Brochure...`);
        // Actual download logic would go here
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-[#FFF8E7]">
                {/* Close Button - Top Right */}
                <TouchableOpacity
                    onPress={onClose}
                    className="absolute top-12 right-6 z-50 bg-black/5 p-2 rounded-full"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <X color="black" size={28} />
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, paddingTop: 80 }}>
                    <Animated.View entering={FadeInDown.delay(100).springify()} className="px-6">

                        {/* 1. MAIN TITLE */}
                        <View className="items-center mb-6">
                            <Text className="text-4xl text-center text-black mb-2" style={{ fontFamily: FONT_HEADING }}>
                                BECOME A SPONSOR
                            </Text>
                        </View>

                        {/* 2. SUBTITLE */}
                        <Text className="text-center text-[#4B5563] text-lg mb-12 leading-6 px-4" style={{ fontFamily: FONT_BODY }}>
                            Partner with Signifiya'26 and{'\n'}be part of something{'\n'}extraordinary.
                        </Text>

                        {/* 3. SECTION HEADER */}
                        <View className="items-center mb-8">
                            <Text className="text-3xl text-center text-black leading-9" style={{ fontFamily: FONT_HEADING }}>
                                Download Our
                            </Text>
                            <Text className="text-3xl text-center text-black leading-9" style={{ fontFamily: FONT_HEADING }}>
                                Brochures
                            </Text>
                        </View>

                        {/* 4. BROCHURE CARDS */}
                        <View className="gap-8 items-center">
                            {/* Tech Brochure */}
                            <BrochureCard
                                title="TECH BROCHURE"
                                onPress={() => handleDownload('Tech')}
                                font={FONT_SUB}
                                bodyFont={FONT_BODY}
                            />

                            {/* Non-Tech Brochure */}
                            <BrochureCard
                                title="NON-TECH"
                                subtitle="BROCHURE"
                                onPress={() => handleDownload('Non-Tech')}
                                font={FONT_SUB}
                                bodyFont={FONT_BODY}
                            />
                        </View>

                    </Animated.View>
                </ScrollView>
            </View>
        </Modal>
    );
};

// Custom Card Component to match the Exact Reference Image
const BrochureCard = ({ title, subtitle, onPress, font, bodyFont }: { title: string, subtitle?: string, onPress: () => void, font: string, bodyFont: string }) => {
    return (
        <SmoothButton
            onPress={onPress}
            containerStyle={{ width: width * 0.75 }} // Slightly wider
            // White bg, Thick Border, Rounded Heavy
            buttonStyle="bg-white border-[3px] border-black rounded-[30px] py-10 items-center justify-center"
            // Deep Shadow to match reference
            shadowStyle="bg-black rounded-[30px]"
            depth={10}
        >
            {/* Circle Icon Black */}
            <View className="bg-black w-20 h-20 rounded-full items-center justify-center mb-5">
                {/* File Icon with Arrow */}
                <View className="items-center justify-center translate-y-1">
                    <Download color="white" size={32} strokeWidth={2.5} />
                </View>
            </View>

            {/* Title */}
            <Text className="text-xl text-center uppercase tracking-wide mb-1 text-black" style={{ fontFamily: font }}>
                {title}
            </Text>
            {subtitle && (
                <Text className="text-xl text-center uppercase tracking-wide mb-1 text-black" style={{ fontFamily: font }}>
                    {subtitle}
                </Text>
            )}

            {/* Subtext */}
            <Text className="text-sm text-[#6B7280] mt-3" style={{ fontFamily: bodyFont }}>
                Click to download
            </Text>
        </SmoothButton>
    );
};

export default SponsorModal;
