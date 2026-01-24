import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Instagram, Youtube } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    Layout
} from 'react-native-reanimated';

const SocialConnect = () => {
    return (
        <Animated.View
            className="px-6 pb-20 pt-4 bg-black"
            layout={Layout.springify().damping(30).stiffness(100).mass(1)} // SYNC with FAQ Parent
        >

            {/* --- Row 1 --- */}
            <View className="flex-row gap-6 mb-8 h-40">
                <SocialCard>
                    <DiscordLink />
                </SocialCard>
                <SocialCard>
                    <XLink />
                </SocialCard>
            </View>

            {/* --- Hazard Divider (Spinning) --- */}
            <HazardDivider />

            {/* --- Row 2 --- */}
            <View className="flex-row gap-6 h-40">
                <SocialCard>
                    <Instagram size={80} color="black" strokeWidth={2} />
                </SocialCard>
                <SocialCard>
                    <Youtube size={80} color="black" strokeWidth={2} />
                </SocialCard>
            </View>

        </Animated.View>
    );
};

// --- Reusable Card ---
const SocialCard = ({ children }: { children: React.ReactNode }) => (
    <TouchableOpacity
        className="flex-1 bg-white rounded-[35px] items-center justify-center shadow-lg active:opacity-80 aspect-square"
        activeOpacity={0.8}
    >
        {children}
    </TouchableOpacity>
);

// --- Custom SVGs ---

const DiscordLink = () => (
    <Svg width={80} height={80} viewBox="0 0 24 24" fill="black">
        <Path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </Svg>
);

const XLink = () => (
    <Svg width={70} height={70} viewBox="0 0 24 24" fill="black">
        <Path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </Svg>
);

// --- Animated Hazard Divider ---
const HazardDivider = () => {
    const translateX = useSharedValue(0);

    useEffect(() => {
        // Move stripes horizontally to create climbing effect
        translateX.value = withRepeat(
            withTiming(60, { // Move by stripe width + gap
                duration: 2000, // 2 seconds for smooth motion
                easing: Easing.linear,
            }),
            -1, // Infinite loop
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <View className="h-5 bg-[#ffe700] mb-8 w-full overflow-hidden relative">
            {/* Animated diagonal stripes that create "climbing" effect */}
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        position: 'absolute',
                        width: '200%', // Extra width for seamless loop
                        height: '100%',
                        flexDirection: 'row',
                    }
                ]}
            >
                {/* Black diagonal stripes */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <View
                        key={i}
                        className="bg-black absolute h-[300%]"
                        style={{
                            width: 20,
                            left: i * 60 - 40, // Stripe width 20 + gap 40 = 60
                            top: -20,
                            transform: [{ rotate: '-45deg' }] // Diagonal angle
                        }}
                    />
                ))}
            </Animated.View>
        </View>
    );
};

export default SocialConnect;
