import React from 'react';
import { View, Image } from 'react-native';

const GallerySection = () => {
    return (
        <View className="mb-8 mt-5">
            {/* Premium Dual Gallery Cards */}
            <View className="gap-6">
                {/* Image 1: Performance/Campus Shot */}
                <View
                    className="w-full rounded-[40px] overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    style={{ height: 250 }}
                >
                    <Image
                        source={{ uri: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>

                {/* Image 2: Team/Social Shot */}
                <View
                    className="w-full rounded-[40px] overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    style={{ height: 250 }}
                >
                    <Image
                        source={{ uri: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
            </View>
        </View>
    );
};

export default GallerySection;
