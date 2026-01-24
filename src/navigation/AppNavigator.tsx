import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import GalleryScreen from '../screens/GalleryScreen';
import { EventsScreen, TicketScreen, ProfileScreen } from '../screens/PlaceholderScreens';
import { CustomTabBar } from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        // 🚀 FIX FLASH: Solid black wrapper ensures no white shows during transitions
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Tab.Navigator
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: 'transparent',
                        borderTopWidth: 0,
                        elevation: 0,
                    },
                }}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Events" component={EventsScreen} />
                <Tab.Screen name="Gallery" component={GalleryScreen} />
                <Tab.Screen name="Ticket" component={TicketScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </View>
    );
}
