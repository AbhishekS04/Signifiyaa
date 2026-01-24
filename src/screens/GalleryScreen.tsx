import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';

// Import footer components as requested
import SocialConnect from '../components/SocialConnect';
import FooterSection from '../components/FooterSection';
// NewsletterSupport removed as per user request

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock Data matching the reference image
import { GALLERY_ITEMS, GALLERY_FILTERS } from '../data/GalleryData';

const GalleryScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState('ALL');

    // Marquee State
    const [textWidth, setTextWidth] = useState(0);
    const translateX = useSharedValue(0);
    const MARQUEE_TEXT = "★ CAPTURING MOMENTS ★ MAKING MEMORIES ★ SIGNIFIYA 2026 ★";

    useEffect(() => {
        if (textWidth > 0) {
            translateX.value = withRepeat(
                withTiming(-textWidth, {
                    duration: 4000,
                    easing: Easing.linear,
                }),
                -1,
                false
            );
        }
    }, [textWidth]);

    const marqueeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const filteredItems = selectedFilter === 'ALL'
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter(item => item.tag === selectedFilter);

    // Helper to get font for a specific filter label
    const getFilterFont = (label: string) => {
        return GALLERY_FILTERS.find(f => f.label === label)?.font || 'Gilton';
    }

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <View className="flex-1 bg-black">
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

                    {/* Main Purple Block Header */}
                    <LinearGradient
                        colors={['#4a0e95', '#9844b2', '#c489d8', '#e6c8f0']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        className="mx-4 my-2 rounded-[30px] overflow-hidden pt-12 pb-16 items-center"
                        style={{ minHeight: 500 }}
                    >
                        {/* Title */}
                        <Text className="text-white text-6xl tracking-tighter mb-12 shadow-sm"
                            style={{ fontFamily: 'Gilton' }}>
                            GALLERY
                        </Text>

                        {/* 3D Neubrutalist Vertical Stacked Cards */}
                        <View className="items-center mb-10">
                            {[2022, 2023, 2024, 2025].map((year, idx) => {
                                const isHighlighted = year === 2025;
                                return (
                                    <View key={year} className="w-52 h-14 relative mb-[-4px]" style={{ zIndex: (idx + 1) * 10 }}>
                                        <View className={`absolute top-1.5 left-1.5 w-48 h-12 rounded-md ${isHighlighted ? 'bg-[#5b21b6]' : 'bg-black'}`} />
                                        <View className={`w-48 h-12 border-[3px] border-black rounded-md items-center justify-center ${isHighlighted ? 'bg-black' : 'bg-white'}`}>
                                            <Text className={`text-xl tracking-widest ${isHighlighted ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'Gilton' }}>
                                                EST. {year}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Subtitle */}
                        <View className="items-center mt-8">
                            <Text className="text-white text-lg opacity-90 tracking-tight" style={{ fontFamily: 'Gilton' }}>
                                A collection of chaotic, beautiful, and
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <View className="bg-black px-2 py-0.5 mr-1 rotate-[-2deg] rounded-sm">
                                    <Text className="text-white text-lg tracking-wide" style={{ fontFamily: 'Gilton' }}>unforgettable</Text>
                                </View>
                                <Text className="text-white text-lg opacity-90 tracking-tight" style={{ fontFamily: 'Gilton' }}>moments.</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Mannequin Section (Yellow Tilted Marquee) */}
                    <View className="mt-8 px-4">
                        <View
                            className="bg-[#FFEB3B] border-[3px] border-black py-3 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            style={{ transform: [{ rotate: '-1.5deg' }] }}
                        >
                            <Animated.View style={[marqueeStyle, { flexDirection: 'row', width: 2500 }]}>
                                <Text
                                    onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
                                    className="absolute opacity-0 text-black text-lg tracking-widest"
                                    style={{ fontFamily: 'Gilton' }}
                                >
                                    {MARQUEE_TEXT}
                                </Text>
                                {[...Array(8)].map((_, i) => (
                                    <Text key={i} className="text-black text-lg tracking-widest" style={{ fontFamily: 'Gilton' }}>
                                        {MARQUEE_TEXT}
                                    </Text>
                                ))}
                            </Animated.View>
                        </View>
                    </View>

                    {/* Main Content Card Block (White Container) */}
                    <View className="mx-4 mt-8 bg-white border-[3px] border-black rounded-[30px] p-6 mb-12 min-h-[500px]">

                        {/* Filters Refinement (Exact Match Spacing) */}
                        <View className="items-center mb-12">
                            {/* Row 1: ALL, TECH */}
                            <View className="flex-row gap-4 mb-4">
                                <FilterButton
                                    label="ALL"
                                    isActive={selectedFilter === 'ALL'}
                                    onPress={() => setSelectedFilter('ALL')}
                                    font={getFilterFont('ALL')}
                                />
                                <FilterButton
                                    label="TECH"
                                    isActive={selectedFilter === 'TECH'}
                                    onPress={() => setSelectedFilter('TECH')}
                                    font={getFilterFont('TECH')}
                                />
                            </View>

                            {/* Row 2: CULTURAL, VIBES */}
                            <View className="flex-row gap-4 mb-4">
                                <FilterButton
                                    label="CULTURAL"
                                    isActive={selectedFilter === 'CULTURAL'}
                                    onPress={() => setSelectedFilter('CULTURAL')}
                                    font={getFilterFont('CULTURAL')}
                                />
                                <FilterButton
                                    label="VIBES"
                                    isActive={selectedFilter === 'VIBES'}
                                    onPress={() => setSelectedFilter('VIBES')}
                                    font={getFilterFont('VIBES')}
                                />
                            </View>

                            {/* Row 3: BTS */}
                            <View className="flex-row">
                                <FilterButton
                                    label="BTS"
                                    isActive={selectedFilter === 'BTS'}
                                    onPress={() => setSelectedFilter('BTS')}
                                    font={getFilterFont('BTS')}
                                />
                            </View>
                        </View>

                        {/* Polaroid Gallery List */}
                        <View className="gap-10">
                            {filteredItems.map((item) => (
                                <View key={item.id} className="relative">
                                    {/* Main 3D Shadow Layer */}
                                    <View className="absolute top-1.5 left-1.5 w-full h-full bg-black rounded-[32px]" />

                                    {/* The Polaroid Card */}
                                    <View className="bg-white border-[3px] border-black rounded-[32px] p-4 overflow-hidden">

                                        {/* Image Container - Fixed stretching/gaps */}
                                        <View className="w-full h-80 rounded-[20px] border-[3px] border-black overflow-hidden relative bg-black">
                                            <Image
                                                source={{ uri: item.image }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                                            />

                                            {/* Tag Badge */}
                                            <View className="absolute top-3 right-3 bg-black px-3 py-1.5 rounded-md border border-white/20">
                                                <Text className="text-white text-[10px] font-black tracking-widest uppercase" style={{ fontFamily: 'Gilton' }}>
                                                    {item.tag}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Content Block */}
                                        <View className="flex-row justify-between items-center mt-6 mb-2 px-1">
                                            <View className="flex-1">
                                                <Text className="text-black text-2xl tracking-tighter uppercase"
                                                    style={{ fontFamily: item.titleFont || 'Gilton' }}>
                                                    {item.title}
                                                </Text>
                                                <Text className="text-black/40 text-[11px] mt-1 tracking-wider" style={{ fontFamily: 'Softura' }}>
                                                    {item.filename}
                                                </Text>
                                            </View>

                                            {/* Heart Button with Tactile 3D Effect */}
                                            <View className="relative w-12 h-12">
                                                <View className="absolute top-1.5 left-1.5 w-full h-full bg-black rounded-full" />
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    className="w-full h-full bg-red-500 border-[2.5px] border-black rounded-full items-center justify-center active:translate-x-1.5 active:translate-y-1.5"
                                                    onPress={() => { }}
                                                >
                                                    <Heart fill="white" color="white" size={20} strokeWidth={2.5} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Social Connect & Footer (Pasted from Home Screen) */}
                    <SocialConnect />
                    <FooterSection />

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

// Extracted Filter Button with Tactile Click (Font Configurable)
const FilterButton = ({ label, isActive, onPress, font }: { label: string, isActive: boolean, onPress: () => void, font: string }) => (
    <View className="relative">
        <View className="absolute top-1.5 left-1.5 w-full h-full bg-black rounded-2xl" />
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            className={`px-8 py-2.5 border-[2.5px] border-black rounded-2xl active:translate-x-1.5 active:translate-y-1.5 ${isActive ? 'bg-[#9d4edd]' : 'bg-white'}`}
            style={{ minWidth: 100, alignItems: 'center' }}
        >
            <Text className={`uppercase text-[13px] tracking-widest ${isActive ? 'text-white' : 'text-black'}`} style={{ fontFamily: font }}>
                {label}
            </Text>
        </TouchableOpacity>
    </View>
);

export default GalleryScreen;
