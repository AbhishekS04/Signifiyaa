import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    KeyboardAvoidingView, Platform,
    BackHandler, Modal, StyleSheet, Image, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Check, AlertCircle, X, Lock, User } from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import Animated, {
    FadeInDown, Layout, FadeIn,
    useSharedValue, useAnimatedStyle, withTiming, Easing, withRepeat
} from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};


// ─── Event Data ────────────────────────────────────────────────────────────────
const AVAILABLE_EVENTS = [
    { id: 1, name: 'CODING PREMIER LEAGUE', date: 'March 27-28', teamSize: 'Team (1-3)', price: 150 },
    { id: 2, name: 'HACKATHON 2026', date: 'March 27-28', teamSize: 'Team (2-4)', price: 300 },
    { id: 3, name: 'ROBO WARS', date: 'March 27-28', teamSize: 'Team (2-5)', price: 200 },
    { id: 4, name: 'DIL SE DESIGN', date: 'March 27-28', teamSize: 'Solo', price: 100 },
    { id: 5, name: 'VALORANT TOURNAMENT', date: 'March 27-28', teamSize: 'Team (5)', price: 500 },
    { id: 6, name: 'TECH QUIZ', date: 'March 27-28', teamSize: 'Team (2)', price: 50 },
];

// UPI QR placeholder (replace with your actual UPI QR image)
const UPI_QR_PLACEHOLDER = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=8942837703@ikwik&pn=Signifiya&am=';
const UPI_ID = '8942837703@ikwik';

// ─── Fonts ─────────────────────────────────────────────────────────────────────
const FONT_HEADING = 'BBHBartle';
const FONT_BODY = 'Gilton';
const FONT_SUB = 'Softura';

// ─── Main Component ────────────────────────────────────────────────────────────
interface ReceiptData {
    utrId: string;
    amount: number;
    date: string;
    syncError: boolean;
}

