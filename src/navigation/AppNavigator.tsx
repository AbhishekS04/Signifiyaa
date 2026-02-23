import React, { useEffect } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import EventsScreen from '../screens/EventsScreen';
import AuthScreen from '../screens/AuthScreen';
import EventRegistrationScreen from '../screens/EventRegistrationScreen';
import VisitorRegistrationScreen from '../screens/VisitorRegistrationScreen';
import ContactSupportScreen from '../screens/ContactSupportScreen';
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
                lazy: true, // Only render tabs when first visited — saves ~40% startup memory
                tabBarStyle: {
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                },
            }}
            detachInactiveScreens={true} // Unmount inactive tab screens to free memory
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ lazy: false }} // Home loads immediately since it's the landing screen
            />
            <Tab.Screen
                name="Events"
                component={EventsScreen}
            />
            <Tab.Screen
                name="Payments"
                component={PaymentsScreen}
            />
            <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </Tab.Navigator>
    );
}

// Wrapper component for reactive auth navigation
function AuthScreenWrapper() {
    const { isLoggedIn } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (isLoggedIn && navigation.canGoBack()) {
            navigation.goBack();
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
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="VisitorRegistration"
                    component={VisitorRegistrationScreen}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="ContactSupport"
                    component={ContactSupportScreen}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        </View>
    );
}
