import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, ChevronDown, Calendar, Ticket, Lock, User } from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { PageTransition } from '../components/navigation/PageTransition';

// Font Constants
const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton'; // Assuming Gilton has bold weight or is used for headings

// Helper Component for 3D Shadow (Manual Implementation for reliability)
const ShadowCard = ({ children, style, shadowOffset = 8 }: { children: React.ReactNode, style?: any, shadowOffset?: number }) => {
    return (
        <View style={[{ position: 'relative' }, style]}>
            {/* The Shadow (Black Background Offset) */}
            <View
                style={{
                    position: 'absolute',
                    top: shadowOffset,
                    left: shadowOffset,
                    right: -shadowOffset, // push shadow out
                    bottom: -shadowOffset,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'black',
                    borderRadius: 30, // Match card border radius
                    zIndex: -1,
                }}
            />
            {/* Main Content */}
            <View style={{ backgroundColor: 'white', borderRadius: 30, borderWidth: 3, borderColor: 'black', padding: 20 }}>
                {children}
            </View>
        </View>
    );
};

// Avatar specific shadow (Circle)
const ShadowAvatar = ({ children }: { children: React.ReactNode }) => (
    <View style={{ position: 'relative', margin: 4 }}>
        <View
            style={{
                position: 'absolute',
                top: 4,
                left: 4,
                width: 96, // w-24 = 96px
                height: 96,
                borderRadius: 9999,
                backgroundColor: 'black',
                zIndex: -1,
            }}
        />
        {/* Added strict dimensions and overflow handling */}
        <View className="w-24 h-24 rounded-full border-[3px] border-black overflow-hidden bg-gray-200 justify-center items-center">
            {children}
        </View>
    </View>
);

