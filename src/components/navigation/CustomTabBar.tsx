import React from 'react';
import { View, TouchableOpacity, Platform, Image as RNImage } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Image, Ticket } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

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

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const IconProps = {
                        size: 26,
                        color: isFocused ? '#FFFFFF' : '#A1A1AA',
                        strokeWidth: isFocused ? 2.5 : 2,
                        opacity: isFocused ? 1 : 0.8,
                    };

                    const renderIcon = () => {
                        if (route.name === 'Home') {
                            return <Home {...IconProps} />;
                        } else if (route.name === 'Events') {
                            return <Calendar {...IconProps} />;
                        } else if (route.name === 'Gallery') {
                            return <Image {...IconProps} />;
                        } else if (route.name === 'Ticket') {
                            return <Ticket {...IconProps} />;
                        } else if (route.name === 'Profile') {
                            return (
                                <View className={`relative ${isFocused ? 'opacity-100' : 'opacity-80'}`}>
                                    <View className={`w-8 h-8 rounded-full overflow-hidden border-2 ${isFocused ? 'border-white' : 'border-transparent'}`}>
                                        <RNImage
                                            source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black/50" />
                                </View>
                            );
                        }
                        return <Home {...IconProps} />;
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            className="items-center justify-center flex-1"
                            activeOpacity={0.7}
                        >
                            <View className="items-center justify-center min-h-[48px]">
                                {renderIcon()}
                                {isFocused && route.name !== 'Profile' && (
                                    <View className="absolute -bottom-2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
