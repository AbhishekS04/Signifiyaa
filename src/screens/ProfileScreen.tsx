import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Platform, Alert, ActivityIndicator, RefreshControl, Modal, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
    Copy,
    Check,
    ChevronDown,
    Calendar,
    Ticket,
    Lock,
    User,
    Clock,
    CheckCircle2,
    QrCode,
    Download,
    X,
    UserCircle2,
    CalendarDays
} from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import Animated, { FadeIn, Easing, useSharedValue, useAnimatedStyle, withTiming, runOnJS, cancelAnimation, FadeOut } from 'react-native-reanimated';
import { PageTransition } from '../components/navigation/PageTransition';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import AvatarChooserModal, { AVATAR_MAP } from '../components/ui/AvatarChooserModal';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import EventPass from '../components/passes/EventPass';
import VisitorPass from '../components/passes/VisitorPass';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Font Constants
const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton';

interface VisitorRegistration {
    id: string;
    name: string;
    email: string;
    passType: string;
    status: 'pending' | 'approved';
    userBookingId: string;
    createdAt: string;
    amount: number;
}

interface EventRegistration {
    id: string;
    teamName: string;
    status: 'pending' | 'approved';
    leaderBookingId: string;
    createdAt: string;
    participant_team_event: {
        event: {
            name: string;
            date?: string;
        }
    }[];
}

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
    const [name, setName] = useState(profile?.name || user?.name || 'Signifiya User');
    const [email, setEmail] = useState(user?.email || 'user@signifiya.com');
    const [mobile, setMobile] = useState(profile?.mobileNo || '');
    const [college, setCollege] = useState(profile?.collegeName || '');
    const [gender, setGender] = useState(profile?.gender || 'Male');
    const bookingId = profile?.bookingId || user?.bookingId || 'NOT-ASSIGNED';

    const [visitorRegistrations, setVisitorRegistrations] = useState<VisitorRegistration[]>([]);
    const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
    const [isFetchingReg, setIsFetchingReg] = useState(false);
    const [selectedPass, setSelectedPass] = useState<{ type: 'visitor' | 'event', data: any } | null>(null);

    const fetchRegistrations = useCallback(async () => {
        if (!user?.email) return;
        setIsFetchingReg(true);
        try {
            // Fetch visitor registrations
            const { data: vData, error: vError } = await supabase.from('visitor_registration')
                .select('*')
                .eq('email', user.email)
                .order('createdAt', { ascending: false });

            // Fetch event registrations
            const { data: eData, error: eError } = await supabase.from('participant_team')
                .select(`
                    *,
                    participant_team_event (
                        event (
                            name,
                            date
                        )
                    ),
                    participant_team_member (*)
                `)
                .eq('leaderEmail', user.email)
                .order('createdAt', { ascending: false });

            if (vError) console.error('Error fetching visitor regs:', vError);
            if (eError) console.error('Error fetching event regs:', eError);

            // Normalize status: Map 'verified' to 'approved' so the UI logic works correctly
            const normalizedVData = (vData || []).map(v => ({
                ...v,
                status: v.status === 'verified' ? 'approved' : v.status
            })) as VisitorRegistration[];

            const normalizedEData = (eData as any || []).map((e: any) => ({
                ...e,
                status: e.status === 'verified' ? 'approved' : e.status
            })) as EventRegistration[];

            setVisitorRegistrations(normalizedVData);
            setEventRegistrations(normalizedEData);

        } catch (err) {
            console.error('Fetch exception:', err);
        } finally {
            setIsFetchingReg(false);
        }
    }, [user?.email, bookingId]);

    // Update state when profile loads
    useEffect(() => {
        if (profile) {
            setName(profile.name || user?.name || '');
            setMobile(profile.mobileNo || '');
            setCollege(profile.collegeName || '');
            setGender(profile.gender || 'Male');
        } else if (user) {
            setName(user.name || '');
        }
        if (user) {
            setEmail(user.email || '');
            fetchRegistrations();
        }
    }, [profile, user]);

    // Profile Image
    // Profile Image Logic: Use DB image -> User Image -> Generated Avatar
    // Profile Image Logic
    // If it starts with 'avatar', it's a local asset. Otherwise check if it's a URL.
    const rawImage = profile?.image || user?.image;

    // Determine the image source for the Image component
    let imageSource = null;
    if (rawImage?.startsWith('avatar') && AVATAR_MAP[rawImage]) {
        // It's a local asset key
        imageSource = AVATAR_MAP[rawImage];
    } else if (rawImage?.startsWith('http')) {
        // It's a remote URL (Google/GitHub/etc)
        imageSource = { uri: rawImage };
    } else {
        // Default / Null state
        imageSource = null;
    }

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    // Avatar Toast State
    const [showAvatarToast, setShowAvatarToast] = useState(false);
    const [showCopyToast, setShowCopyToast] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyBookingId = useCallback(async () => {
        if (bookingId) {
            await Clipboard.setStringAsync(bookingId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowCopyToast(true);
        }
    }, [bookingId]);
    const avatarToastY = useSharedValue(-100);
    const copyToastY = useSharedValue(-100);

    // Logout Hold State
    const holdProgress = useSharedValue(0);
    const [isHolding, setIsHolding] = useState(false);

    const flipRotation = useSharedValue(0);
    const { updateProfile } = useAuth();

    // Ref-managed timers — prevents leaks from nested timeouts
    const copyTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const avatarTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const flipTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

    // Copy Toast Animation
    React.useEffect(() => {
        if (showCopyToast) {
            copyToastY.value = withTiming(Platform.OS === 'ios' ? 60 : 40, {
                duration: 400,
                easing: Easing.out(Easing.poly(4))
            });

            const t1 = setTimeout(() => {
                copyToastY.value = withTiming(-100, { duration: 300 });
                const t2 = setTimeout(() => setShowCopyToast(false), 300);
                copyTimers.current.push(t2);
            }, 2000);
            copyTimers.current.push(t1);

            return () => {
                copyTimers.current.forEach(clearTimeout);
                copyTimers.current = [];
            };
        }
    }, [showCopyToast]);

    const copyToastStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: copyToastY.value }],
    }));

    const handleLogoutPressIn = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setIsHolding(true);
        holdProgress.value = withTiming(1, { duration: 2000, easing: Easing.linear }, (finished) => {
            if (finished) {
                runOnJS(triggerLogout)();
            }
        });
    }, [holdProgress]);

    const handleLogoutPressOut = useCallback(() => {
        setIsHolding(false);
        cancelAnimation(holdProgress);
        holdProgress.value = withTiming(0, { duration: 300 });
    }, [holdProgress]);

    const triggerLogout = useCallback(() => {
        // Strong feedback on completion as requested
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        signOut();
    }, [signOut]);

    const holdProgressStyle = useAnimatedStyle(() => ({
        width: `${holdProgress.value * 100}%`,
    }));

    // Avatar Toast Animation
    React.useEffect(() => {
        if (showAvatarToast) {
            avatarToastY.value = withTiming(Platform.OS === 'ios' ? 60 : 40, {
                duration: 400,
                easing: Easing.out(Easing.poly(4))
            });

            const t1 = setTimeout(() => {
                avatarToastY.value = withTiming(-100, { duration: 300 });
                const t2 = setTimeout(() => setShowAvatarToast(false), 300);
                avatarTimers.current.push(t2);
            }, 2000);
            avatarTimers.current.push(t1);

            return () => {
                avatarTimers.current.forEach(clearTimeout);
                avatarTimers.current = [];
            };
        }
    }, [showAvatarToast]);

    const avatarToastStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: avatarToastY.value }],
    }));

    // Removed artificial 800ms loading delay — wastes startup time with no functional purpose
    React.useEffect(() => {
        setIsLoading(false);
    }, []);

    // Button flip animation
    React.useEffect(() => {
        if (showSuccess) {
            flipRotation.value = withTiming(180, { duration: 400, easing: Easing.inOut(Easing.ease) });
            const t1 = setTimeout(() => {
                flipRotation.value = withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) });
                const t2 = setTimeout(() => setShowSuccess(false), 400);
                flipTimers.current.push(t2);
            }, 2000);
            flipTimers.current.push(t1);

            return () => {
                flipTimers.current.forEach(clearTimeout);
                flipTimers.current = [];
            };
        }
    }, [showSuccess]);

    const buttonFlipStyle = useAnimatedStyle(() => ({
        transform: [{ rotateX: `${flipRotation.value}deg` }],
    }));

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const { data: freshProfile, error } = await supabase
                .from('user')
                .select('bookingId, mobileNo, collegeName, gender, name, image')
                .eq('email', user?.email)
                .single();

            if (!error && freshProfile) {
                // Update local state with fresh data
                setName(freshProfile.name || user?.name || '');
                setMobile(freshProfile.mobileNo || '');
                setCollege(freshProfile.collegeName || '');
                setGender(freshProfile.gender || 'Male');
            }
            await fetchRegistrations();
        } catch (error) {
            // Silent fail - user can retry
        } finally {
            setRefreshing(false);
        }
    }, [user?.email, user?.name, fetchRegistrations]);

    const handleAvatarSelect = useCallback(async (avatarId: string) => {
        try {
            // Update immediately in UI
            await updateProfile({
                image: avatarId
            });
            setShowAvatarModal(false);
            // Show custom toast instead of alert
            setShowAvatarToast(true);
        } catch (error) {
            Alert.alert("Error", "Failed to update avatar");
        }
    }, [updateProfile]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                name,
                mobileNo: mobile,
                collegeName: college,
                gender,
            });
            setIsSaving(false);
            setShowSuccess(true);
        } catch (error) {
            setIsSaving(false);
            Alert.alert('Error', 'Failed to update profile');
        }
    }, [name, mobile, college, gender, updateProfile]);

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
            {/* Custom Avatar Success Toast */}
            {showAvatarToast && (
                <Animated.View
                    style={[avatarToastStyle, {
                        position: 'absolute',
                        alignSelf: 'center',
                        zIndex: 9999,
                        top: 0,
                    }]}
                >
                    <View className="bg-black px-6 py-3 rounded-full flex-row items-center gap-3 border-[2px] border-white/20 shadow-lg shadow-black/50">
                        <View className="bg-green-500 rounded-full w-5 h-5 items-center justify-center">
                            <Text className="text-black text-[10px] font-bold">✓</Text>
                        </View>
                        <Text className="text-white text-sm font-bold tracking-wide uppercase">Avatar Updated</Text>
                    </View>
                </Animated.View>
            )}

            <PageTransition style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: '#F5E6FA' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#000"
                            colors={['#000']}
                        />
                    }
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
                                            {imageSource ? (
                                                <Image
                                                    source={imageSource}
                                                    style={{ width: '100%', height: '100%' }}
                                                    contentFit="cover"
                                                    cachePolicy="memory-disk"
                                                    transition={150}
                                                />
                                            ) : (
                                                <View className="w-full h-full items-center justify-center bg-gray-200">
                                                    <User size={40} color="#9ca3af" />
                                                </View>
                                            )}
                                        </ShadowAvatar>
                                        <TouchableOpacity
                                            className="mt-2"
                                            onPress={() => setShowAvatarModal(true)}
                                        >
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
                                                    className={`absolute right-3 top-[10px] w-8 h-8 items-center justify-center rounded-lg ${isCopied ? 'bg-green-500' : 'bg-white/50 active:bg-gray-200'}`}
                                                    onPress={handleCopyBookingId}
                                                    disabled={isCopied}
                                                >
                                                    {isCopied ? (
                                                        <Check color="white" size={16} strokeWidth={3} />
                                                    ) : (
                                                        <Copy color="black" size={16} />
                                                    )}
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
                                        <SmoothButton
                                            buttonStyle="bg-black rounded-full py-4 items-center justify-center border-[2px] border-black"
                                            shadowStyle="bg-black rounded-full"
                                            depth={2}
                                            onPress={handleSave}
                                            disabled={isSaving || showSuccess}
                                        >
                                            <Animated.View style={[buttonFlipStyle, { width: '100%', alignItems: 'center' }]}>
                                                {isSaving ? (
                                                    <ActivityIndicator size="small" color="white" />
                                                ) : showSuccess ? (
                                                    <View className="flex-row items-center gap-2">
                                                        <Text className="text-white font-bold text-lg">✓</Text>
                                                        <Text className="text-sm uppercase tracking-widest" style={{ fontFamily: FONT_BOLD, color: 'white' }}>SUCCESSFUL</Text>
                                                    </View>
                                                ) : (
                                                    <Text className="text-sm uppercase tracking-widest" style={{ fontFamily: FONT_BOLD, color: 'white' }}>SAVE CHANGES</Text>
                                                )}
                                            </Animated.View>
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
                                    <View className="h-[2px] bg-black w-full mb-6 rounded-full" />

                                    {eventRegistrations.length > 0 ? (
                                        <View className="gap-4">
                                            {eventRegistrations.map((reg) => {
                                                // Extract team name and backup event names
                                                const [displayTeamName, backupEventNames] = reg.teamName.includes(' | ')
                                                    ? reg.teamName.split(' | ')
                                                    : [reg.teamName, ''];

                                                const events = reg.participant_team_event && reg.participant_team_event.length > 0
                                                    ? reg.participant_team_event.map(ev => ev.event?.name)
                                                    : backupEventNames ? backupEventNames.split(', ') : [];

                                                return (
                                                    <View key={reg.id} className="bg-[#F8F9FA] p-4 rounded-2xl border-2 border-dashed border-black/20">
                                                        <View className="flex-row justify-between items-start mb-2">
                                                            <View className="flex-1">
                                                                <Text className="text-sm text-black mb-1" style={{ fontFamily: FONT_BOLD }}>
                                                                    {displayTeamName}
                                                                </Text>
                                                                <View className="flex-row items-center gap-1">
                                                                    <CalendarDays size={12} color="#6b7280" />
                                                                    <Text className="text-[10px] text-gray-500" style={{ fontFamily: FONT_MAIN }}>
                                                                        {new Date(reg.createdAt).toLocaleDateString()}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View className={`px-2 py-1 rounded-full border ${reg.status === 'approved' ? 'bg-green-100 border-green-500/30' : 'bg-orange-100 border-orange-500/30'}`}>
                                                                <View className="flex-row items-center gap-1">
                                                                    {reg.status === 'approved' ? (
                                                                        <CheckCircle2 size={10} color="#22c55e" />
                                                                    ) : (
                                                                        <Clock size={10} color="#f97316" />
                                                                    )}
                                                                    <Text className={`text-[8px] font-bold uppercase ${reg.status === 'approved' ? 'text-green-600' : 'text-orange-600'}`}>
                                                                        {reg.status}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>

                                                        <View className="flex-row flex-wrap gap-2 mb-3">
                                                            {events.length > 0 ? (
                                                                events.map((eventName, i) => (
                                                                    <View key={i} style={{ backgroundColor: '#FFF3E0', borderColor: '#E65100', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                                                                        <Text style={{ fontFamily: FONT_BOLD, fontSize: 9, color: '#E65100', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                                            {eventName}
                                                                        </Text>
                                                                    </View>
                                                                ))
                                                            ) : (
                                                                <View style={{ backgroundColor: '#F3F4F6', borderColor: '#D1D5DB', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                                                                    <Text style={{ fontFamily: FONT_BOLD, fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                                        Event Not Linked
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>

                                                        {reg.status === 'approved' ? (
                                                            <TouchableOpacity
                                                                onPress={() => setSelectedPass({ type: 'event', data: reg })}
                                                                className="bg-black py-2 rounded-xl flex-row items-center justify-center gap-2"
                                                            >
                                                                <QrCode size={14} color="white" />
                                                                <Text className="text-white text-[10px] font-bold uppercase tracking-widest">VIEW PASS</Text>
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <View className="bg-gray-200 py-2 rounded-xl flex-row items-center justify-center gap-2 opacity-50">
                                                                <Clock size={14} color="#6b7280" />
                                                                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">PENDING APPROVAL</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    ) : (
                                        <View className="items-center justify-center py-4">
                                            {isFetchingReg ? (
                                                <ActivityIndicator size="small" color="#000" />
                                            ) : (
                                                <Text className="text-sm mb-1" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>No Events Found</Text>
                                            )}
                                        </View>
                                    )}
                                </ShadowCard>
                            </Animated.View>

                            {/* My Passes Card */}
                            <Animated.View entering={FadeIn.duration(400)} className="mb-6">
                                <ShadowCard>
                                    <View className="flex-row items-center gap-3 mb-2">
                                        <View className="bg-[#E0B0FF] p-2 rounded-full border-[2px] border-black"><Ticket color="black" size={20} /></View>
                                        <Text className="text-xl uppercase flex-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>MY PASSES</Text>
                                    </View>
                                    <View className="h-[2px] bg-black w-full mb-6 rounded-full" />

                                    {visitorRegistrations.length > 0 ? (
                                        <View className="gap-4">
                                            {visitorRegistrations.map((reg) => (
                                                <View key={reg.id} className="bg-[#F8F9FA] p-4 rounded-2xl border-2 border-dashed border-black/20">
                                                    <View className="flex-row justify-between items-start mb-3">
                                                        <View>
                                                            <Text className="text-[10px] text-gray-500 uppercase mb-1" style={{ fontFamily: FONT_BOLD }}>
                                                                VISITOR PASS
                                                            </Text>
                                                            <Text className="text-sm text-black" style={{ fontFamily: FONT_BOLD }}>
                                                                {(reg.passType === 'Single Day Pass' || reg.passType === 'day 1 pass' || reg.passType === 'day1' || reg.passType === 'single') ? 'Single Day Pass' : 'Double Day Pass'}
                                                            </Text>
                                                        </View>
                                                        <View className={`px-2 py-1 rounded-full border ${reg.status === 'approved' ? 'bg-green-100 border-green-500/30' : 'bg-orange-100 border-orange-500/30'}`}>
                                                            <View className="flex-row items-center gap-1">
                                                                {reg.status === 'approved' ? (
                                                                    <CheckCircle2 size={10} color="#22c55e" />
                                                                ) : (
                                                                    <Clock size={10} color="#f97316" />
                                                                )}
                                                                <Text className={`text-[8px] font-bold uppercase ${reg.status === 'approved' ? 'text-green-600' : 'text-orange-600'}`}>
                                                                    {reg.status}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    {reg.status === 'approved' ? (
                                                        <TouchableOpacity
                                                            onPress={() => setSelectedPass({ type: 'visitor', data: reg })}
                                                            className="bg-black py-2 rounded-xl flex-row items-center justify-center gap-2"
                                                        >
                                                            <QrCode size={14} color="white" />
                                                            <Text className="text-white text-[10px] font-bold uppercase tracking-widest">VIEW PASS</Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <View className="bg-gray-200 py-2 rounded-xl flex-row items-center justify-center gap-2 opacity-50">
                                                            <Clock size={14} color="#6b7280" />
                                                            <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">PENDING APPROVAL</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            ))}
                                        </View>
                                    ) : (
                                        <View className="items-center justify-center py-4">
                                            {isFetchingReg ? (
                                                <ActivityIndicator size="small" color="#000" />
                                            ) : (
                                                <>
                                                    <Lock color="#d1d5db" size={48} strokeWidth={1.5} className="mb-3" />
                                                    <Text className="text-sm mb-1" style={{ fontFamily: FONT_MAIN, color: '#6b7280' }}>No Passes Found</Text>
                                                </>
                                            )}
                                        </View>
                                    )}
                                </ShadowCard>
                            </Animated.View>

                            {/* Hold to Logout Button */}
                            <View className="mt-8 mb-10">
                                <SmoothButton
                                    buttonStyle="bg-red-500 rounded-[30px] h-[60px] items-center justify-center border-[2px] border-black overflow-hidden relative"
                                    shadowStyle="bg-black rounded-[30px]"
                                    depth={4}
                                    onPressIn={handleLogoutPressIn}
                                    onPressOut={handleLogoutPressOut}
                                    active={isHolding} // Keeps button pressed while holding
                                >
                                    {/* Progress Fill Overlay */}
                                    <Animated.View
                                        style={[
                                            {
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(0,0,0,0.2)', // Darker red/black overlay
                                                zIndex: 0
                                            },
                                            holdProgressStyle
                                        ]}
                                    />

                                    {/* Text Content */}
                                    <View className="z-10 flex-row items-center gap-2">
                                        {isHolding ? (
                                            <ActivityIndicator color="white" size="small" />
                                        ) : (
                                            <View className="w-4" />
                                        )}
                                        <Text
                                            className="text-white text-sm uppercase tracking-[0.2em]"
                                            style={{ fontFamily: FONT_BOLD }}
                                        >
                                            {isHolding ? "HOLDING..." : "HOLD TO LOG OUT"}
                                        </Text>
                                        <View className="w-4" />
                                    </View>
                                </SmoothButton>
                                <Text className="text-center text-[10px] text-gray-500 mt-3 font-medium">
                                    Press and hold for 2 seconds
                                </Text>
                            </View>
                        </>
                    )}
                </ScrollView>
            </PageTransition >

            <AvatarChooserModal
                visible={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                onSelect={handleAvatarSelect}
                currentAvatarId={rawImage || undefined}
            />

            <PassModal
                visible={!!selectedPass}
                type={selectedPass?.type || 'visitor'}
                data={selectedPass?.data}
                onClose={() => setSelectedPass(null)}
                userName={name}
                bookingId={bookingId}
            />
        </SafeAreaView >
    );
};

const PassModal = ({ visible, type, data, onClose, userName, bookingId }: {
    visible: boolean,
    type: 'visitor' | 'event',
    data: any,
    onClose: () => void,
    userName: string,
    bookingId: string
}) => {
    if (!data) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={passStyles.overlay}>
                {type === 'event' ? (
                    <EventPass
                        data={data}
                        userName={userName}
                        bookingId={bookingId}
                        onClose={onClose}
                    />
                ) : (
                    <VisitorPass
                        data={data}
                        userName={userName}
                        bookingId={bookingId}
                        onClose={onClose}
                    />
                )}
            </View>
        </Modal>
    );
};

const passStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
});

export default ProfileScreen;
