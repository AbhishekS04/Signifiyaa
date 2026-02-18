import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { ArrowUpRight } from 'lucide-react-native';

const GallerySection = React.memo(() => {
    const navigation = useNavigation<any>();

    return (
        <View className="gap-6 px-4 mb-8">
            <View
                className="w-full rounded-[30px] overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                style={{ height: 250 }}
            >
                <Image
                    source={require('../../assets/Home_Screen_Images/about (1).webp')}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                />
            </View>

            <View
                className="w-full rounded-[30px] overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                style={{ height: 250 }}
            >
                <Image
                    source={require('../../assets/Home_Screen_Images/soet-au.webp')}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                />
            </View>

        </View>
    );
});

export default GallerySection;
