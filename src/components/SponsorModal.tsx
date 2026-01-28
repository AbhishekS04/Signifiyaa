import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Download, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import SmoothButton from './ui/SmoothButton';

const { width, height } = Dimensions.get('window');

interface SponsorModalProps {
    visible: boolean;
    onClose: () => void;
}

const SponsorModal = ({ visible, onClose }: SponsorModalProps) => {
    // Fonts
    const FONT_HEADING = 'BBHBartle';
    const FONT_BODY = 'Gilton';

    const handleDownload = (type: 'Tech' | 'Non-Tech') => {
        Alert.alert('Download Started', `Downloading ${type} Brochure...`);
        // Actual download logic would go here (Linking.openURL)
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1">
                {/* Blur Background if needed, or just standard modal behavior */}
                {/* Using a solid container for the design provided */}

                <View className="flex-1 bg-[#FFF8E7] pt-12 pb-8 px-6 relative">
                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute top-12 right-6 z-50 bg-black/5 p-2 rounded-full"
                    >
                        <X color="black" size={24} />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                        <Animated.View entering={FadeInDown.delay(100).springify()}>
                            {/* Main Title */}
                            <View className="items-center mt-8 mb-4">
                                <Text className="text-4xl text-center leading-tight" style={{ fontFamily: FONT_HEADING }}>
                                    BECOME A
                                </Text>
                                <Text className="text-4xl text-center leading-tight italic" style={{ fontFamily: FONT_HEADING }}>
                                    SPONSOR
                                </Text>
                            </View>

                            {/* Subtitle */}
                            <Text className="text-center text-[#4B5563] text-lg mb-12 px-4 leading-6" style={{ fontFamily: FONT_BODY }}>
                                Partner with Signifiya'26 and{'\n'}be part of something{'\n'}extraordinary.
                            </Text>

                            {/* Section Header */}
                            <Text className="text-3xl text-center mb-8" style={{ fontFamily: FONT_HEADING }}>
                                Download Our{'\n'}Brochures
                            </Text>

                            {/* Brochure Cards */}
                            <View className="gap-8 items-center">
                                {/* Tech Brochure */}
                                <BrochureCard
                                    title="TECH BROCHURE"
                                    onPress={() => handleDownload('Tech')}
                                />

                                {/* Non-Tech Brochure */}
                                <BrochureCard
                                    title="NON-TECH"
                                    subtitle="BROCHURE"
                                    onPress={() => handleDownload('Non-Tech')}
                                />
                            </View>
                        </Animated.View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const BrochureCard = ({ title, subtitle, onPress }: { title: string, subtitle?: string, onPress: () => void }) => {
    const FONT_HEADING = 'BBHBartle'; // Using the bubbly font for card titles as seen in image
    const FONT_BODY = 'Gilton';

    return (
        <SmoothButton
            onPress={onPress}
            containerStyle={{ width: width * 0.7 }}
            buttonStyle="bg-white border-[3px] border-black rounded-[30px] p-8 items-center justify-center h-[200px]"
            shadowStyle="bg-black rounded-[30px]"
            depth={8}
        >
            {/* Circle Icon */}
            <View className="bg-black w-14 h-14 rounded-full items-center justify-center mb-4">
                <Download color="white" size={24} strokeWidth={2.5} />
            </View>

            {/* Title */}
            <Text className="text-xl text-center uppercase tracking-wide mb-1" style={{ fontFamily: 'Softura' }}>
                {title}
            </Text>
            {subtitle && (
                <Text className="text-xl text-center uppercase tracking-wide mb-1" style={{ fontFamily: 'Softura' }}>
                    {subtitle}
                </Text>
            )}

            {/* CTA */}
            <Text className="text-xs text-[#6B7280] mt-2" style={{ fontFamily: FONT_BODY }}>
                Click to download
            </Text>
        </SmoothButton>
    );
};

export default SponsorModal;
