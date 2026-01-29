import React, { useState, memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Svg, Image as SvgImage, Defs, Filter, FeColorMatrix } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    runOnJS,
    Easing,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import SmoothButton from './ui/SmoothButton';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- Heart Particle Component ---
const HeartParticle = ({ index, onComplete }: { index: number, onComplete: () => void }) => {
    // Randomize initial direction and distance
    const angle = Math.random() * Math.PI * 2; // Random angle 0 to 360
    const distance = 40 + Math.random() * 40; // Random distance 40-80
    const duration = 600 + Math.random() * 300; // Random duration

    // Target coordinates relative to center (0,0)
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    const opacity = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(0.5);

    React.useEffect(() => {
        // Explode outward
        translateX.value = withTiming(tx, { duration, easing: Easing.out(Easing.quad) });
        translateY.value = withTiming(ty, { duration, easing: Easing.out(Easing.quad) });

        // Scale up then fade out
        scale.value = withSequence(
            withTiming(1, { duration: duration * 0.3 }),
            withTiming(0, { duration: duration * 0.7 })
        );

        opacity.value = withTiming(0, { duration, easing: Easing.in(Easing.quad) }, (finished) => {
            if (finished) {
                runOnJS(onComplete)();
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
};

// --- Main Gallery Card Component ---
interface GalleryItemProps {
    item: {
        id: string;
        title: string;
        image: string;
        tag: string;
        filename: string;
        titleFont?: string;
    };
    isActive: boolean;
    onToggle: () => void;
}

const GalleryCard = memo(({ item, isActive, onToggle }: GalleryItemProps) => {
    // We remove local isLiked state for coloring, but keep particles local
    const [particles, setParticles] = useState<number[]>([]);

    // Shared value for color opacity (0 = B&W, 1 = Color)
    const colorOpacity = useSharedValue(0);

    // React to isActive prop changes for smooth transition
    React.useEffect(() => {
        colorOpacity.value = withTiming(isActive ? 1 : 0, {
            duration: 1000,
            easing: Easing.out(Easing.cubic)
        });
    }, [isActive]);

    const handlePress = () => {
        onToggle();
        triggerExplosion();
    };

    const triggerExplosion = () => {
        const newParticles = Array.from({ length: 16 }, (_, i) => Date.now() + i);
        setParticles(newParticles);
    };

    const removeParticle = (id: number) => {
        setParticles(prev => prev.filter(p => p !== id));
    };

    const imageAnimatedStyle = useAnimatedStyle(() => ({
        opacity: colorOpacity.value
    }));

    // Memoize the grayscale filter to prevent re-calculation of the ID and Matrix
    const grayscaleFilter = useMemo(() => (
        <Defs>
            <Filter id={`grayscale_${item.id}`}>
                <FeColorMatrix type="saturate" values="0" />
            </Filter>
        </Defs>
    ), [item.id]);

    return (
        <View className="relative">
            {/* Main 3D Shadow Layer */}
            <View className="absolute top-1.5 left-1.5 w-full h-full bg-black rounded-[32px]" />

            {/* The Polaroid Card */}
            <View className="bg-white border-[3px] border-black rounded-[32px] p-4 overflow-hidden">

                {/* Image Container */}
                <View className="w-full h-80 rounded-[20px] border-[3px] border-black overflow-hidden relative bg-gray-100">

                    {/* Layer 1: Base Grayscale Image (Always Visible) */}
                    <View className="absolute inset-0">
                        <Svg width="100%" height="100%">
                            {grayscaleFilter}
                            <SvgImage
                                href={{ uri: item.image }}
                                width="100%"
                                height="100%"
                                preserveAspectRatio="xMidYMid slice"
                                filter={`url(#grayscale_${item.id})`}
                            />
                        </Svg>
                    </View>

                    {/* Layer 2: Color Image (Animated Opacity) */}
                    <Animated.View style={[imageAnimatedStyle, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
                        <Svg width="100%" height="100%">
                            <SvgImage
                                href={{ uri: item.image }}
                                width="100%"
                                height="100%"
                                preserveAspectRatio="xMidYMid slice"
                            />
                        </Svg>
                    </Animated.View>
                </View>

                {/* Content Block */}
                <View className="flex-row justify-between items-center mt-6 mb-2 px-1">
                    <View className="flex-1">
                        <Text className="text-black text-2xl tracking-tighter uppercase"
                            style={{ fontFamily: item.titleFont || 'Gilton' }}>
                            {item.title}
                        </Text>
                    </View>

                    {/* Heart Button Container */}
                    <View className="relative items-center justify-center" style={{ width: 48, height: 48 }}>
                        {/* Particles Layer */}
                        <View className="absolute inset-0 items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
                            {particles.map(id => (
                                <HeartParticle key={id} index={id} onComplete={() => removeParticle(id)} />
                            ))}
                        </View>

                        {/* Interactive Button - Fixed RED Color */}
                        <SmoothButton
                            onPress={handlePress}
                            containerStyle={{ width: 48, height: 48 }}
                            buttonStyle="w-full h-full bg-red-500 border-[2.5px] border-black rounded-full items-center justify-center"
                            shadowStyle="bg-black rounded-full"
                            depth={6}
                            hitSlop={20}
                        >
                            <Heart
                                fill="white"
                                color="white"
                                size={20}
                                strokeWidth={2.5}
                            />
                        </SmoothButton>
                    </View>
                </View>
            </View>
        </View>
    );
});

export default GalleryCard;
