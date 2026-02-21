import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';
import { getGalleryImage, GALLERY_ITEMS } from '../data/GalleryData';

// ─── StyleSheet (module scope — zero per-render cost) ──────────────────────────
const S = StyleSheet.create({
    imageContainer: {
        width: '100%',
        aspectRatio: 4 / 3,
    },
    imageFull: {
        width: '100%',
        height: '100%',
    },
});

const GallerySection = React.memo(() => {
    const enterOpacity = useSharedValue(0);
    const enterTranslateY = useSharedValue(30);

    useEffect(() => {
        enterOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        enterTranslateY.value = withSpring(0, { damping: 14, stiffness: 100 });
    }, []);

    const entranceStyle = useAnimatedStyle(() => ({
        opacity: enterOpacity.value,
        transform: [{ translateY: enterTranslateY.value }],
    }));

    return (
        <Animated.View style={entranceStyle}>
            <View className="gap-6 px-4 mb-8">
                {GALLERY_ITEMS.filter(item => !['2', '3', '5'].includes(item.id)).slice(0, 2).map((item) => (
                    <View
                        key={item.id}
                        className="w-full rounded-[30px] overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        style={S.imageContainer}
                    >
                        <Image
                            source={getGalleryImage(item.id)}
                            style={S.imageFull}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={200}
                        />
                    </View>
                ))}
            </View>
        </Animated.View>
    );
});

export default GallerySection;
