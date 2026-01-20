import React from 'react';
import { View, Text, Image } from 'react-native';

const GallerySection = () => {
    return (
        <View className="mb-12 mt-4">
            {/* Header */}
            <View className="items-center mb-8">
                <Text className="text-black font-[ArchivoBlack_400Regular] text-4xl uppercase tracking-tighter"
                    style={{ textShadowColor: '#E1BEE7', textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 0 }}>
                    CAMPUS SHOTS
                </Text>
            </View>

            <View className="gap-8 px-4">
                {/* Image Card 1: Rotated Left */}
                <View className="bg-white p-3 pb-4 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    style={{ transform: [{ rotate: '-2deg' }] }}>
                    <View className="w-full h-64 border-2 border-black overflow-hidden bg-gray-200">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2886&auto=format&fit=crop' }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <Text className="font-[Inter_900Black] text-center mt-3 text-xl uppercase tracking-tighter">
                        ADAMAS UNIVERSITY
                    </Text>
                    <Text className="font-[Inter_700Bold] text-center text-[10px] text-gray-500 uppercase tracking-widest">
                        EST. 2026
                    </Text>
                </View>

                {/* Image Card 2: Rotated Right */}
                <View className="bg-[#E1BEE7] p-3 pb-4 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    style={{ transform: [{ rotate: '1.5deg' }] }}>
                    <View className="w-full h-72 border-2 border-black overflow-hidden bg-gray-200">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2940&auto=format&fit=crop' }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <Text className="font-[Inter_900Black] text-center mt-3 text-xl uppercase tracking-tighter">
                        VIBRANT COMMUNITY
                    </Text>
                    <Text className="font-[Inter_700Bold] text-center text-[10px] text-gray-600 uppercase tracking-widest">
                        STUDENT LIFE
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default GallerySection;