const EventRegistrationScreen = () => {
    const navigation = useNavigation();
    const { user, isLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(1); // 1=Leader, 2=Events, 3=Team, 4=Payment

    // ── Alert State ──
    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean; title: string; message: string; type?: 'error' | 'success' | 'info'
    }>({ visible: false, title: '', message: '', type: 'info' });

    const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
        setAlertConfig({ visible: true, title, message, type });
    };
    const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

    const [showSuccess, setShowSuccess] = useState(false);
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleGoToProfile = () => {
        setIsTransitioning(true);
        (navigation as any).navigate('Main', { screen: 'Profile' });
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const handleRegisterAnother = () => {
        setCurrentStep(1);
        setTeamName('');
        setLeaderName(user?.name || '');
        setCollege(user?.collegeName || '');
        setEmail(user?.email || '');
        setPhone(user?.mobileNo || '');
        setBookingId(user?.bookingId || '');
        setSelectedEvents([]);
        setTeamMembers([{ id: Date.now(), name: '', college: '', phone: '', email: '' }]);
        setUtrId('');
        setShowSuccess(false);
    };

    // ── Step 1: Leader Details ──
    const [teamName, setTeamName] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [college, setCollege] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bookingId, setBookingId] = useState('');

    useEffect(() => {
        if (user) {
            if (user.name) setLeaderName(user.name);
            if (user.email) setEmail(user.email);
            if (user.mobileNo) setPhone(user.mobileNo);
            if (user.collegeName) setCollege(user.collegeName);
        }
    }, [user]);

    // ── Step 2: Select Events ──
    const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

    const toggleEvent = (id: number) => {
        setSelectedEvents(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const totalPrice = selectedEvents.reduce((sum, id) => {
        const event = AVAILABLE_EVENTS.find(e => e.id === id);
        return sum + (event ? event.price : 0);
    }, 0);

    // ── Step 3: Team Members ──
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: '', college: '', phone: '', email: '' }
    ]);

    const addMember = () => {
        const newId = Date.now();
        setTeamMembers(prev => [...prev, { id: newId, name: '', college: '', phone: '', email: '' }]);
    };

    const removeMember = (id: number) => {
        if (teamMembers.length > 1) {
            setTeamMembers(prev => prev.filter(m => m.id !== id));
        }
    };

    const updateMember = (id: number, field: string, value: string) => {
        setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    // ── Step 4: Payment ──
    const [timer, setTimer] = useState(870); // 14:30
    const [utrId, setUtrId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (currentStep === 4) {
            const interval = setInterval(() => {
                setTimer(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentStep]);

    useEffect(() => {
        if (timer === 0 && currentStep === 4) {
            showAlert('SESSION EXPIRED', 'Your registration session has timed out. Please start again.', 'error');
            setCurrentStep(1);
            setTimer(870);
        }
    }, [timer, currentStep]);

    useEffect(() => {
        const backAction = () => {
            if (currentStep > 1) {
                setCurrentStep(prev => prev - 1);
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [currentStep]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // ── Validation ──
    const validateLeaderDetails = () => {
        if (!teamName.trim()) { showAlert('MISSING INPUT', 'Please enter your Team Name.', 'error'); return false; }
        if (!leaderName.trim()) { showAlert('MISSING INPUT', "Please enter the Leader's Name.", 'error'); return false; }
        if (!college.trim()) { showAlert('MISSING INPUT', 'Please enter your College.', 'error'); return false; }
        if (!email.trim()) { showAlert('MISSING INPUT', 'Please enter your Email.', 'error'); return false; }
        if (!phone.trim()) { showAlert('MISSING INPUT', 'Please enter your Phone.', 'error'); return false; }
        if (!bookingId.trim()) { showAlert('MISSING BOOKING ID', 'You must enter your Booking ID to proceed.', 'error'); return false; }

        const inputId = bookingId.trim().toUpperCase();
        const actualId = user?.bookingId?.trim().toUpperCase();
        if (inputId !== actualId) {
            showAlert('INVALID BOOKING ID', 'The Booking ID you entered does not match your profile.', 'error');
            return false;
        }
        return true;
    };

    const validateEvents = () => {
        if (selectedEvents.length === 0) {
            showAlert('CHOOSE EVENT', 'Please select at least one event.', 'error');
            return false;
        }
        return true;
    };

    // ── Submit Payment ──
    const handleSubmitPayment = async () => {
        if (!utrId.trim() || utrId.trim().length < 12) {
            showAlert('INVALID UTR ID', 'Please enter a valid 12-digit Transaction / UTR ID.', 'error');
            return;
        }

        setIsSubmitting(true);
        let syncError = false;

        try {
            const resolvedEventIds: string[] = [];
            for (const scalarId of selectedEvents) {
                const localEvent = AVAILABLE_EVENTS.find(e => e.id === scalarId);
                if (localEvent) {
                    // Try exact match first, then case-insensitive match
                    const { data: dbEvent } = await supabase
                        .from('event')
                        .select('id')
                        .ilike('name', localEvent.name)
                        .limit(1)
                        .single();
                    if (dbEvent?.id) resolvedEventIds.push(dbEvent.id);
                }
            }

            const { data: teamData, error: teamError } = await supabase
                .from('participant_team')
                .insert({
                    id: generateUUID(),
                    teamName,
                    leaderName,
                    leaderEmail: email,
                    leaderPhone: phone,
                    leaderBookingId: bookingId || null,
                    college,
                    totalAmount: totalPrice,
                    status: 'pending',
                    paymentProofUrl: utrId.trim(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
                .select()
                .single();

            if (teamError) throw teamError;
            if (!teamData) throw new Error('Failed to create team record.');

            const teamId = teamData.id;

            if (teamMembers.length > 0) {
                const membersPayload = teamMembers
                    .filter(m => m.name.trim())
                    .map(m => ({
                        teamId,
                        name: m.name || 'Unknown',
                        college: m.college || 'Unknown',
                        email: m.email || '',
                        phone: m.phone || '',
                    }));
                if (membersPayload.length > 0) {
                    const { error: membersError } = await supabase
                        .from('participant_team_member')
                        .insert(membersPayload.map(m => ({
                            ...m,
                            id: generateUUID(),
                            createdAt: new Date().toISOString()
                        })));
                    if (membersError) throw membersError;
                }
            }

            if (resolvedEventIds.length > 0) {
                const eventLinks = resolvedEventIds.map(eId => ({
                    teamId,
                    eventId: eId,
                    createdAt: new Date().toISOString()
                }));
                const { error: linksError } = await supabase
                    .from('participant_team_event')
                    .insert(eventLinks);
                if (linksError) throw linksError;
            }

        } catch (dbError: any) {
            console.error('Database Save Error:', dbError);
            syncError = true;
        }

        setIsSubmitting(false);
        setReceiptData({
            utrId: utrId.trim(),
            amount: totalPrice,
            date: new Date().toLocaleString(),
            syncError,
        });
        setShowSuccess(true);
    };

    // ── Navigation ──
    const handleNext = () => {
        if (currentStep === 1) {
            if (validateLeaderDetails()) setCurrentStep(2);
        } else if (currentStep === 2) {
            if (validateEvents()) setCurrentStep(3);
        } else if (currentStep === 3) {
            setCurrentStep(4);
        } else {
            handleSubmitPayment();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
        else (navigation as any).goBack();
    };

    // ── Progress Bar ──
    const steps = ['LEADER', 'EVENTS', 'TEAM', 'PAY'];
    const progressValue = useSharedValue(currentStep / 4);

    useEffect(() => {
        progressValue.value = withTiming(currentStep / 4, {
            duration: 500,
            easing: Easing.out(Easing.quad)
        });
    }, [currentStep, progressValue]);

    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${progressValue.value * 100}%` as any,
    }));

    const ProgressBar = () => (
        <View style={{ marginBottom: 12 }}>
            {/* Striped bar */}
            <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, animatedProgressStyle]}>
                    <View style={[StyleSheet.absoluteFill, { flexDirection: 'row' }]}>
                        {Array.from({ length: 60 }).map((_, i) => (
                            <View
                                key={i}
                                style={{
                                    width: 6,
                                    height: '100%',
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    marginRight: 8,
                                    transform: [{ skewX: '-25deg' }]
                                }}
                            />
                        ))}
                    </View>
                </Animated.View>
            </View>
            {/* Step labels */}
            <View style={styles.stepLabels}>
                {steps.map((step, i) => (
                    <Text
                        key={step}
                        style={[
                            styles.stepLabel,
                            {
                                color: currentStep - 1 >= i ? '#000' : '#ccc',
                                fontWeight: currentStep - 1 === i ? '900' : '700',
                                fontSize: 9,
                                fontFamily: FONT_SUB
                            }
                        ]}
                    >
                        {step}
                    </Text>
                ))}
            </View>
        </View>
    );

    // ── Step Badge ──
    const StepBadge = () => {
        const configs = [
            { bg: '#EDE9FE', text: 'STEP 1/4: TEAM LEADER DETAILS' },
            { bg: '#fff', text: 'STEP 2/4: SELECT EVENT', border: true },
            { bg: '#FEF9C3', text: 'STEP 3/4: ADD TEAM MEMBERS (OPTIONAL)' },
            { bg: '#FEE2E2', text: 'STEP 4/4: SECURE PAYMENT', timer: true },
        ];
        const cfg = configs[currentStep - 1];
        return (
            <View style={[
                styles.stepBadge,
                { backgroundColor: cfg.bg },
                cfg.border ? { borderWidth: 1, borderColor: '#ddd' } : {}
            ]}>
                <Text style={[styles.stepBadgeText, { fontFamily: FONT_SUB }]}>{cfg.text}</Text>
                {cfg.timer && (
                    <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>EXP: {formatTime(timer)}</Text>
                    </View>
                )}
            </View>
        );
    };

    // ── Auth Guard ──
    if (!isLoading && !user) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F5E6FA' }]} edges={['top', 'bottom']}>
                <ScrollView
                    style={{ backgroundColor: '#F5E6FA' }}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View entering={FadeIn.duration(400)} style={{ paddingTop: 40 }}>
                        {/* Header */}
                        <View style={{ marginBottom: 32 }}>
                            <Text style={{ fontSize: 48, textTransform: 'uppercase', letterSpacing: -1, fontFamily: FONT_BODY, color: 'black', lineHeight: 52 }}>
                                EVENT{`\n`}REGISTRATION
                            </Text>
                        </View>

                        {/* Auth Required Card */}
                        <View style={{
                            backgroundColor: 'white',
                            borderWidth: 3, borderColor: 'black',
                            borderRadius: 30, padding: 32,
                            shadowColor: '#000', shadowOffset: { width: 12, height: 12 },
                            shadowOpacity: 1, shadowRadius: 0, elevation: 12,
                        }}>
                            <View style={{ alignItems: 'center', marginBottom: 32 }}>
                                {/* Purple tinted lock circle — matches PaymentsScreen exactly */}
                                <View style={{
                                    backgroundColor: 'rgba(156,39,176,0.1)',
                                    padding: 24, borderRadius: 9999,
                                    borderWidth: 2.5, borderColor: 'black',
                                    marginBottom: 24,
                                }}>
                                    <Lock color="#9C27B0" size={40} strokeWidth={2.5} />
                                </View>
                                <Text style={{ fontSize: 28, textAlign: 'center', marginBottom: 12, fontFamily: FONT_BODY, color: 'black' }}>
                                    ACCESS RESTRICTED
                                </Text>
                                <Text style={{ fontSize: 13, textAlign: 'center', paddingHorizontal: 16, lineHeight: 20, fontFamily: FONT_BODY, color: '#6b7280' }}>
                                    Please sign in to your account to register for events and competitions.
                                </Text>
                            </View>

                            <SmoothButton
                                onPress={() => (navigation as any).navigate('Auth')}
                                buttonStyle="bg-black border-[2.5px] border-black rounded-[20px] py-5 items-center justify-center"
                                shadowStyle="bg-black rounded-[20px]"
                                depth={6}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <User color="white" size={20} />
                                    <Text style={{ color: 'white', fontSize: 16, textTransform: 'uppercase', letterSpacing: 2, marginLeft: 12, fontFamily: FONT_BODY }}>
                                        SIGN IN TO CONTINUE
                                    </Text>
                                </View>
                            </SmoothButton>

                            <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 24, textTransform: 'uppercase', letterSpacing: 2, fontFamily: FONT_BODY, color: '#9ca3af' }}>
                                Signifiya'26 Secure Portal
                            </Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

            {/* ── Custom Alert Modal ── */}
            <Modal transparent visible={alertConfig.visible} animationType="fade" onRequestClose={hideAlert}>
                <View style={styles.modalOverlay}>
                    <Animated.View entering={FadeIn.duration(200)} style={styles.alertContainer}>
                        <View style={styles.alertShadow} />
                        <View style={styles.alertContent}>
                            <View style={styles.alertIconWrap}>
                                <AlertCircle color="black" size={32} strokeWidth={2.5} />
                            </View>
                            <Text style={[styles.alertTitle, { fontFamily: FONT_HEADING }]}>{alertConfig.title}</Text>
                            <Text style={[styles.alertMessage, { fontFamily: FONT_BODY }]}>{alertConfig.message}</Text>
                            <SmoothButton
                                onPress={hideAlert}
                                containerStyle={{ width: '100%' }}
                                buttonStyle="bg-black py-3 rounded-xl items-center justify-center border-[2px] border-black"
                                shadowStyle="bg-gray-400 rounded-xl top-1 left-1"
                                depth={0}
                            >
                                <Text style={{ color: '#fff', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 }}>
                                    UNDERSTOOD
                                </Text>
                            </SmoothButton>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

            {/* ── Success Screen ────────────────────────────────────────────────── */}
            {showSuccess ? (
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 14, paddingBottom: 24 }}
                >
                    <View style={styles.card}>
                        {/* Return Home Button */}
                        <View style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
                            <SmoothButton
                                onPress={() => (navigation as any).goBack()}
                                buttonStyle="bg-[#FFEB3B] px-4 py-2 rounded-lg border-[2.5px] border-black flex-row items-center gap-2"
                                shadowStyle="bg-black rounded-lg"
                                depth={3}
                            >
                                <Text style={[styles.returnHomeText, { fontFamily: FONT_SUB, fontSize: 13, fontWeight: '900' }]}>← RETURN HOME</Text>
                            </SmoothButton>
                        </View>

                        <Text style={[styles.titleBlack, { fontFamily: 'Bicubik', fontSize: 36, marginTop: 4, lineHeight: 36 }]}>EVENT</Text>
                        <Text style={[styles.titlePurple, { fontFamily: 'Bicubik', fontSize: 36, marginBottom: 20, lineHeight: 36, color: '#A855F7' }]}>REGISTRATION.</Text>

                        <ProgressBar />

                        <Animated.View entering={FadeInDown.springify()} style={styles.successCard}>
                            <View style={styles.successCardShadow} />
                            <View style={styles.successCardContent}>
                                <Text style={[styles.successTitle, { fontFamily: 'Bicubik' }]}>
                                    REGISTRATION SUCCESSFUL!
                                </Text>
                                <Text style={[styles.successSubtext, { fontFamily: FONT_BODY }]}>
                                    Your team registration is pending verification.
                                </Text>
                                <Text style={[styles.successSubtext, { fontFamily: FONT_BODY, marginTop: 12 }]}>
                                    Check your profile for the event pass once approved.
                                </Text>
                            </View>
                        </Animated.View>

                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
                            <View style={{ flex: 1 }}>
                                <SmoothButton
                                    onPress={handleGoToProfile}
                                    containerStyle={{ width: '100%' }}
                                    buttonStyle="bg-black py-4 rounded-xl items-center justify-center border-[2px] border-black"
                                    shadowStyle="bg-[#A855F7] rounded-xl top-1.5 left-1.5"
                                    depth={0}
                                >
                                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        GO TO PROFILE
                                    </Text>
                                </SmoothButton>
                            </View>

                            <View style={{ flex: 1 }}>
                                <SmoothButton
                                    onPress={handleRegisterAnother}
                                    containerStyle={{ width: '100%' }}
                                    buttonStyle="bg-white py-4 rounded-xl items-center justify-center border-[2px] border-black"
                                    shadowStyle="bg-black rounded-xl top-1.5 left-1.5"
                                    depth={0}
                                >
                                    <Text style={{ color: '#000', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        REGISTER ANOTHER
                                    </Text>
                                </SmoothButton>
                            </View>
                        </View>

                        {/* Bottom Separator Line from image */}
                        <View style={{ height: 4, backgroundColor: '#4b5563', borderRadius: 2, marginTop: 100, marginBottom: 10 }} />
                    </View>
                </ScrollView>
            ) : (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 14, paddingBottom: 24 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* White Card */}
                        <View style={styles.card}>

                            {/* Return Home Button */}
                            <View style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
                                <SmoothButton
                                    onPress={() => (navigation as any).goBack()}
                                    buttonStyle="bg-[#FFEB3B] px-4 py-2 rounded-lg border-[2.5px] border-black flex-row items-center gap-2"
                                    shadowStyle="bg-black rounded-lg"
                                    depth={2}
                                >
                                    <Text style={[styles.returnHomeText, { fontFamily: FONT_SUB, fontSize: 11, fontWeight: '900' }]}>← RETURN HOME</Text>
                                </SmoothButton>
                            </View>

                            {/* Title */}
                            <View style={{ marginBottom: 12 }}>
                                <Text style={[styles.titleBlack, { fontFamily: 'Bicubik', fontSize: 40, lineHeight: 40, marginTop: 4 }]}>EVENT</Text>
                                <Text style={[styles.titlePurple, { fontFamily: 'Bicubik', fontSize: 40, lineHeight: 40, color: '#A855F7' }]}>REGISTRATION.</Text>
                            </View>

                            {/* Progress Bar */}
                            <ProgressBar />

                            {/* Step Badge */}
                            <Animated.View layout={Layout.springify()} style={{ marginBottom: 20 }}>
                                <StepBadge />
                            </Animated.View>

                            {/* ── STEP 1: Leader Details ── */}
                            {currentStep === 1 && (
                                <Animated.View entering={FadeInDown} style={{ gap: 14, marginBottom: 8 }}>
                                    <FieldGroup label="TEAM NAME" value={teamName} onChange={setTeamName} placeholder="CODE WARRIORS" />
                                    <FieldGroup label="LEADER NAME" value={leaderName} onChange={setLeaderName} placeholder="JANE DOE" />
                                    <FieldGroup label="COLLEGE" value={college} onChange={setCollege} placeholder="ADAMAS UNIVERSITY" />
                                    <FieldGroup label="EMAIL" value={email} onChange={setEmail} placeholder="EMAIL@COLLEGE.EDU" keyboardType="email-address" />
                                    <FieldGroup label="PHONE" value={phone} onChange={setPhone} placeholder="9876543210" keyboardType="phone-pad" />
                                    <View>
                                        <FieldGroup
                                            label="BOOKING ID"
                                            value={bookingId}
                                            onChange={setBookingId}
                                            placeholder="SGF26-XXXXXXXX"
                                        />
                                        <Text style={[styles.bookingHint, { fontFamily: FONT_BODY }]}>
                                            Find it in{' '}
                                            <Text
                                                style={styles.bookingHintLink}
                                                onPress={() => (navigation as any).navigate('Main', { screen: 'Profile' })}
                                            >
                                                Profile
                                            </Text>
                                            . Sign in and visit Profile first if you don't have one.
                                        </Text>
                                    </View>
                                </Animated.View>
                            )}

                            {/* ── STEP 2: Select Events ── */}
                            {currentStep === 2 && (
                                <Animated.View entering={FadeInDown} style={{ gap: 10, marginBottom: 8 }}>
                                    {AVAILABLE_EVENTS.map(event => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            selected={selectedEvents.includes(event.id)}
                                            onToggle={() => toggleEvent(event.id)}
                                        />
                                    ))}
                                </Animated.View>
                            )}

                            {/* ── STEP 3: Team Members ── */}
                            {currentStep === 3 && (
                                <Animated.View entering={FadeInDown} style={{ gap: 14, marginBottom: 8 }}>
                                    {/* Note */}
                                    <View style={styles.noteBox}>
                                        <Text style={[styles.noteText, { fontFamily: FONT_BODY }]}>
                                            Note: Team leader is automatically included. Add other members here.
                                        </Text>
                                    </View>

                                    {teamMembers.map((member, index) => (
                                        <MemberCard
                                            key={member.id}
                                            member={member}
                                            index={index}
                                            onRemove={() => removeMember(member.id)}
                                            onUpdate={(field: string, value: string) => updateMember(member.id, field, value)}
                                            canRemove={teamMembers.length > 1}
                                        />
                                    ))}

                                    {/* Add Member Button */}
                                    <TouchableOpacity onPress={addMember} style={styles.addMemberBtn} activeOpacity={0.7}>
                                        <Text style={[styles.addMemberText, { fontFamily: FONT_BODY }]}>+ ADD MEMBER</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            )}

                            {/* ── STEP 4: Payment ── */}
                            {currentStep === 4 && (
                                <Animated.View entering={FadeInDown} style={{ gap: 16, marginBottom: 8 }}>
                                    {/* Receipt Summary */}
                                    <View style={styles.receiptSummaryBox}>
                                        <Text style={[styles.receiptSummaryTitle, { fontFamily: FONT_SUB }]}>RECEIPT SUMMARY</Text>
                                        <View style={styles.receiptDivider} />
                                        {selectedEvents.map(id => {
                                            const event = AVAILABLE_EVENTS.find(e => e.id === id);
                                            return (
                                                <View key={id} style={styles.receiptSummaryRow}>
                                                    <Text style={[styles.receiptSummaryEventName, { fontFamily: FONT_BODY }]}>
                                                        {event?.name ? event.name.charAt(0) + event.name.slice(1).toLowerCase() : ''}
                                                    </Text>
                                                    <Text style={[styles.receiptSummaryPrice, { fontFamily: FONT_BODY }]}>₹{event?.price}</Text>
                                                </View>
                                            );
                                        })}
                                        <View style={styles.receiptDivider} />
                                        <View style={styles.receiptSummaryRow}>
                                            <Text style={[styles.receiptTotalLabel, { fontFamily: FONT_SUB }]}>TOTAL</Text>
                                            <Text style={[styles.receiptTotalValue, { fontFamily: FONT_SUB }]}>₹{totalPrice}</Text>
                                        </View>
                                    </View>

                                    {/* QR Code Section */}
                                    <View className="items-center mb-8">
                                        <View className="p-4 bg-white border-[3px] border-black rounded-[25px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                            <Image
                                                source={{ uri: `${UPI_QR_PLACEHOLDER}${totalPrice}` }}
                                                style={{ width: 220, height: 220, borderRadius: 10 }}
                                            />
                                            <View className="absolute top-1/2 left-1/2 ml-[-15px] mt-[-15px] bg-white p-1 rounded-sm border border-gray-100">
                                                <Image source={{ uri: 'https://i.imgur.com/3g7nmJC.png' }} style={{ width: 24, height: 24 }} />
                                            </View>
                                        </View>
                                        <Text className="mt-8 text-black font-black text-sm text-center px-4" style={{ fontFamily: FONT_BODY }}>
                                            Scan this QR code with any UPI app to pay.
                                        </Text>
                                        <Text className="mt-2 text-gray-500 font-bold text-[10px] text-center" style={{ fontFamily: FONT_BODY }}>
                                            UPI ID: {UPI_ID}
                                        </Text>
                                    </View>

                                    {/* UTR Input */}
                                    <View>
                                        <Text style={[styles.utrLabel, { fontFamily: FONT_SUB }]}>ENTER TRANSACTION / UTR ID</Text>
                                        <View style={styles.utrInputWrap}>
                                            <TextInput
                                                value={utrId}
                                                onChangeText={setUtrId}
                                                placeholder="Enter 12-digit UTR ID"
                                                placeholderTextColor="#aaa"
                                                style={[styles.utrInput, { fontFamily: FONT_BODY }]}
                                                keyboardType="default"
                                                maxLength={22}
                                            />
                                        </View>
                                        <Text style={[styles.utrHint, { fontFamily: FONT_BODY }]}>
                                            Usually starts with banking ref no. or 'UPI...'
                                        </Text>
                                    </View>
                                </Animated.View>
                            )}

                            {/* ── Navigation Buttons ── */}
                            <View style={{ marginTop: 20, flexDirection: currentStep > 1 ? 'row' : 'column', gap: 10 }}>
                                {currentStep > 1 && (
                                    <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.8}>
                                        <Text style={[styles.backBtnText, { fontFamily: FONT_SUB }]}>BACK</Text>
                                    </TouchableOpacity>
                                )}
                                <View style={{ flex: currentStep > 1 ? 1 : undefined }}>
                                    <SmoothButton
                                        onPress={handleNext}
                                        containerStyle={{ width: '100%' }}
                                        buttonStyle="bg-black py-4 rounded-[16px] items-center justify-center border-[2px] border-black"
                                        shadowStyle="bg-[#A855F7] rounded-[16px] top-1.5 left-1.5"
                                        depth={0}
                                    >
                                        {isSubmitting ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={[styles.nextBtnText, { fontFamily: FONT_SUB }]}>
                                                {currentStep === 1 ? 'NEXT: SELECT EVENT →' :
                                                    currentStep === 2 ? 'NEXT: ADD TEAM →' :
                                                        currentStep === 3 ? 'NEXT: PAYMENT →' :
                                                            'SUBMIT PAYMENT DETAILS →'}
                                            </Text>
                                        )}
                                    </SmoothButton>
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}

            {/* ── Transition Skeleton ── */}
            {isTransitioning && (
                <View style={[StyleSheet.absoluteFill, styles.skeleton]}>
                    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                        <View style={{ marginBottom: 24, marginTop: 16 }}>
                            <View style={styles.skeletonBlock}>
                                <SkeletonPulse />
                            </View>
                        </View>
                        <View style={styles.skeletonCard}>
                            <View style={styles.skeletonCircle}>
                                <SkeletonPulse />
                            </View>
                            {[1, 2, 3].map(i => (
                                <View key={i} style={{ marginBottom: 16 }}>
                                    <View style={styles.skeletonLine}>
                                        <SkeletonPulse />
                                    </View>
                                    <View style={styles.skeletonField}>
                                        <SkeletonPulse />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </SafeAreaView>
                </View>
            )}
        </SafeAreaView>
    );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const FieldGroup = ({ label, value, onChange, placeholder, keyboardType = 'default' }: {
    label: string,
    value: string,
    onChange: (text: string) => void,
    placeholder: string,
    keyboardType?: 'default' | 'email-address' | 'phone-pad'
}) => (
    <View>
        <Text style={[styles.fieldLabel, { fontFamily: 'Softura' }]}>{label}</Text>
        <View style={styles.fieldInputWrap}>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#bbb"
                keyboardType={keyboardType}
                autoCapitalize="none"
                style={[styles.fieldInput, { fontFamily: 'Gilton' }]}
            />
        </View>
    </View>
);

const SkeletonPulse = () => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return <Animated.View style={[animatedStyle, { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' }]} />;
};

const EventCard = ({ event, selected, onToggle }: {
    event: { id: number, name: string, date: string, teamSize: string, price: number },
    selected: boolean,
    onToggle: () => void
}) => (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.85} style={styles.eventCard}>
        <View style={{ flex: 1 }}>
            <Text style={[styles.eventName, { fontFamily: 'Softura' }]}>{event.name}</Text>
            <Text style={[styles.eventDate, { fontFamily: 'Gilton' }]}>{event.date}</Text>
        </View>
        <View style={[styles.priceBadge, selected && styles.priceBadgeSelected]}>
            <Text style={[styles.priceText, { fontFamily: 'Softura' }, selected && { color: '#fff' }]}>₹{event.price}</Text>
        </View>
    </TouchableOpacity>
);

const MemberCard = ({ member, index, onRemove, onUpdate, canRemove }: {
    member: { name: string, college: string, email: string, phone: string },
    index: number,
    onRemove: () => void,
    onUpdate: (field: string, value: string) => void,
    canRemove: boolean
}) => (
    <View style={styles.memberCard}>
        {/* Member label */}
        <View style={styles.memberLabelWrap}>
            <Text style={[styles.memberLabel, { fontFamily: 'Softura' }]}>MEMBER {index + 1}</Text>
        </View>
        {/* Remove button */}
        {canRemove && (
            <TouchableOpacity onPress={onRemove} style={styles.removeBtn} activeOpacity={0.8}>
                <X color="#fff" size={12} strokeWidth={3} />
            </TouchableOpacity>
        )}
        <View style={{ gap: 10, marginTop: 4 }}>
            <TextInput
                value={member.name}
                onChangeText={v => onUpdate('name', v)}
                placeholder="Name"
                placeholderTextColor="#bbb"
                style={[styles.memberInput, { fontFamily: 'Gilton' }]}
            />
            <TextInput
                value={member.college}
                onChangeText={v => onUpdate('college', v)}
                placeholder="College"
                placeholderTextColor="#bbb"
                style={[styles.memberInput, { fontFamily: 'Gilton' }]}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                    value={member.email}
                    onChangeText={v => onUpdate('email', v)}
                    placeholder="Email"
                    placeholderTextColor="#bbb"
                    keyboardType="email-address"
                    style={[styles.memberInput, { flex: 1, fontFamily: 'Gilton' }]}
                />
                <TextInput
                    value={member.phone}
                    onChangeText={v => onUpdate('phone', v)}
                    placeholder="Phone"
                    placeholderTextColor="#bbb"
                    keyboardType="phone-pad"
                    style={[styles.memberInput, { flex: 1, fontFamily: 'Gilton' }]}
                />
            </View>
        </View>
    </View>
);

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#000' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 20,
        paddingBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },

    // Progress
    progressTrack: {
        height: 14,
        backgroundColor: '#f4f4f4',
        borderRadius: 100,
        overflow: 'hidden',
        marginBottom: 6,
        borderWidth: 1.5,
        borderColor: '#000',
    },
    progressFill: {
        height: '100%',
        backgroundColor: 'black',
        position: 'relative',
        overflow: 'hidden',
    },
    stripesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    // Stripes are now inline for consistency
    stripe: {
        width: 12,
        height: '100%',
        backgroundColor: '#fff',
        marginRight: 10,
        transform: [{ skewX: '-25deg' }],
    },
    stepLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
    },
    stepLabel: {
        fontSize: 8,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // Step Badge
    stepBadge: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stepBadgeText: {
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        color: '#000',
        flex: 1,
    },
    timerBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    timerText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },

    // Title
    titleBlack: {
        fontSize: 30,
        fontWeight: '900',
        color: '#000',
        textTransform: 'uppercase',
        lineHeight: 34,
    },
    titlePurple: {
        fontSize: 30,
        fontWeight: '900',
        color: '#9333EA',
        textTransform: 'uppercase',
        lineHeight: 34,
    },
    returnHomeText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#000',
    },

    // Field
    fieldLabel: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#000',
        marginBottom: 6,
    },
    fieldInputWrap: {
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    fieldInput: {
        paddingHorizontal: 14,
        paddingVertical: 11,
        fontSize: 13,
        color: '#111',
        fontWeight: '600',
    },
    bookingHint: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 6,
        lineHeight: 15,
    },
    bookingHintLink: {
        textDecorationLine: 'underline',
        color: '#9333EA',
        fontWeight: '700',
    },

    // Event Card
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    eventName: {
        fontSize: 13,
        fontWeight: '900',
        color: '#111',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        lineHeight: 18,
    },
    eventDate: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
    priceBadge: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#f9fafb',
    },
    priceBadgeSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    priceText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#111',
    },

    // Member Card
    memberCard: {
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 16,
        padding: 14,
        paddingTop: 20,
        backgroundColor: '#fff',
        position: 'relative',
    },
    memberLabelWrap: {
        position: 'absolute',
        top: -11,
        left: 14,
        backgroundColor: '#fff',
        paddingHorizontal: 6,
        zIndex: 10,
    },
    memberLabel: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#6B7280',
    },
    removeBtn: {
        position: 'absolute',
        top: -12,
        right: 12,
        backgroundColor: '#EF4444',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    memberInput: {
        borderWidth: 1.5,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        color: '#111',
        backgroundColor: '#fff',
    },
    addMemberBtn: {
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderStyle: 'dashed',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    addMemberText: {
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#374151',
    },

    // Note Box
    noteBox: {
        backgroundColor: '#FEF9C3',
        borderWidth: 1.5,
        borderColor: '#FCD34D',
        borderRadius: 12,
        padding: 12,
    },
    noteText: {
        fontSize: 12,
        color: '#78350F',
        lineHeight: 18,
    },

    // Payment / Receipt Summary
    receiptSummaryBox: {
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        padding: 16,
        backgroundColor: '#fff',
    },
    receiptSummaryTitle: {
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#374151',
        textAlign: 'center',
        marginBottom: 10,
    },
    receiptDivider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 8,
        borderStyle: 'dashed',
    },
    receiptSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    receiptSummaryEventName: {
        fontSize: 13,
        color: '#374151',
        flex: 1,
    },
    receiptSummaryPrice: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111',
    },
    receiptTotalLabel: {
        fontSize: 14,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#000',
    },
    receiptTotalValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#000',
    },

    // QR Box
    qrBox: {
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        padding: 16,
        backgroundColor: '#f9fafb',
        alignItems: 'center',
    },
    qrTotalText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 12,
    },
    qrImageWrap: {
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 12,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    qrImage: {
        width: 160,
        height: 160,
    },
    qrUpiId: {
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 4,
    },
    qrScanText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },

    // UTR Input
    utrLabel: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#000',
        marginBottom: 8,
    },
    utrInputWrap: {
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    utrInput: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 13,
        color: '#111',
    },
    utrHint: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 6,
        lineHeight: 15,
    },

    // Nav Buttons
    backBtn: {
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    backBtnText: {
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#000',
    },
    nextBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        textAlign: 'center',
    },

    // Modal / Alert
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    alertContainer: {
        width: '100%',
        position: 'relative',
    },
    alertShadow: {
        position: 'absolute',
        top: 6,
        left: 6,
        right: -6,
        bottom: -6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 24,
    },
    alertContent: {
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    alertIconWrap: {
        backgroundColor: '#FEE2E2',
        padding: 16,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#000',
        marginBottom: 16,
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 8,
        color: '#000',
    },
    alertMessage: {
        textAlign: 'center',
        color: 'rgba(0,0,0,0.7)',
        fontWeight: '500',
        marginBottom: 24,
        lineHeight: 20,
    },

    // Receipt Modal
    receiptCard: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
    },
    receiptHeader: {
        padding: 24,
        alignItems: 'center',
    },
    receiptIconWrap: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 100,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    receiptTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    receiptSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4,
        textAlign: 'center',
    },
    receiptBody: {
        padding: 20,
        backgroundColor: '#fff',
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    receiptLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#9CA3AF',
    },
    receiptValue: {
        fontSize: 14,
        fontWeight: '900',
        color: '#000',
    },
    receiptNote: {
        fontSize: 11,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 16,
    },
    syncErrorBox: {
        backgroundColor: '#FFF7ED',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FED7AA',
        marginBottom: 12,
    },
    syncErrorText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#92400E',
        textAlign: 'center',
    },

    // Skeleton
    skeleton: {
        backgroundColor: '#F5E6FA',
        padding: 16,
        zIndex: 100,
    },
    skeletonBlock: {
        height: 56,
        width: 220,
        backgroundColor: 'rgba(0,0,0,0.08)',
        borderRadius: 12,
        marginBottom: 12,
    },
    skeletonCard: {
        backgroundColor: '#fff',
        borderRadius: 28,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.05)',
        padding: 24,
    },
    skeletonCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignSelf: 'center',
        marginBottom: 32,
    },
    skeletonLine: {
        height: 8,
        width: 64,
        backgroundColor: 'rgba(0,0,0,0.08)',
        borderRadius: 4,
        marginBottom: 12,
    },
    skeletonField: {
        height: 48,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.04)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
    },
    // Success Card
    successCard: {
        marginTop: 20,
        position: 'relative',
        marginBottom: 10,
    },
    successCardShadow: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: -8,
        bottom: -8,
        backgroundColor: '#000',
        borderRadius: 24,
    },
    successCardContent: {
        backgroundColor: '#48BB78', // Vibrant green from image
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 24,
        padding: 24,
        paddingVertical: 32,
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 34,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 38,
        textTransform: 'uppercase',
    },
    successSubtext: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '900',
        lineHeight: 20,
    },
});

export default EventRegistrationScreen;
