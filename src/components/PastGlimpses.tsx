import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

const PastGlimpses = () => {
    const photos: { url: string; size: 'large' | 'medium' }[] = [
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', size: 'large' },
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', size: 'medium' },
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', size: 'large' },
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', size: 'medium' },
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg', size: 'large' },
    ];

    const rotations = ['-4deg', '3.5deg', '-2.5deg', '4deg', '-3deg'];
    const sizes = {
        large: { width: isSmallDevice ? 180 : 220, height: isSmallDevice ? 150 : 180 },
        medium: { width: isSmallDevice ? 160 : 190, height: isSmallDevice ? 130 : 155 }
    };

    return (
        <View className="bg-[#FFF0F5] py-12 w-full items-center rounded-[40px] mb-6 overflow-hidden">
            {/* Header */}
            <View className={`items-center px-6 ${isSmallDevice ? 'mb-10' : 'mb-14'}`}>
                <Text className={`text-black uppercase leading-tight ${isSmallDevice ? 'text-5xl' : 'text-6xl'}`} style={{
                    fontFamily: 'Gilton',
                    letterSpacing: -1,
                }}>GLIMPSES OF</Text>
                <Text className={`text-black -mt-3 uppercase ${isSmallDevice ? 'text-5xl' : 'text-6xl'}`} style={
                    {
                        fontFamily: 'Gilton',
                        letterSpacing: -1,
                    }}>PAST</Text>
                <View className="w-16 h-1 bg-red-500 mt-4 rounded-full" />
                <Text className="text-gray-600 text-center text-base px-6 mt-6 leading-6"
                    style={{
                        fontFamily: 'Softura',
                    }}>
                    Relive the best moments from our previous events.
                </Text>
            </View>

            {/* Vertical Timeline with Photos */}
            <View className="w-full items-center relative">
                {/* Red vertical line */}
                <View
                    className="absolute bg-red-500 rounded-full"
                    style={{
                        width: 3,
                        top: 30,
                        bottom: 30,
                        left: '50%',
                        marginLeft: -1.5,
                    }}
                />

                {/* Photos */}
                <View className="w-full items-center gap-10 px-6">
                    {photos.map((photo, index) => {
                        const rotation = rotations[index];
                        const photoSize = sizes[photo.size];

                        return (
                            <View key={index} className="items-center relative" style={{ zIndex: 10 }}>
                                {/* Enhanced red dot */}
                                <View className="w-4 h-4 bg-red-500 rounded-full border-[3px] border-white mb-5 shadow-md" />

                                {/* Premium Polaroid frame */}
                                <View
                                    className="bg-white rounded-2xl shadow-2xl"
                                    style={{
                                        transform: [{ rotate: rotation }],
                                        width: photoSize.width,
                                        padding: 12,
                                        paddingBottom: 36,
                                        borderWidth: 1,
                                        borderColor: '#e5e5e5',
                                    }}
                                >
                                    {/* Subtle tape effect */}
                                    <View
                                        className="absolute -top-2 bg-white/40 border border-gray-200/50 rounded-sm"
                                        style={{
                                            width: 50,
                                            height: 20,
                                            left: '50%',
                                            marginLeft: -25,
                                            transform: [{ rotate: '-5deg' }],
                                        }}
                                    />

                                    <Image
                                        source={{ uri: photo.url }}
                                        style={{
                                            width: '100%',
                                            height: photoSize.height,
                                            borderRadius: 6,
                                        }}
                                        resizeMode="cover"
                                    />

                                    {/* Inner shadow for depth */}
                                    <View
                                        className="absolute inset-0 rounded-2xl"
                                        style={{
                                            borderWidth: 1,
                                            borderColor: 'rgba(0,0,0,0.05)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Footer Button */}
            <View className="mt-8">
                <TouchableOpacity
                    className="bg-black px-12 py-5 rounded-full shadow-xl border-2 border-black"
                    activeOpacity={0.85}
                >
                    <Text className="text-white text-base uppercase tracking-[2px]"
                        style={{
                            fontFamily: 'Softura',
                        }}>
                        VIEW GALLERY
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default PastGlimpses;
