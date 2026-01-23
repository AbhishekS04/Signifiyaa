import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

const PastGlimpses = () => {
    const photos = [
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg' },
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg' },
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg' },
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg' },
        { url: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg' },
    ];

    return (
        <View className="bg-[#FFF0F5] py-12 w-full items-center rounded-[40px] mb-6 overflow-hidden">
            {/* Header */}
            <View className={`items-center px-6 ${isSmallDevice ? 'mb-10' : 'mb-14'}`}>
                <Text className={`text-black uppercase leading-tight ${isSmallDevice ? 'text-5xl' : 'text-6xl'}`} style={{
                    fontFamily: 'Gilton',
                    letterSpacing: -1,
                }}>GLIMPSES OF</Text>
                <Text className={`text-black -mt-3 uppercase ${isSmallDevice ? 'text-5xl' : 'text-6xl'}`} style={{
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

            {/* Polaroid Timeline */}
            <View className="w-full relative" style={{ minHeight: 900 }}>


                {/* Photos in Zigzag Pattern */}
                <View className="w-full px-4">
                    {photos.map((photo, index) => (
                        <PolaroidCard
                            key={index}
                            photo={photo}
                            index={index}
                            isLeft={index % 2 === 0}
                        />
                    ))}
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

// Polaroid Card Component with Tape
const PolaroidCard = ({ photo, index, isLeft }: { photo: { url: string }, index: number, isLeft: boolean }) => {
    // Enhanced rotation angles for more impact
    const rotations = ['-6deg', '5deg', '-4deg', '6deg', '-5deg'];
    const rotation = rotations[index];

    return (
        <View style={{ marginBottom: 50, position: 'relative' }}>


            {/* Polaroid Card */}
            <View
                style={{
                    alignSelf: isLeft ? 'flex-start' : 'flex-end',
                    width: isSmallDevice ? 200 : 240,
                    transform: [{ rotate: rotation }],
                    position: 'relative', // Ensure tape is relative to this
                }}
            >
                {/* Tape Strip - Realistic Look */}
                <View
                    style={{
                        position: 'absolute',
                        width: 50,
                        height: 20,
                        backgroundColor: 'rgba(240, 230, 200, 0.97)', // Higher opacity for realism
                        top: -8, // Overlaps top edge
                        left: '50%',
                        marginLeft: -25, // Center it
                        zIndex: 20,
                        transform: [{ rotate: isLeft ? '-2deg' : '3deg' }], // Slight independent rotation
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.15,
                        shadowRadius: 1,
                        elevation: 3,
                        // Irregular edges simulation (subtle)
                        borderRightWidth: 0.5,
                        borderLeftWidth: 0.5,
                        borderColor: 'rgba(255,255,255,0.3)',
                    }}
                />

                {/* Polaroid Frame */}
                <View
                    className="bg-white rounded-xl shadow-xl border-[3px] border-black"
                    style={{
                        padding: 12,
                        paddingBottom: 40,
                    }}
                >
                    {/* Photo */}
                    <Image
                        source={{ uri: photo.url }}
                        className="w-full rounded-lg"
                        style={{
                            height: isSmallDevice ? 160 : 190,
                        }}
                        resizeMode="cover"
                    />

                    {/* Polaroid Bottom Space (simulates instant film) */}
                    <View className="absolute bottom-3 left-0 right-0 h-8" />
                </View>
            </View>
        </View>
    );
};

export default PastGlimpses;
