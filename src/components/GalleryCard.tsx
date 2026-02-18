import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { getGalleryImage } from '../data/GalleryData';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withSpring,
    Easing,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// ─── Constants ─────────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 5;
const PARTICLE_LIFETIME_MS = 700; // longest possible duration (450 + 200 + buffer)

// ─── StyleSheet (module scope — zero per-render cost) ──────────────────────────
const S = StyleSheet.create({
    particleAbsolute: { position: 'absolute', pointerEvents: 'none' as any },
    grayscaleOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(128, 128, 128, 0.6)',
    },
    imageFull: { width: '100%' as any, height: '100%' as any },
    heartWrap: { width: 48, height: 48 },
    heartShadow: {
        position: 'absolute',
        width: 48, height: 48,
        borderRadius: 24,
        backgroundColor: 'black',
    },
    heartButton: {
        width: 48, height: 48,
        borderRadius: 24,
        borderWidth: 2.5,
        borderColor: 'black',
        backgroundColor: '#ef4444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressableZ: { zIndex: 1 },
    particlesLayer: { zIndex: 0 },
});

// ─── HeartParticle (Reanimated-only, self-destructing) ─────────────────────────
// Each particle runs its own animations on the UI thread and never calls back
// to JS for cleanup — the parent batch-clears after a fixed timeout.
const HeartParticle = React.memo(({ seed }: { seed: number }) => {
    // Deterministic-ish random from seed (avoids Math.random on re-mount)
    const angle = ((seed * 2654435761) % 1000) / 1000 * Math.PI * 2;
    const distance = 35 + ((seed * 2246822519) % 1000) / 1000 * 35;
    const duration = 450 + ((seed * 3266489917) % 1000) / 1000 * 200;

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
            withTiming(0, { duration: duration * 0.75 }),
        );
        opacity.value = withTiming(0, { duration, easing: Easing.in(Easing.quad) });
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <Animated.View style={[style, S.particleAbsolute]}>
            <Heart fill="#ef4444" color="#ef4444" size={14} />
        </Animated.View>
    );
});

// ─── HeartParticles (isolated system — parent never re-renders) ────────────────
// Manages its own particle array. Parent communicates via a trigger counter.
const HeartParticles = React.memo(({ trigger }: { trigger: number }) => {
    const [batches, setBatches] = useState<number[][]>([]);
    const counterRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        if (trigger === 0) return; // initial mount — skip

        // Generate a batch of unique seeds
        const batch = Array.from({ length: PARTICLE_COUNT }, () => ++counterRef.current);
        setBatches(prev => [...prev, batch]);

        // Single timeout clears ALL expired batches — avoids N individual setState calls
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setBatches([]);
            timerRef.current = null;
        }, PARTICLE_LIFETIME_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [trigger]);

    if (batches.length === 0) return null;

    return (
        <View className="absolute inset-0 items-center justify-center pointer-events-none" style={S.particlesLayer}>
            {batches.flat().map(seed => (
                <HeartParticle key={seed} seed={seed} />
            ))}
        </View>
    );
});

// ─── Static Image Layer (never re-renders on heart tap) ────────────────────────
const StaticImageLayer = React.memo(({ imageSource, itemId }: { imageSource: any; itemId: string }) => (
    <Image
        source={imageSource}
        style={S.imageFull}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={`gallery-${itemId}`}
        transition={200}
    />
));

// ─── Main Gallery Card Component ───────────────────────────────────────────────
interface GalleryItemProps {
    item: {
        id: string;
        title: string;
        tag: string;
        titleFont?: string;
    };
    isActive: boolean;
    onToggle: () => void;
}

const GalleryCard = React.memo(({ item, isActive, onToggle }: GalleryItemProps) => {
    // Particle trigger counter — incrementing this causes HeartParticles to spawn a batch.
    // Does NOT live in state — we use a lightweight state counter that is isolated to HeartParticles.
    const [particleTrigger, setParticleTrigger] = useState(0);

    // Shared values for instant button feedback
    const buttonScale = useSharedValue(1);
    const buttonOffset = useSharedValue(-4);
    const colorOpacity = useSharedValue(0);

    // Color transition (grayscale ↔ color)
    React.useEffect(() => {
        colorOpacity.value = withTiming(isActive ? 1 : 0, {
            duration: 400,
            easing: Easing.out(Easing.cubic),
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
        // Bump trigger — only HeartParticles re-renders, not GalleryCard's image/overlay
        setParticleTrigger(t => t + 1);
    }, [onToggle]);

    // Grayscale overlay fades OUT when active (opacity goes 1 → 0)
    const grayscaleOverlayStyle = useAnimatedStyle(() => ({
        opacity: 1 - colorOpacity.value,
    }));

    const heartButtonStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: buttonOffset.value },
            { translateY: buttonOffset.value },
            { scale: buttonScale.value },
        ],
    }));

    const imageSource = useMemo(() => getGalleryImage(item.id), [item.id]);

    const titleFontStyle = useMemo(() => ({ fontFamily: item.titleFont || 'Gilton' }), [item.titleFont]);

    return (
        <View className="relative">
            {/* Main 3D Shadow Layer */}
            <View className="absolute top-1.5 left-1.5 w-full h-full bg-black rounded-[32px]" />

            {/* The Polaroid Card */}
            <View className="bg-white border-[3px] border-black rounded-[32px] p-4 overflow-hidden">

                {/* Image Container — static image + animated overlay */}
                <View className="w-full h-80 rounded-[20px] border-[3px] border-black overflow-hidden relative bg-gray-100">
                    <StaticImageLayer imageSource={imageSource} itemId={item.id} />
                    <Animated.View style={[grayscaleOverlayStyle, S.grayscaleOverlay]} />
                </View>

                {/* Content Block */}
                <View className="flex-row justify-between items-center mt-6 mb-2 px-1">
                    <View className="flex-1">
                        <Text className="text-black text-2xl tracking-tighter uppercase" style={titleFontStyle}>
                            {item.title}
                        </Text>
                    </View>

                    {/* Heart Button — Direct Pressable for zero-delay response */}
                    <View className="relative items-center justify-center" style={S.heartWrap}>
                        {/* Isolated particle system — its re-renders don't touch the card */}
                        <HeartParticles trigger={particleTrigger} />

                        {/* Shadow layer */}
                        <View style={S.heartShadow} />

                        {/* Animated heart button */}
                        <Pressable
                            onPress={handlePress}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            hitSlop={20}
                            style={S.pressableZ}
                        >
                            <Animated.View style={[heartButtonStyle, S.heartButton]}>
                                <Heart fill="white" color="white" size={20} strokeWidth={2.5} />
                            </Animated.View>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
});

export default GalleryCard;
