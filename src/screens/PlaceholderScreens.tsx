import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenLayout = ({ title, color }: { title: string; color: string }) => (
    <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: color }}>
            <Text className="text-white text-2xl font-bold">{title}</Text>
        </View>
    </SafeAreaView>
);

export const EventsScreen = () => <ScreenLayout title="Events Screen" color="#1a1a1a" />;
export const GalleryScreen = () => <ScreenLayout title="Gallery Screen" color="#1a1a1a" />;
export const TicketScreen = () => <ScreenLayout title="Ticket Screen" color="#1a1a1a" />;
export const TeamScreen = () => <ScreenLayout title="Team Screen" color="#1a1a1a" />;
export const ProfileScreen = () => <ScreenLayout title="Profile Screen" color="#1a1a1a" />;
export const SearchScreen = () => <ScreenLayout title="Search Screen" color="#1a1a1a" />;