const ProfileScreen = () => {
    // Mock State
    const [name, setName] = useState('Abhishek Singh');
    const [email, setEmail] = useState('abhishek23main@gmail.com');
    const [mobile, setMobile] = useState('+919883511660');
    const [college, setCollege] = useState('Adamas University');
    const [gender, setGender] = useState('Male');
    const bookingId = 'SGF26-DC2940D1';

    // User provided Profile Image
    const PROFILE_IMAGE = 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/68e0efce-84a4-42ae-9bd7-a2be6aca73d8.jpg';

    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        // Simulate loading to give the "app feel"
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
                <View style={{ backgroundColor: '#F5E6FA', flex: 1, padding: 16 }}>
                    {/* Skeleton Header */}
                    <View className="mb-6 mt-4">
                        <View className="h-12 w-48 bg-black/10 rounded-lg mb-2" />
                        <View className="h-4 w-64 bg-black/5 rounded-md" />
                    </View>

                    {/* Skeleton Card */}
                    <View className="bg-white rounded-[30px] border-[3px] border-black/10 p-6 mb-6 h-[400px]" />

                    {/* Skeleton Card 2 */}
                    <View className="bg-white rounded-[30px] border-[3px] border-black/10 p-6 h-[150px]" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F5E6FA] pt-3" edges={['top', 'left', 'right']}>
            <PageTransition style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: '#F5E6FA' }}
                >
                    {/* Screen Header */}
                    <View className="mb-6">
                        <Text className="text-5xl uppercase tracking-tighter" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                            YOUR{'\n'}PROFILE
                        </Text>
                        <Text className="text-sm mt-2" style={{ fontFamily: FONT_MAIN, color: '#4b5563' }}>
                            Manage your account settings{'\n'}and preferences.
                        </Text>
                    </View>

                    {/* Main Profile Card */}
                    <Animated.View entering={FadeIn.duration(400)} className="mb-6">
                        <ShadowCard>
                            {/* Avatar */}
                            <View className="items-center mb-6">
                                <ShadowAvatar>
                                    <Image
                                        source={{ uri: PROFILE_IMAGE }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </ShadowAvatar>
                                <TouchableOpacity className="mt-2">
                                    <Text className="text-xs underline tracking-tight" style={{ fontFamily: FONT_BOLD, color: 'black' }}>Change Avatar</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Fields */}
                            <View className="gap-5">
                                {/* Full Name */}
                                <View>
                                    <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>FULL NAME</Text>
                                    <TextInput
                                        value={name}
                                        onChangeText={setName}
                                        className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-white"
                                        style={{ fontFamily: FONT_MAIN, color: 'black' }}
                                    />
                                </View>

                                {/* Email */}
                                <View>
                                    <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>EMAIL ADDRESS</Text>
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-gray-50"
                                        style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}
                                        editable={false}
                                    />
                                </View>

                                {/* Booking ID */}
                                <View>
                                    <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>BOOKING ID</Text>
                                    <View className="relative">
                                        <TextInput
                                            value={bookingId}
                                            className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-gray-100"
                                            style={{ fontFamily: FONT_MAIN, color: '#4b5563' }}
                                            editable={false}
                                        />
                                        <TouchableOpacity className="absolute right-3 top-[10px]">
                                            <Copy color="black" size={18} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Gender */}
                                <View>
                                    <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>GENDER</Text>
                                    <TouchableOpacity className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 flex-row justify-between items-center bg-white">
                                        <Text className="text-sm" style={{ fontFamily: FONT_MAIN, color: 'black' }}>{gender}</Text>
                                        <ChevronDown color="black" size={18} />
                                    </TouchableOpacity>
                                </View>

                                {/* Mobile No */}
                                <View>
                                    <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>MOBILE NO.</Text>
                                    <TextInput
                                        value={mobile}
                                        onChangeText={setMobile}
                                        className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-white"
                                        style={{ fontFamily: FONT_MAIN, color: 'black' }}
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                {/* College Name */}
                                <View>
                                    <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>COLLEGE NAME</Text>
                                    <TextInput
                                        value={college}
                                        onChangeText={setCollege}
                                        className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-white"
                                        style={{ fontFamily: FONT_MAIN, color: 'black' }}
                                    />
                                </View>
                            </View>

                            {/* Save Button */}
                            <View className="mt-8 mb-2">
                                <SmoothButton
                                    buttonStyle="bg-black rounded-full py-4 items-center justify-center border-[2px] border-black"
                                    shadowStyle="bg-black rounded-full"
                                    depth={2}
                                    onPress={() => console.log('Save Changes')}
                                >
                                    <Text className="text-sm uppercase tracking-widest" style={{ fontFamily: FONT_BOLD, color: 'white' }}>SAVE CHANGES</Text>
                                </SmoothButton>
                                <Text className="text-[10px] text-center mt-3 px-4 leading-3" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>
                                    Note: Please complete your profile before registering for events or purchasing visitor passes.
                                </Text>
                            </View>
                        </ShadowCard>
                    </Animated.View>

                    {/* Registered Events Card */}
                    <Animated.View entering={FadeIn.duration(400)} className="mb-6">
                        <ShadowCard>
                            <View className="flex-row items-center gap-3 mb-2">
                                <View className="bg-[#E0B0FF] p-2 rounded-full border-[2px] border-black">
                                    <Calendar color="black" size={20} />
                                </View>
                                <Text className="text-xl uppercase flex-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>REGISTERED{'\n'}EVENTS</Text>
                            </View>
                            <View className="h-[2px] bg-black w-full mb-8 rounded-full" />

                            {/* Empty State */}
                            <View className="items-center justify-center py-4">
                                <View className="w-12 h-12 rounded-full border-[2px] border-gray-300 items-center justify-center mb-3">
                                    <Text className="font-bold text-xl" style={{ color: '#d1d5db' }}>!</Text>
                                </View>
                                <Text className="text-sm mb-1" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>No Events Found</Text>
                                <Text className="text-xs text-center px-8 mb-4" style={{ fontFamily: FONT_MAIN, color: '#9ca3af' }}>
                                    You've not registered for any event yet.
                                </Text>
                                <TouchableOpacity>
                                    <Text className="text-xs underline decoration-[#E0B0FF]" style={{ fontFamily: FONT_BOLD, color: '#D580FF' }}>
                                        Register for events →
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ShadowCard>
                    </Animated.View>

                    {/* My Passes Card */}
                    <Animated.View entering={FadeIn.duration(400)} className="mb-10">
                        <ShadowCard>
                            <View className="flex-row items-center gap-3 mb-2">
                                <View className="bg-[#E0B0FF] p-2 rounded-full border-[2px] border-black">
                                    <Ticket color="black" size={20} />
                                </View>
                                <Text className="text-xl uppercase flex-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>MY PASSES</Text>
                            </View>
                            <View className="h-[2px] bg-black w-full mb-8 rounded-full" />

                            {/* Empty State */}
                            <View className="items-center justify-center py-4">
                                <Lock color="#d1d5db" size={48} strokeWidth={1.5} className="mb-3" />
                                <Text className="text-sm mb-1" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>No Passes Found</Text>
                                <Text className="text-xs text-center px-8" style={{ fontFamily: FONT_MAIN, color: '#9ca3af' }}>
                                    You've not generated any passes yet.
                                </Text>
                            </View>
                        </ShadowCard>
                    </Animated.View>

                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
};

export default ProfileScreen;
