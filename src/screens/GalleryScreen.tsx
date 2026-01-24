import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import Ticker from '../components/Ticker';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock Data matching the reference image
const GALLERY_ITEMS = [
    {
        id: '1',
        title: 'THE OPENING CEREMONY',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', // Placeholder
        tag: 'CULTURAL',
        filename: 'IMG_1_2026.png'
    },
    {
        id: '2',
        title: 'HACKATHON GRIND',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', // Placeholder
        tag: 'TECH',
        filename: 'IMG_2_2026.png'
    },
    {
        id: '3',
        title: 'ROBO WARS ARENA',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', // Placeholder
        tag: 'TECH',
        filename: 'IMG_3_2026.png'
    },
    {
        id: '4',
        title: 'DJ NIGHT MADNESS',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', // Placeholder
        tag: 'VIBES',
        filename: 'IMG_4_2026.png'
    },
    {
        id: '5',
        title: 'BEHIND THE SCENES',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', // Placeholder
        tag: 'BTS',
        filename: 'IMG_5_2026.png'
    },
    {
        id: '6',
        title: 'PRIZE DISTRIBUTION',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', // Placeholder
        tag: 'CULTURAL',
        filename: 'IMG_6_2026.png'
    },
    {
        id: '7',
        title: 'GAMING ZONE',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', // Placeholder
        tag: 'TECH',
        filename: 'IMG_7_2026.png'
    },
    {
        id: '8',
        title: 'FOOD STALL SQUAD',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', // Placeholder
        tag: 'VIBES',
        filename: 'IMG_8_2026.png'
    },
];

const FILTERS = ['ALL', 'TECH', 'CULTURAL', 'VIBES', 'BTS'];

const GalleryScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
            <View className="flex-1 bg-black">
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

                    {/* Main "Block" - Exact Copy */}
                    <LinearGradient
                        colors={['#4a0e95', '#9844b2', '#c489d8', '#e6c8f0']} // Adjusted gradient to match reference (Dark purple -> Light fade)
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        className="mx-4 my-2 rounded-[50px] overflow-hidden pt-12 pb-16 items-center"
                        style={{ minHeight: 600 }} // Ensure it takes up significant space like the image
                    >
                        {/* Title */}
                        <Text className="text-white text-6xl tracking-tighter mb-12 shadow-sm"
                            style={{
                                fontFamily: 'Gilton'
                            }}>
                            GALLERY
                        </Text>

                        {/* Seamless Vertical Stacked Cards */}
                        <View className="items-center mb-8">
                            <View className="items-center">
                                {/* Card 2022 */}
                                <View className="bg-white border-[3px] border-black w-48 h-12 items-center justify-center shadow-md rounded-md z-10 mb-[-3px]">
                                    <Text className="text-black  text-xl tracking-widest"
                                    style={{
                                        fontFamily: 'Gilton'
                                    }}
                                    >EST. 2022</Text>
                                </View>

                                {/* Card 2023 */}
                                <View className="bg-white border-[3px] border-black w-48 h-12 items-center justify-center shadow-md rounded-md z-20 mb-[-3px]">
                                    <Text className="text-black  text-xl tracking-widest"
                                    style={{
                                        fontFamily: 'Gilton'
                                    }}
                                    >EST. 2023</Text>
                                </View>

                                {/* Card 2024 */}
                                <View className="bg-white border-[3px] border-black w-48 h-12 items-center justify-center shadow-md rounded-md z-30 mb-[-3px]">
                                    <Text className="text-black  text-xl tracking-widest"
                                    style={{
                                        fontFamily: 'Gilton'
                                    }}
                                    >EST. 2024</Text>
                                </View>

                                {/* Card 2025 (Fully Highlighted) */}
                                <View className="bg-black border-[3px] border-black w-48 h-12 items-center justify-center shadow-xl z-40 rounded-md">
                                    <Text className="text-white text-xl tracking-widest"
                                    style={{
                                        fontFamily: 'Gilton'
                                    }}
                                    >EST. 2025</Text>
                                </View>
                            </View>
                        </View>

                        {/* Subtitle */}
                        <View className="items-center mt-6">
                            <Text className="text-white text-lg opacity-90 tracking-tight"
                            style={{
                                fontFamily: 'Gilton'
                            }}
                            >
                                A collection of chaotic, beautiful, and
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <View className="bg-black px-2 py-0.5 mr-1 rotate-[-2deg] rounded-sm">
                                    <Text className="text-white text-lg tracking-wide"
                                    style={{
                                        fontFamily: 'Gilton'
                                    }}
                                    >unforgettable</Text>
                                </View>
                                <Text className="text-white text-lg opacity-90 tracking-tight"
                                style={{
                                    fontFamily: 'Gilton'
                                }}
                                >
                                    moments.
                                </Text>
                            </View>
                        </View>

                    </LinearGradient>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default GalleryScreen;
