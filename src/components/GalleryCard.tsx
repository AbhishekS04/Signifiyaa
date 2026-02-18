import React, { useState, useCallback, memo, useMemo, useRef } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withSpring,
    withDelay,
    runOnJS,
    Easing,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- Heart Particle Component (lighter) ---
const HeartParticle = memo(({ index, onComplete }: { index: number, onComplete: (id: number) => void }) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 35 + Math.random() * 35;
    const duration = 450 + Math.random() * 200;

    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    const opacity = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(0.5);

    React.useEffect(() => {
        translateX.value = withTiming(tx, { duration, easing: Easing.out(Easing.quad) });
        translateY.value = withTiming(ty, { duration, easing: Easing.out(Easing.quad) });

        scale.value = withSequence(
            withTiming(1, { duration: duration * 0.25 }),
            withTiming(0, { duration: duration * 0.75 })
        );

        opacity.value = withTiming(0, { duration, easing: Easing.in(Easing.quad) }, (finished) => {
            if (finished) {
                runOnJS(onComplete)(index);
            }
        });
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ]
    }));

    return (
        <Animated.View style={[style, { position: 'absolute', pointerEvents: 'none' }]}>
            <Heart fill="#ef4444" color="#ef4444" size={14} />
        </Animated.View>
    );
});

// --- Main Gallery Card Component ---
interface GalleryItemProps {
    item: {
        id: string;
        title: string;
        image: any;
        tag: string;
        filename: string;
        titleFont?: string;
    };
    isActive: boolean;
    onToggle: () => void;
}

const GalleryCard = memo(({ item, isActive, onToggle }: GalleryItemProps) => {
    const [particles, setParticles] = useState<number[]>([]);
    const particleCounter = useRef(0);

    // Shared values for instant button feedback
    const buttonScale = useSharedValue(1);
    const buttonOffset = useSharedValue(-4);
    const colorOpacity = useSharedValue(0);

    // Faster color transition
    React.useEffect(() => {
        colorOpacity.value = withTiming(isActive ? 1 : 0, {
            duration: 400,
            easing: Easing.out(Easing.cubic)
        });
    }, [isActive]);

    const handlePressIn = useCallback(() => {
        buttonScale.value = withTiming(0.85, { duration: 40 });
        buttonOffset.value = withTiming(0, { duration: 40 });
    }, []);

    const handlePressOut = useCallback(() => {
        buttonScale.value = withSpring(1, { damping: 18, stiffness: 400, mass: 0.3 });
        buttonOffset.value = withSpring(-4, { damping: 18, stiffness: 400, mass: 0.3 });
    }, []);

    const handlePress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onToggle();

        // Fewer particles (5 instead of 8) = faster render
        const batch = Array.from({ length: 5 }, () => ++particleCounter.current);
        setParticles(prev => [...prev, ...batch]);
    }, [onToggle]);

    const removeParticle = useCallback((id: number) => {
        setParticles(prev => prev.filter(p => p !== id));
    }, []);

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        opacity: colorOpacity.value
    }));

    // Grayscale overlay fades OUT when active (opacity goes 1 → 0)
    const grayscaleOverlayStyle = useAnimatedStyle(() => ({
        opacity: 1 - colorOpacity.value
    }));

    const heartButtonStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: buttonOffset.value },
            { translateY: buttonOffset.value },
            { scale: buttonScale.value }
        ]
    }));

    const imageSource = useMemo(() => 
        typeof item.image === 'string' && (item.image.startsWith('http') || item.image.startsWith('https'))
            ? { uri: item.image }
            : item.image
    , [item.image]);

    return (
        <View className="relative">
            {/* Main 3D Shadow Layer */}
            <View className="absolute top-1.5 left-1.5 w-full h-full bg-black rounded-[32px]" />

            {/* The Polaroid Card */}
            <View className="bg-white border-[3px] border-black rounded-[32px] p-4 overflow-hidden">

                {/* Image Container — Single image with grayscale overlay */}
                <View className="w-full h-80 rounded-[20px] border-[3px] border-black overflow-hidden relative bg-gray-100">

                    {/* Single expo-image (color) — always rendered */}
                    <Image
                        source={imageSource}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        recyclingKey={`gallery-${item.id}`}
                        transition={200}
                    />

                    {/* Grayscale overlay — fades OUT when active (revealing color underneath) */}
                    <Animated.View
                        style={[
                            grayscaleOverlayStyle,
                            {
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: 'rgba(128, 128, 128, 0.6)',
                                // Mix blend mode not available in RN, so we use a semi-transparent gray overlay
                                // that fades out to reveal the color image
                            }
                        ]}
                    />
                </View>

                {/* Content Block */}
                <View className="flex-row justify-between items-center mt-6 mb-2 px-1">
                    <View className="flex-1">
                        <Text className="text-black text-2xl tracking-tighter uppercase"
                            style={{ fontFamily: item.titleFont || 'Gilton' }}>
                            {item.title}
                        </Text>
                    </View>

                    {/* Heart Button — Direct Pressable for zero-delay response */}
                    <View className="relative items-center justify-center" style={{ width: 48, height: 48 }}>
                        {/* Particles Layer */}
                        <View className="absolute inset-0 items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
                            {particles.map(id => (
                                <HeartParticle key={id} index={id} onComplete={removeParticle} />
                            ))}
                        </View>

                        {/* Shadow layer */}
                        <View
                            style={{
                                position: 'absolute',
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: 'black',
                            }}
                        />

                        {/* Animated heart button — no SmoothButton overhead */}
                        <Pressable
                            onPress={handlePress}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            hitSlop={20}
                            style={{ zIndex: 1 }}
                        >
                            <Animated.View
                                style={[
                                    heartButtonStyle,
                                    {
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        borderWidth: 2.5,
                                        borderColor: 'black',
                                        backgroundColor: '#ef4444',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }
                                ]}
                            >
                                <Heart
                                    fill="white"
                                    color="white"
                                    size={20}
                                    strokeWidth={2.5}
                                />
                            </Animated.View>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
});

export default GalleryCard;
