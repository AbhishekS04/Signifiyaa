import React, { useEffect } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import EventsScreen from '../screens/EventsScreen';
import AuthScreen from '../screens/AuthScreen';
import EventRegistrationScreen from '../screens/EventRegistrationScreen';
import { CustomTabBar } from '../components/navigation/CustomTabBar';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                lazy: false,
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

// Wrapper component for reactive auth navigation
function AuthScreenWrapper() {
    const { isLoggedIn } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        // Auto-dismiss auth modal when user logs in
        if (isLoggedIn) {
            // Use setTimeout to ensure state has settled before navigation
            const timeout = setTimeout(() => {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [isLoggedIn, navigation]);

    return <AuthScreen />;
}

export default function AppNavigator() {
    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen
                    name="Auth"
                    component={AuthScreenWrapper}
                    options={{
                        presentation: 'modal',
                        cardStyle: { backgroundColor: '#F5E6FA' },
                        gestureEnabled: true,
                    }}
                />
                <Stack.Screen
                    name="EventRegistration"
                    component={EventRegistrationScreen}
                    options={{ animation: 'slide_from_bottom', headerShown: false }}
                />
            </Stack.Navigator>
        </View>
    );
}
