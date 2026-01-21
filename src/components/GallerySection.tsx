import React from 'react';
import { View, Text, Image } from 'react-native';

const GallerySection = () => {
    return (
        <View className="mb-8 mt-5 px-2">
            {/* Header */}
            <View className="items-center mb-8">
                <Text className="text-black text-4xl uppercase tracking-tighter"
                    style={{ fontFamily: 'Gilton' }}>
                    CAMPUS SHOTS
                </Text>
            </View>

            {/* Image Gallery - Two Stacked Photos */}
            <View className="gap-4">
                {/* Campus/Building Photo */}
                <View className="w-full rounded-3xl overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <Image
                        source={{ uri: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg' }}
                        style={{
                            width: '100%',
                            height: 240,
                        }}
                        resizeMode="cover"
                    />
                </View>

                {/* Team Photo */}
                <View className="w-full rounded-3xl overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <Image
                        source={{ uri: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg' }}
                        style={{
                            width: '100%',
                            height: 240,
                        }}
                        resizeMode="cover"
                    />
                </View>
            </View>
        </View>
    );
};

export default GallerySection;
