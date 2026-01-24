import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Platform, Image as RNImage } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Image, Ticket } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    ZoomIn
} from 'react-native-reanimated';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const lastTapTime = useRef(0);
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
                                // Already on Home → Single click scrolls to top
                                (navigation as any).emit({
                                    type: 'homeScrollToTop',
                                    target: route.key,
                                });
                            } else {
                                // Coming from another tab → Navigate and detect double-click
                                const now = Date.now();
                                const DOUBLE_TAP_DELAY = 300; // ms

                                if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
                                    // Double-click detected → Scroll to top after navigation
                                    if (tapTimeout.current) {
                                        clearTimeout(tapTimeout.current);
                                    }
                                    navigation.navigate(route.name, route.params);
                                    setTimeout(() => {
                                        (navigation as any).emit({
                                            type: 'homeScrollToTop',
                                            target: route.key,
                                        });
                                    }, 100); // Small delay to ensure screen is mounted
                                } else {
                                    // Single click → Just navigate (remember position)
                                    tapTimeout.current = setTimeout(() => {
                                        if (!event.defaultPrevented) {
                                            navigation.navigate(route.name, route.params);
                                        }
                                    }, DOUBLE_TAP_DELAY);
                                }

                                lastTapTime.current = now;
                                return; // Skip default navigation
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
        if (route.name === 'Gallery') return <Image {...IconProps} />;
        if (route.name === 'Ticket') return <Ticket {...IconProps} />;
        if (route.name === 'Profile') {
            return (
                <View className={`relative`}>
                    <View className={`w-7 h-7 rounded-full overflow-hidden border-2 ${isFocused ? 'border-white' : 'border-zinc-600'}`}>
                        <RNImage
                            source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-black/50" />
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
