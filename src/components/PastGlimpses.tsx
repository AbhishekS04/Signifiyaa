import React, { useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';

// ─── Constants (module scope) ──────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL = SCREEN_WIDTH < 380;
const CARD_WIDTH = IS_SMALL ? 200 : 240;
const PHOTO_HEIGHT = IS_SMALL ? 160 : 190;

// ─── Static data (module scope — stable reference forever) ─────────────────────
const PHOTOS = Object.freeze([
    { id: '1', url: require('../../assets/Gallery/gall1.webp') },
    { id: '2', url: require('../../assets/Gallery/gall2.webp') },
    { id: '3', url: require('../../assets/Gallery/gall3.webp') },
    { id: '4', url: require('../../assets/Gallery/gall4.webp') },
    { id: '5', url: require('../../assets/Gallery/gall5.webp') },
]);

// Pre-computed rotation presets (static — no per-render cost)
const ROTATION_PRESETS = Object.freeze([
    Object.freeze({ transform: [{ rotate: '-6deg' }] }),
    Object.freeze({ transform: [{ rotate: '5deg' }] }),
    Object.freeze({ transform: [{ rotate: '-4deg' }] }),
    Object.freeze({ transform: [{ rotate: '6deg' }] }),
    Object.freeze({ transform: [{ rotate: '-5deg' }] }),
]);

const TAPE_ROTATION_LEFT = Object.freeze({ transform: [{ rotate: '-2deg' }] });
const TAPE_ROTATION_RIGHT = Object.freeze({ transform: [{ rotate: '3deg' }] });

// ─── StyleSheet (created once) ─────────────────────────────────────────────────
const S = StyleSheet.create({
    // Fonts
    fontGilton: { fontFamily: 'Gilton', letterSpacing: -1 },
    fontSoftura: { fontFamily: 'Softura' },
    // Timeline
    timelineMinH: { minHeight: 900 },
    // Card
    cardMargin: { marginBottom: 50, position: 'relative' },
    cardLeft: { alignSelf: 'flex-start', width: CARD_WIDTH, position: 'relative' },
    cardRight: { alignSelf: 'flex-end', width: CARD_WIDTH, position: 'relative' },
    // Tape
    tape: {
        position: 'absolute',
        width: 50,
        height: 20,
        backgroundColor: 'rgba(240, 230, 200, 0.97)',
        top: -8,
        left: '50%' as any,
        marginLeft: -25,
        zIndex: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 3,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    // Polaroid frame
    framePad: { padding: 12, paddingBottom: 40 },
    // Image
    photo: { width: '100%' as any, height: PHOTO_HEIGHT, borderRadius: 8 },
});

// ─── PolaroidCard (fully memoized, zero inline styles) ─────────────────────────
const PolaroidCard = React.memo(({ photo, index, isLeft }: {
    photo: { id: string; url: any }; index: number; isLeft: boolean;
}) => {
    const rotationStyle = ROTATION_PRESETS[index % ROTATION_PRESETS.length];
    const tapeRotation = isLeft ? TAPE_ROTATION_LEFT : TAPE_ROTATION_RIGHT;
    const alignStyle = isLeft ? S.cardLeft : S.cardRight;

    // Image source — static require() is already cached, but guard for remote URLs
    const imageSource = useMemo(() => {
        const url = photo.url;
        if (typeof url === 'string' && (url.startsWith('http') || url.startsWith('https'))) {
            return { uri: url };
        }
        return url;
    }, [photo.url]);

    return (
        <View style={S.cardMargin}>
            <View style={[alignStyle, rotationStyle]}>
                {/* Tape Strip */}
                <View style={[S.tape, tapeRotation]} />

                {/* Polaroid Frame */}
                <View className="bg-white rounded-xl shadow-xl border-[3px] border-black" style={S.framePad}>
                    <Image
                        source={imageSource}
                        style={S.photo}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                    />
                    <View className="absolute bottom-3 left-0 right-0 h-8" />
                </View>
            </View>
        </View>
    );
});

// ─── Main Component ────────────────────────────────────────────────────────────
const PastGlimpses = React.memo(() => {
    const navigation = useNavigation<any>();

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

    const handleGalleryPress = useCallback(() => navigation.navigate('Gallery'), [navigation]);

    return (
        <Animated.View style={entranceStyle}>
            <View className="bg-[#FFF0F5] py-12 w-full items-center rounded-[30px] mb-6 overflow-hidden">
                {/* Header */}
                <View className={`items-center px-6 ${IS_SMALL ? 'mb-10' : 'mb-14'}`}>
                    <Text className={`text-black uppercase leading-tight ${IS_SMALL ? 'text-5xl' : 'text-6xl'}`} style={S.fontGilton}>GLIMPSES OF</Text>
                    <Text className={`text-black -mt-3 uppercase ${IS_SMALL ? 'text-5xl' : 'text-6xl'}`} style={S.fontGilton}>PAST</Text>
                    <View className="w-16 h-1 bg-red-500 mt-4 rounded-full" />
                    <Text className="text-gray-600 text-center text-base px-6 mt-6 leading-6" style={S.fontSoftura}>
                        Relive the best moments from our previous events.
                    </Text>
                </View>

                {/* Polaroid Timeline */}
                <View className="w-full relative" style={S.timelineMinH}>
                    <View className="w-full px-4">
                        {PHOTOS.map((photo, index) => (
                            <PolaroidCard
                                key={photo.id}
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
                        onPress={handleGalleryPress}
                    >
                        <Text className="text-white text-base uppercase tracking-[2px]" style={S.fontSoftura}>VIEW GALLERY</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
});

export default PastGlimpses;
