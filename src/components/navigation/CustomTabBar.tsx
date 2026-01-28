import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Platform, Image as RNImage } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Image, Ticket, IndianRupee, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AVATAR_MAP } from '../ui/AvatarChooserModal';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    ZoomIn
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const lastTapTime = useRef(0);
    const tapCount = useRef(0);
    const tapTimeout = useRef<NodeJS.Timeout | null>(null);

    return (
        <View
            className="w-full border-t border-white/10 bg-black"
            style={{
                paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 10),
                paddingTop: 10,
            }}
        >
            <View className="flex-row items-center justify-between px-4 pb-2">
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        // 🚀 Smart Home Button Behavior
                        if (route.name === 'Home') {
                            if (isFocused) {
                                const now = Date.now();
                                const TAP_DELAY = 400; // ms to qualify as a consecutive tap

                                if (now - lastTapTime.current < TAP_DELAY) {
                                    tapCount.current += 1;
                                } else {
                                    tapCount.current = 1;
                                }
                                lastTapTime.current = now;

                                if (tapCount.current === 2) {
                                    // 🚀 2 Taps: Trigger Scroll immediately (No waiting)
                                    navigation.navigate({ name: 'Home', params: { scrollToTop: Date.now() }, merge: true });
                                    tapCount.current = 0; // Reset
                                    return;
                                }

                                // Reset count if it goes beyond 2 (optional, but good for cleanliness)
                                if (tapCount.current > 2) {
                                    tapCount.current = 1;
                                }

                                return;
                            } else {
                                // First visit to Home tab
                                tapCount.current = 1;
                                lastTapTime.current = Date.now();
                                if (!event.defaultPrevented) {
                                    navigation.navigate(route.name, route.params);
                                }
                                return;
                            }
                        }

                        // Default behavior for other tabs
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    return (
                        <TabItem
                            key={route.key}
                            route={route}
                            isFocused={isFocused}
                            onPress={onPress}
                        />
                    );
                })}
            </View>
        </View>
    );
}

// --- Animated Tab Item Component ---
// Clean, minimal effect: NO scale, just opacity/color "glow"
const TabItem = ({ route, isFocused, onPress }: { route: any, isFocused: boolean, onPress: () => void }) => {
    // Opacity for glow effect
    const opacity = useSharedValue(isFocused ? 1 : 0.5);

    const { profile, user } = useAuth();

    // BetterAuth User object has direct properties
    const rawImage = profile?.image || user?.image;

    // Determine the image source
    let imageSource = null;
    if (rawImage?.startsWith('avatar') && AVATAR_MAP[rawImage]) {
        imageSource = AVATAR_MAP[rawImage];
    } else if (rawImage?.startsWith('http')) {
        imageSource = { uri: rawImage };
    } else {
        imageSource = null;
    }

    useEffect(() => {
        opacity.value = withTiming(isFocused ? 1 : 0.5, { duration: 200 });
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    // Clean icon styling
    const activeColor = '#FFFFFF';
    const inactiveColor = '#71717A'; // zinc-500

    const renderIcon = () => {
        const IconProps = {
            size: 24,
            color: isFocused ? activeColor : inactiveColor,
            strokeWidth: 2,
        };

        if (route.name === 'Home') return <Home {...IconProps} />;
        if (route.name === 'Events') return <Calendar {...IconProps} />;
        if (route.name === 'Payments') return <IndianRupee {...IconProps} />;
        if (route.name === 'Gallery') return <Image {...IconProps} />;
        if (route.name === 'Profile') {
            return (
                <View className={`relative items-center justify-center`}>
                    {/* Profile Image - No Border, Maximized Size */}
                    <View className={`w-8 h-8 rounded-full overflow-hidden bg-gray-700 items-center justify-center`}>
                        {imageSource ? (
                            <RNImage
                                source={imageSource}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <User size={18} color="#9ca3af" />
                        )}
                    </View>

                    {/* Red Dot - ONLY visible when Active (acting as the selection indicator) */}
                    {isFocused && (
                        <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black" />
                    )}
                </View>
            );
        }
        return <Home {...IconProps} />;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className="items-center justify-center flex-1"
            activeOpacity={0.8}
        >
            <View className="items-center justify-center min-h-[44px]">
                {/* Icon with Glow (Opacity Only) */}
                <Animated.View style={animatedStyle}>
                    {renderIcon()}
                </Animated.View>

                {/* Subtle Dot Indicator */}
                {isFocused && route.name !== 'Profile' && (
                    <Animated.View
                        entering={ZoomIn.duration(200)}
                        className="absolute -bottom-1.5 w-1 h-1 bg-white rounded-full"
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};
