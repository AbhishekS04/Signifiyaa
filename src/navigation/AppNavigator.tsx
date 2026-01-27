import React from 'react';
import { View, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackCardStyleInterpolator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import EventsScreen from '../screens/EventsScreen';
import AuthScreen from '../screens/AuthScreen';
import { CustomTabBar } from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function MainTabs() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                lazy: false, // Prevent lazy loading to avoid flashing
                tabBarStyle: {
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                },
            }}
            detachInactiveScreens={false}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ lazy: false }}
            />
            <Tab.Screen
                name="Events"
                component={EventsScreen}
                options={{ lazy: false }}
            />
            <Tab.Screen
                name="Payments"
                component={PaymentsScreen}
                options={{ lazy: false }}
            />
            <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{ lazy: false }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ lazy: false }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen
                    name="Auth"
                    component={AuthScreen}
                    options={{
                        presentation: 'modal',
                        cardStyle: { backgroundColor: '#F5E6FA' }, // Ensure background is painted immediately
                        gestureEnabled: true,
                    }}
                />
            </Stack.Navigator>
        </View>
    );
}
