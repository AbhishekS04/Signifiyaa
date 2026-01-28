import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Platform, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Copy, ChevronDown, Calendar, Ticket, Lock, User } from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { PageTransition } from '../components/navigation/PageTransition';
import { useAuth } from '../context/AuthContext';

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
    const navigation = useNavigation<any>();
    const { isLoggedIn, signOut, user, profile } = useAuth();

    // Real State from Profile
    const [name, setName] = useState(profile?.name || user?.user_metadata?.full_name || 'Signifiya User');
    const [email, setEmail] = useState(user?.email || 'user@signifiya.com');
    const [mobile, setMobile] = useState(profile?.mobileNo || '');
    const [college, setCollege] = useState(profile?.collegeName || '');
    const [gender, setGender] = useState(profile?.gender || 'Male');
    const bookingId = profile?.bookingId || 'NOT-ASSIGNED';

    // Update state when profile loads
    React.useEffect(() => {
        if (profile) {
            setName(profile.name || user?.user_metadata?.full_name || '');
            setMobile(profile.mobileNo || '');
            setCollege(profile.collegeName || '');
            setGender(profile.gender || 'Male');
        }
        if (user) {
            setEmail(user.email || '');
        }
    }, [profile, user]);

    // Profile Image
    const PROFILE_IMAGE = profile?.image || 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/68e0efce-84a4-42ae-9bd7-a2be6aca73d8.jpg';

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
                    {!isLoggedIn ? (
                        <Animated.View entering={FadeIn.duration(400)} className="pt-10">
                            {/* Header */}
                            <View className="mb-8 px-2">
                                <Text className="text-5xl uppercase tracking-tighter" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                    PROFILE
                                </Text>
                            </View>

                            {/* Login Card */}
                            <ShadowCard shadowOffset={12}>
                                <View className="items-center py-6">
                                    <View className="bg-[#D580FF]/10 p-6 rounded-full border-[2.5px] border-black mb-6">
                                        <User color="#D580FF" size={48} strokeWidth={2.5} />
                                    </View>
                                    <Text className="text-3xl text-center mb-2" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                        JOIN SIGNIFIYA
                                    </Text>
                                    <Text className="text-sm text-center px-4 leading-5 mb-10" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>
                                        Sign in to access your profile, track registrations, and generate your event passes.
                                    </Text>

                                    <View className="w-full">
                                        <SmoothButton
                                            onPress={() => navigation.navigate('Auth')}
                                            buttonStyle="bg-black border-[2.5px] border-black rounded-[20px] py-5 items-center justify-center"
                                            shadowStyle="bg-black rounded-[20px]"
                                            depth={6}
                                        >
                                            <Text className="text-white text-[16px] uppercase tracking-[0.2em]" style={{ fontFamily: FONT_BOLD }}>
                                                SIGN IN / SIGN UP
                                            </Text>
                                        </SmoothButton>
                                    </View>
                                </View>
                            </ShadowCard>
                        </Animated.View>
                    ) : (
                        <>
                            {/* Screen Header */}
                            <View className="mb-6">
                                <Text className="text-5xl uppercase tracking-tighter" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                    YOUR{'\n'}PROFILE
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
                                        <View>
                                            <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>FULL NAME</Text>
                                            <TextInput value={name} onChangeText={setName} className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-white" style={{ fontFamily: FONT_MAIN, color: 'black' }} />
                                        </View>
                                        <View>
                                            <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>EMAIL ADDRESS</Text>
                                            <TextInput value={email} editable={false} className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-gray-50" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }} />
                                        </View>
                                        <View>
                                            <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>BOOKING ID</Text>
                                            <View className="relative">
                                                <TextInput value={bookingId} editable={false} className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-gray-100" style={{ fontFamily: FONT_MAIN, color: '#4b5563' }} />
                                                <TouchableOpacity
                                                    className="absolute right-3 top-[10px]"
                                                    onPress={() => {
                                                        Alert.alert("Success", "Booking ID copied to clipboard!");
                                                    }}
                                                >
                                                    <Copy color="black" size={18} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View>
                                            <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>GENDER</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setGender((prev: string) => prev === 'Male' ? 'Female' : 'Male');
                                                }}
                                                className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 flex-row justify-between items-center bg-white"
                                            >
                                                <Text className="text-sm" style={{ fontFamily: FONT_MAIN, color: 'black' }}>{gender}</Text>
                                                <ChevronDown color="black" size={18} />
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>MOBILE NO.</Text>
                                            <TextInput value={mobile} onChangeText={setMobile} className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-white" style={{ fontFamily: FONT_MAIN, color: 'black' }} keyboardType="phone-pad" />
                                        </View>
                                        <View>
                                            <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>COLLEGE NAME</Text>
                                            <TextInput value={college} onChangeText={setCollege} className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-white" style={{ fontFamily: FONT_MAIN, color: 'black' }} />
                                        </View>
                                    </View>

                                    <View className="mt-8 mb-2">
                                        <SmoothButton buttonStyle="bg-black rounded-full py-4 items-center justify-center border-[2px] border-black" shadowStyle="bg-black rounded-full" depth={2} onPress={() => console.log('Save Changes')}>
                                            <Text className="text-sm uppercase tracking-widest" style={{ fontFamily: FONT_BOLD, color: 'white' }}>SAVE CHANGES</Text>
                                        </SmoothButton>
                                    </View>
                                </ShadowCard>
                            </Animated.View>

                            <Animated.View entering={FadeIn.duration(400)} className="mb-6">
                                <ShadowCard>
                                    <View className="flex-row items-center gap-3 mb-2">
                                        <View className="bg-[#E0B0FF] p-2 rounded-full border-[2px] border-black"><Calendar color="black" size={20} /></View>
                                        <Text className="text-xl uppercase flex-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>REGISTERED{'\n'}EVENTS</Text>
                                    </View>
                                    <View className="h-[2px] bg-black w-full mb-8 rounded-full" />
                                    <View className="items-center justify-center py-4">
                                        <Text className="text-sm mb-1" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>No Events Found</Text>
                                    </View>
                                </ShadowCard>
                            </Animated.View>

                            {/* My Passes Card */}
                            <Animated.View entering={FadeIn.duration(400)} className="mb-6">
                                <ShadowCard>
                                    <View className="flex-row items-center gap-3 mb-2">
                                        <View className="bg-[#E0B0FF] p-2 rounded-full border-[2px] border-black"><Ticket color="black" size={20} /></View>
                                        <Text className="text-xl uppercase flex-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>MY PASSES</Text>
                                    </View>
                                    <View className="h-[2px] bg-black w-full mb-8 rounded-full" />
                                    <View className="items-center justify-center py-4">
                                        <Lock color="#d1d5db" size={48} strokeWidth={1.5} className="mb-3" />
                                        <Text className="text-sm mb-1" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>No Passes Found</Text>
                                    </View>
                                </ShadowCard>
                            </Animated.View>

                            <TouchableOpacity onPress={signOut} className="mt-4 mb-10 border-[3px] border-red-500 rounded-3xl py-4 items-center bg-red-50">
                                <Text className="text-red-500 font-bold uppercase tracking-widest text-[10px]">Logout from account</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </PageTransition>
        </SafeAreaView>
    );
};

export default ProfileScreen;
