import React, { useState } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Ticket, Calendar } from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import VisitorRegistrationForm from './VisitorRegistrationForm';
import { PageTransition } from '../components/navigation/PageTransition';
import { useAuth } from '../context/AuthContext';
import { User, Lock } from 'lucide-react-native';

const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton';

export default function PaymentsScreen() {
    const navigation = useNavigation<any>();
    const { isLoggedIn } = useAuth();
    const [activeView, setActiveView] = useState<'menu' | 'visitor' | 'events'>('menu');

    const handleBackToMenu = () => {
        setActiveView('menu');
    };

    // Prevent hardware back button from going to Home screen
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (activeView !== 'menu') {
                    setActiveView('menu');
                    return true; // Prevent default back behavior
                }
                return false; // Allow default back to previous screen
            };

            // For Android hardware back button
            if (Platform.OS === 'android') {
                const BackHandler = require('react-native').BackHandler;
                const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
                return () => subscription.remove();
            }
        }, [activeView])
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F5E6FA] pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>
                <ScrollView
                    style={{ backgroundColor: '#F5E6FA' }}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {!isLoggedIn ? (
                        <Animated.View entering={ZoomIn.duration(400)} className="pt-10">
                            {/* Header */}
                            <View className="mb-8">
                                <Text className="text-5xl uppercase tracking-tighter" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                    PAYMENTS
                                </Text>
                            </View>

                            {/* Auth Required Card */}
                            <View className="bg-white border-[3px] border-black rounded-[30px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                                <View className="items-center mb-8">
                                    <View className="bg-[#9C27B0]/10 p-6 rounded-full border-[2.5px] border-black mb-6">
                                        <Lock color="#9C27B0" size={40} strokeWidth={2.5} />
                                    </View>
                                    <Text className="text-3xl text-center mb-3" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                        ACCESS RESTRICTED
                                    </Text>
                                    <Text className="text-sm text-center px-4 leading-5" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>
                                        Please sign in to your account to manage your passes and registrations.
                                    </Text>
                                </View>

                                <SmoothButton
                                    onPress={() => navigation.navigate('Auth')}
                                    buttonStyle="bg-black border-[2.5px] border-black rounded-[20px] py-5 items-center justify-center"
                                    shadowStyle="bg-black rounded-[20px]"
                                    depth={6}
                                >
                                    <View className="flex-row items-center">
                                        <User color="white" size={20} />
                                        <Text className="text-white text-[16px] uppercase tracking-widest ml-3" style={{ fontFamily: FONT_BOLD }}>
                                            SIGN IN TO CONTINUE
                                        </Text>
                                    </View>
                                </SmoothButton>

                                <Text className="text-[10px] text-center mt-6 uppercase tracking-widest" style={{ fontFamily: FONT_MAIN, color: '#9ca3af' }}>
                                    Signifiya'26 Secure Portal
                                </Text>
                            </View>
                        </Animated.View>
                    ) : (
                        <>
                            {activeView === 'menu' && (
                                <Animated.View entering={ZoomIn.duration(400)}>
                                    {/* Header */}
                                    <View className="mb-8">
                                        <Text className="text-5xl uppercase tracking-tighter" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                            PAYMENTS
                                        </Text>
                                        <Text className="text-sm mt-2" style={{ fontFamily: FONT_MAIN, color: '#000000ff' }}>
                                            Manage your passes and event{'\n'}registrations.
                                        </Text>
                                    </View>

                                    {/* Main Card */}
                                    <View className="mb-6">
                                        {/* Card Content with Combined Shadow */}
                                        <View className="bg-white border-[3px] border-black rounded-[30px] p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                                            <Text className="text-2xl mb-2" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                                What would you like to do?
                                            </Text>
                                            <Text className="text-sm mb-8" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>
                                                Choose an option below to get started
                                            </Text>

                                            {/* Visitor Pass Button */}
                                            <View className="mb-4">
                                                <SmoothButton
                                                    onPress={() => setActiveView('visitor')}
                                                    buttonStyle="bg-[#9C27B0] border-[2.5px] border-black rounded-[20px] py-6 px-6"
                                                    shadowStyle="bg-black rounded-[20px]"
                                                    depth={6}
                                                >
                                                    <View className="flex-row items-center">
                                                        <View className="bg-white/20 p-3 rounded-full mr-4">
                                                            <Ticket color="white" size={24} strokeWidth={2.5} />
                                                        </View>
                                                        <View className="flex-1">
                                                            <Text className="text-white text-[16px] uppercase tracking-wide mb-1" style={{ fontFamily: FONT_BOLD }}>
                                                                Create Visitor Pass
                                                            </Text>
                                                            <Text className="text-white/80 text-[11px]" style={{ fontFamily: FONT_MAIN }}>
                                                                Get your entry pass for Signifiya'26
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </SmoothButton>
                                            </View>

                                            {/* Register Events Button */}
                                            <View>
                                                <SmoothButton
                                                    onPress={() => navigation.navigate('EventRegistration')}
                                                    buttonStyle="bg-[#FFEB3B] border-[2.5px] border-black rounded-[20px] py-6 px-6"
                                                    shadowStyle="bg-black rounded-[20px]"
                                                    depth={6}
                                                >
                                                    <View className="flex-row items-center">
                                                        <View className="bg-black/10 p-3 rounded-full mr-4">
                                                            <Calendar color="black" size={24} strokeWidth={2.5} />
                                                        </View>
                                                        <View className="flex-1">
                                                            <Text className="text-black text-[16px] uppercase tracking-wide mb-1" style={{ fontFamily: FONT_BOLD }}>
                                                                Register for Events
                                                            </Text>
                                                            <Text className="text-black/70 text-[11px]" style={{ fontFamily: FONT_MAIN }}>
                                                                Sign up for competitions and workshops
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </SmoothButton>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Info Card */}
                                    <View className="mt-4">
                                        {/* Card Content with Combined Shadow */}
                                        <View className="bg-[#FFF9C4] border-[2.5px] border-black rounded-[20px] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                            <View className="flex-row items-center mb-3">
                                                <Text className="text-[14px] mr-2">⚠️</Text>
                                                <Text className="text-[13px] uppercase" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                                    Payment Instructions
                                                </Text>
                                            </View>

                                            <Text className="text-[11px] leading-5 mb-3" style={{ fontFamily: FONT_MAIN, color: '#000' }}>
                                                • Complete your payment carefully{'\n'}
                                                • All transactions are secure & encrypted{'\n'}
                                                • Keep your payment receipt safe
                                            </Text>

                                            <View className="border-t-[1.5px] border-black/20 pt-3 mt-1">
                                                <Text className="text-[10px] mb-1" style={{ fontFamily: FONT_MAIN, color: '#000' }}>
                                                    Need assistance?
                                                </Text>
                                                <View className="flex-row items-center">
                                                    <Text className="text-[11px]" style={{ fontFamily: FONT_MAIN, color: '#000' }}>
                                                        Contact:
                                                    </Text>
                                                    <Text className="text-[11px] ml-1" style={{ fontFamily: FONT_BOLD, color: '#000' }}>
                                                        +91 98835 11660
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Animated.View>
                            )}

                            {activeView === 'visitor' && (
                                <VisitorRegistrationForm onBack={handleBackToMenu} />
                            )}

                            {activeView === 'events' && (
                                <Animated.View entering={ZoomIn.duration(400)} className="bg-white border-[3px] border-black rounded-[30px] p-8">
                                    <Text className="text-2xl mb-4" style={{ fontFamily: FONT_BOLD }}>
                                        Event Registration
                                    </Text>
                                    <Text className="text-sm mb-6" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>
                                        Coming soon! Event registration will be available here.
                                    </Text>
                                    <SmoothButton
                                        onPress={handleBackToMenu}
                                        buttonStyle="bg-black border-[2.5px] border-black rounded-xl py-3"
                                        shadowStyle="bg-black rounded-xl"
                                        depth={4}
                                    >
                                        <Text className="text-white text-center text-sm uppercase" style={{ fontFamily: FONT_BOLD }}>
                                            ← Back to Menu
                                        </Text>
                                    </SmoothButton>
                                </Animated.View>
                            )}
                        </>
                    )}
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
}
