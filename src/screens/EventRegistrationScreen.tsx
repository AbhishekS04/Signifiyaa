import React, { useState, useEffect } from 'react';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Pressable, BackHandler, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, AlertCircle, X } from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import Animated, { FadeInDown, Layout, FadeIn, useSharedValue, useAnimatedStyle, withTiming, Easing, withRepeat } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// Mock Data for Step 2
const AVAILABLE_EVENTS = [
    { id: 1, name: 'CODING PREMIER LEAGUE', teamSize: 'Team (1-3)', price: 150 },
    { id: 2, name: 'HACKATHON 2026', teamSize: 'Team (2-4)', price: 300 },
    { id: 3, name: 'ROBO WARS', teamSize: 'Team (2-5)', price: 200 },
    { id: 4, name: 'DIL SE DESIGN', teamSize: 'Solo', price: 100 },
    { id: 5, name: 'VALORANT TOURNAMENT', teamSize: 'Team (5)', price: 500 },
    { id: 6, name: 'TECH QUIZ', teamSize: 'Team (2)', price: 50 },
];

const EventRegistrationScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);

    // --- Alert State ---
    const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string; type?: 'error' | 'success' | 'info' }>({
        visible: false,
        title: '',
        message: '',
        type: 'info'
    });

    const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
        setAlertConfig({ visible: true, title, message, type });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    // --- Receipt Modal State ---
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleCloseReceipt = () => {
        setShowReceipt(false);
        setIsTransitioning(true);

        // Instant navigation start
        (navigation as any).navigate('Main', { screen: 'Profile' });

        // Keep skeleton for a short, crisp duration while profile loads in background
        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    };

    // --- Step 1 State ---
    const [teamName, setTeamName] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [college, setCollege] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bookingId, setBookingId] = useState('');

    // Pre-fill user data if available
    useEffect(() => {
        if (user) {
            if (user.name) setLeaderName(user.name);
            if (user.email) setEmail(user.email);
            if (user.mobileNo) setPhone(user.mobileNo);
            if (user.collegeName) setCollege(user.collegeName);
            // We intentionally DO NOT pre-fill Booking ID to force them to look it up/enter it, 
            // OR we can pre-fill it but the user requirement implies manual entry/verification.
            // Let's autofill it for convenience but VALIDATE it on next.
            // Actually, user said: "verify... if its different... tell them to use own"
            // So we can leave it empty to force them to type it, or autofill it. 
            // Let's leave it empty as per "ghost text" request implies manual input.
        }
    }, [user]);

    // --- Step 2 State ---
    const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

    const toggleEvent = (id: number) => {
        if (selectedEvents.includes(id)) {
            setSelectedEvents(selectedEvents.filter(e => e !== id));
        } else {
            setSelectedEvents([...selectedEvents, id]);
        }
    };

    const totalPrice = selectedEvents.reduce((sum, id) => {
        const event = AVAILABLE_EVENTS.find(e => e.id === id);
        return sum + (event ? event.price : 0);
    }, 0);

    // --- Step 3 State ---
    const [teamMembers, setTeamMembers] = useState([{ id: 1, name: '', college: '', phone: '', email: '' }]);

    const addMember = () => {
        const newId = teamMembers.length + 1;
        setTeamMembers([...teamMembers, { id: newId, name: '', college: '', phone: '', email: '' }]);
    };

    const removeMember = (id: number) => {
        if (teamMembers.length > 1) {
            setTeamMembers(teamMembers.filter(m => m.id !== id));
        }
    };

    const updateMember = (id: number, field: string, value: string) => {
        setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    // --- Step 4 State ---
    const [timer, setTimer] = useState(872); // 14:32 in seconds

    React.useEffect(() => {
        if (currentStep === 3) {
            const interval = setInterval(() => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentStep]);

    // Handle Timer Expiry
    React.useEffect(() => {
        if (timer === 0 && currentStep === 3) {
            showAlert(
                "SESSION EXPIRED",
                "Your registration session has timed out. Please start again to ensure availability.",
                'error'
            );
            setCurrentStep(1);
            setTimer(872); // Reset timer
        }
    }, [timer, currentStep]);

    React.useEffect(() => {
        const backAction = () => {
            if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
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

    const handlePay = async () => {
        // --- RAZORPAY INTEGRATION ---

        // 1. configuration
        // IMPORTANT: Replace this with your actual Razorpay Key ID
        const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_S8rSjrgYttq3i7';

        // 2. Amount must be in currency subunits (e.g., paise for INR)
        const amountInPaise = totalPrice * 100;

        // 3. (Optional but Recommended) Create Order on Backend
        // You should fetch an order_id from your backend here to ensure security.
        // const orderData = await fetch('YOUR_BACKEND_URL/create-order', ...);
        // const order_id = orderData.id;

        const options = {
            description: 'Event Registration Fees',
            image: 'https://i.imgur.com/3g7nmJC.png', // Optional: Your App Logo
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: amountInPaise,
            name: 'Signifiya 2026',
            // order_id: 'order_DslnoIgkIDL8Zt', // Replace with actual order_id from backend
            prefill: {
                email: email,
                contact: phone,
                name: leaderName
            },
            theme: { color: '#000000' }
        };

        try {
            const data = await RazorpayCheckout.open(options);

            // Handle Success - Show Official Receipt Modal
            setReceiptData({
                paymentId: data.razorpay_payment_id,
                orderId: data.razorpay_order_id,
                amount: totalPrice,
                date: new Date().toLocaleString()
            });
            setShowReceipt(true);

        } catch (error: any) {
            // Handle Failure

            // Don't show error if user cancelled (code 0 is common for cancel)
            if (error.code !== 0 && error.code !== 'PAYMENT_CANCELLED') {
                showAlert("PAYMENT FAILED", error.description || "The payment transaction failed.", 'error');
            }
        }
    };

    // Fonts
    const FONT_HEADING = 'BBHBartle';
    const FONT_BODY = 'Gilton';
    const FONT_SUB = 'Softura';

    // Validation
    const validateTeamInfo = () => {
        if (!teamName.trim()) { showAlert("MISSING INPUT", "Please enter your Team Name.", 'error'); return false; }
        if (!leaderName.trim()) { showAlert("MISSING INPUT", "Please enter the Team Leader's Name.", 'error'); return false; }
        if (!college.trim()) { showAlert("MISSING INPUT", "Please enter your College.", 'error'); return false; }
        if (!email.trim()) { showAlert("MISSING INPUT", "Please enter your Email.", 'error'); return false; }
        if (!phone.trim()) { showAlert("MISSING INPUT", "Please enter your Phone.", 'error'); return false; }
        if (!bookingId.trim()) {
            showAlert("MISSING BOOKING ID", "You must enter your Booking ID to proceed.", 'error');
            return false;
        }

        const inputId = bookingId.trim().toUpperCase();
        const actualId = user?.bookingId?.trim().toUpperCase();

        if (inputId !== actualId) {
            showAlert(
                "INVALID BOOKING ID",
                "The Booking ID you entered does not match your profile.",
                'error'
            );
            return false;
        }

        const hasEmptyMember = teamMembers.find(m => !m.name.trim() || !m.college.trim());
        if (hasEmptyMember) {
            showAlert("MEMBER DETAILS", "Please fill in names and colleges for all team members.", 'error');
            return false;
        }

        return true;
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (selectedEvents.length === 0) {
                showAlert("CHOOSE EVENT", "Please select at least one event.", 'error');
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (validateTeamInfo()) {
                setCurrentStep(3);
            }
        } else {
            handlePay();
        }
    };

    const ProgressBar = () => {
        const progressWidth = currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%';

        return (
            <View className="mb-4">
                <View className="h-4 w-full bg-gray-100 border-[2px] border-black rounded-full overflow-hidden">
                    <Animated.View
                        layout={Layout.springify()}
                        className="h-full bg-purple-600"
                        style={{ width: progressWidth }}
                    />
                </View>
                <View className="flex-row justify-between px-1 mt-2">
                    <Text className={`text-[8px] font-black uppercase tracking-widest ${currentStep >= 1 ? 'text-black' : 'text-gray-300'}`}>EVENTS</Text>
                    <Text className={`text-[8px] font-black uppercase tracking-widest ${currentStep >= 2 ? 'text-black' : 'text-gray-300'}`}>TEAM</Text>
                    <Text className={`text-[8px] font-black uppercase tracking-widest ${currentStep >= 3 ? 'text-black' : 'text-gray-300'}`}>PAY</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top', 'bottom']}>

            {/* --- CUSTOM ALERT MODAL --- */}
            <Modal
                transparent
                visible={alertConfig.visible}
                animationType="fade"
                onRequestClose={hideAlert}
            >
                <View className="flex-1 bg-black/80 items-center justify-center px-6">
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        className="w-full relative"
                    >
                        {/* 3D Shadow for Alert */}
                        <View className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-white/20 rounded-[24px]" />
                        <View className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-black rounded-[24px]" />

                        {/* Alert Content */}
                        <View className="bg-white border-[3px] border-black rounded-[24px] p-6 items-center">
                            <View className="bg-red-100 p-4 rounded-full border-[2px] border-black mb-4">
                                <AlertCircle color="black" size={32} strokeWidth={2.5} />
                            </View>

                            <Text className="text-xl font-black uppercase text-center mb-2" style={{ fontFamily: FONT_HEADING }}>
                                {alertConfig.title}
                            </Text>

                            <Text className="text-center text-black/70 font-medium mb-6 leading-5" style={{ fontFamily: FONT_BODY }}>
                                {alertConfig.message}
                            </Text>

                            <SmoothButton
                                onPress={hideAlert}
                                containerStyle={{ width: '100%' }}
                                buttonStyle="bg-black py-3 rounded-xl items-center justify-center border-[2px] border-black"
                                shadowStyle="bg-gray-400 rounded-xl top-1 left-1"
                                depth={0}
                            >
                                <Text className="text-white font-bold uppercase tracking-widest">
                                    UNDERSTOOD
                                </Text>
                            </SmoothButton>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

            {/* --- PAYMENT RECEIPT MODAL --- */}
            <Modal
                transparent
                visible={showReceipt}
                animationType="slide"
                onRequestClose={() => { }} // Disable back button close to force "Go to Profile"
            >
                <View className="flex-1 bg-black/90 items-center justify-center px-4">
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        className="w-full max-w-sm bg-white rounded-[20px] overflow-hidden"
                    >
                        {/* Receipt Header */}
                        <View className="bg-green-500 p-6 items-center">
                            <View className="bg-white p-3 rounded-full mb-3 shadow-lg">
                                <Check color="green" size={32} strokeWidth={4} />
                            </View>
                            <Text className="text-white text-xl font-black uppercase tracking-widest text-center" style={{ fontFamily: FONT_HEADING }}>
                                Payment Successful
                            </Text>
                            <Text className="text-white/90 text-xs font-bold uppercase tracking-widest mt-1">
                                Team Registration confirmed
                            </Text>
                        </View>

                        {/* ZigZag / Tear Line Visual */}
                        <View className="h-4 bg-green-500 relative z-10">
                            <View className="absolute -bottom-2 w-full flex-row ml-[-5px]">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <View key={i} className="w-4 h-4 bg-white transform rotate-45 ml-1.5" />
                                ))}
                            </View>
                        </View>

                        {/* Receipt Details */}
                        <View className="p-6 pt-8 bg-white gap-4">
                            <View className="flex-row justify-between items-end border-b-2 border-dashed border-gray-200 pb-4">
                                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Amount Paid</Text>
                                <Text className="text-3xl font-black text-black" style={{ fontFamily: 'Courier New' }}>₹{receiptData?.amount}</Text>
                            </View>

                            <View className="gap-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Payment ID</Text>
                                    <Text className="text-xs font-bold text-black" style={{ fontFamily: 'Courier New' }}>{receiptData?.paymentId}</Text>
                                </View>
                                {receiptData?.orderId && (
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Order ID</Text>
                                        <Text className="text-xs font-bold text-black" style={{ fontFamily: 'Courier New' }}>{receiptData?.orderId}</Text>
                                    </View>
                                )}
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Date</Text>
                                    <Text className="text-xs font-bold text-black" style={{ fontFamily: 'Courier New' }}>{receiptData?.date}</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Team</Text>
                                    <Text className="text-xs font-bold text-black uppercase" style={{ fontFamily: FONT_SUB }}>{teamName}</Text>
                                </View>
                            </View>

                            <View className="mt-4 opacity-40">
                                <View className="h-8 flex-row items-end justify-center gap-[2px]">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <View key={i} className={`bg-black h-full w-[${i % 3 === 0 ? '4px' : '2px'}]`} />
                                    ))}
                                </View>
                                <Text className="text-center text-[8px] font-mono mt-1 text-black">OFFICIAL RECEIPT • SIGNIFIYA 2026</Text>
                            </View>

                            <View className="mt-4">
                                <SmoothButton
                                    onPress={handleCloseReceipt}
                                    containerStyle={{ width: '100%' }}
                                    buttonStyle="bg-black py-3.5 rounded-xl items-center justify-center border-[2px] border-black"
                                    shadowStyle="bg-green-500 rounded-xl top-1 left-1"
                                    depth={0}
                                >
                                    <Text className="text-white font-black uppercase tracking-widest text-sm">
                                        Continue to Profile
                                    </Text>
                                </SmoothButton>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
                >
                    <View className="bg-white w-full rounded-[30px] p-5 pb-6 overflow-hidden shadow-2xl">

                        <View className="self-start mb-4">
                            <SmoothButton
                                onPress={() => navigation.goBack()}
                                buttonStyle="bg-[#FFEB3B] px-4 py-2 rounded-lg border-[2px] border-black flex-row items-center gap-2"
                                shadowStyle="bg-black rounded-lg"
                                depth={2}
                            >
                                <ArrowLeft color="black" size={14} strokeWidth={3} />
                                <Text className="text-[10px] font-black uppercase tracking-widest text-black" style={{ fontFamily: 'Gilton' }}>
                                    RETURN HOME
                                </Text>
                            </SmoothButton>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[28px] uppercase text-black leading-8" style={{ fontFamily: 'Gilton' }}>
                                EVENT
                            </Text>
                            <Text className="text-[28px] uppercase text-purple-600 leading-8" style={{ fontFamily: 'Gilton' }}>
                                REGISTRATION
                            </Text>
                        </View>

                        <View className="mb-6">
                            <ProgressBar />
                        </View>

                        <Animated.View layout={Layout.springify()} className="mb-6">
                            {currentStep === 1 && (
                                <View className="bg-[#FEF08A] border-[2px] border-black rounded-full py-2 px-5 shadow-[3px_3px_0px_#000000] flex-row justify-between items-center">
                                    <Text className="text-xs font-black uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                        STEP 1/3: CHOOSE EVENTS
                                    </Text>
                                    <Text className="text-xs font-black uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                        ₹{totalPrice}
                                    </Text>
                                </View>
                            )}
                            {currentStep === 2 && (
                                <View className="bg-[#BFDBFE] border-[2px] border-black rounded-full py-2 px-5 shadow-[3px_3px_0px_#000000]">
                                    <Text className="text-xs font-black uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                        STEP 2/3: TEAM INFORMATION
                                    </Text>
                                </View>
                            )}
                            {currentStep === 3 && (
                                <View className="bg-[#FECACA] border-[2px] border-black rounded-full py-2 px-5 shadow-[3px_3px_0px_#000000] flex-row justify-between items-center">
                                    <Text className="text-xs font-black uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                        STEP 3/3: FINAL REVIEW
                                    </Text>
                                    <View className="flex-row items-center gap-1.5 bg-white/40 px-2 py-0.5 rounded-full">
                                        <View className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                        <Text className="text-[10px] font-black tracking-widest text-[#DC2626]" style={{ fontFamily: FONT_SUB }}>
                                            REVIEW & PAY
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </Animated.View>

                        {currentStep === 1 && (
                            <Animated.View entering={FadeInDown} className="gap-3 mb-4">
                                {AVAILABLE_EVENTS.map((event) => (
                                    <EventSelectionCard
                                        key={event.id}
                                        event={event}
                                        selected={selectedEvents.includes(event.id)}
                                        onToggle={() => toggleEvent(event.id)}
                                    />
                                ))}
                            </Animated.View>
                        )}

                        {currentStep === 2 && (
                            <Animated.View entering={FadeInDown} exiting={FadeInDown} className="gap-5 mb-6">
                                <View className="bg-gray-50 border-[2px] border-black border-dashed rounded-[20px] p-5 gap-5">
                                    <InputGroup label="TEAM NAME" value={teamName} onChange={setTeamName} placeholder="YOUR TEAM NAME" />
                                    <InputGroup label="LEADER NAME" value={leaderName} onChange={setLeaderName} placeholder="FULL NAME" />
                                    <InputGroup label="COLLEGE" value={college} onChange={setCollege} placeholder="YOUR COLLEGE" />
                                    <View className="flex-row gap-3">
                                        <View className="flex-1">
                                            <InputGroup label="EMAIL" value={email} onChange={setEmail} placeholder="EMAIL" keyboardType="email-address" />
                                        </View>
                                        <View className="flex-1">
                                            <InputGroup label="PHONE" value={phone} onChange={setPhone} placeholder="PHONE" keyboardType="phone-pad" />
                                        </View>
                                    </View>
                                    <View>
                                        <InputGroup
                                            label="BOOKING ID"
                                            value={bookingId}
                                            onChange={setBookingId}
                                            placeholder="SGF26-XXXXXXXX"
                                        />
                                        <Text className="text-[10px] text-gray-500 mt-2 leading-4 ml-1" style={{ fontFamily: FONT_BODY }}>
                                            Find it in <Text className="underline font-bold text-black" onPress={() => (navigation as any).navigate('Main', { screen: 'Profile' })}>Profile</Text>.
                                        </Text>
                                    </View>
                                </View>

                                {teamMembers.map((member, index) => (
                                    <View key={member.id} className="relative mt-2">
                                        <View className="absolute -top-3 left-6 z-20 bg-black px-3 py-1 rounded-md transform -rotate-1">
                                            <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
                                                MEMBER {index + 1}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => removeMember(member.id)} className="absolute -top-3 right-4 z-20 bg-red-500 border-2 border-black w-7 h-7 rounded-full items-center justify-center">
                                            <Text className="text-white font-bold text-[10px]">X</Text>
                                        </TouchableOpacity>
                                        <View className="bg-white border-[2px] border-black rounded-[20px] p-4 pt-6 gap-3 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                                            <InputGroup label="FULL NAME" value={member.name} onChange={(t: string) => updateMember(member.id, 'name', t)} placeholder="Name" />
                                            <InputGroup label="COLLEGE" value={member.college} onChange={(t: string) => updateMember(member.id, 'college', t)} placeholder="College" />
                                        </View>
                                    </View>
                                ))}
                                <TouchableOpacity onPress={addMember} className="border-[2px] border-black border-dashed rounded-[20px] py-4 items-center justify-center bg-gray-50 active:bg-gray-100">
                                    <Text className="text-black font-bold uppercase tracking-widest text-[10px]">+ ADD TEAM MEMBER</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {currentStep === 3 && (
                            <Animated.View entering={FadeInDown} className="gap-5 mb-4">
                                <View className="bg-white border-[2.5px] border-black rounded-[30px] overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                                    {/* Receipt Top Section */}
                                    <View className="bg-black p-4 flex-row justify-between items-center">
                                        <Text className="text-white text-[10px] font-black tracking-widest uppercase">Payment Summary</Text>
                                        <View className="bg-red-600 px-3 py-1 rounded-full">
                                            <Text className="text-white text-[9px] font-bold">EXPIRES IN {formatTime(timer)}</Text>
                                        </View>
                                    </View>

                                    <View className="p-6">
                                        {/* Team Info Snippet */}
                                        <View className="mb-6 bg-gray-50 p-4 rounded-[20px] border-[1.5px] border-black/10">
                                            <View className="flex-row justify-between mb-2">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase">TEAM</Text>
                                                <Text className="text-[11px] font-black text-black uppercase">{teamName}</Text>
                                            </View>
                                            <View className="flex-row justify-between mb-2">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase">LEADER</Text>
                                                <Text className="text-[11px] font-bold text-black uppercase">{leaderName}</Text>
                                            </View>
                                            <View className="flex-row justify-between">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase">COLLEGE</Text>
                                                <Text className="text-[11px] font-medium text-black uppercase" numberOfLines={1}>{college}</Text>
                                            </View>
                                        </View>

                                        <Text className="text-[10px] font-black tracking-[0.2em] mb-4 text-gray-400 uppercase">EVENTS BREAKDOWN</Text>

                                        <View className="gap-3 mb-6">
                                            {selectedEvents.map((id) => {
                                                const event = AVAILABLE_EVENTS.find(e => e.id === id);
                                                return (
                                                    <View key={id} className="flex-row justify-between items-center pb-2 border-b-[1px] border-gray-100">
                                                        <View className="flex-1">
                                                            <Text className="text-xs font-bold text-black" style={{ fontFamily: 'Courier New' }}>{event?.name}</Text>
                                                            <Text className="text-[9px] text-gray-400 uppercase tracking-tighter">Registration Fee</Text>
                                                        </View>
                                                        <Text className="text-sm font-black text-black">₹{event?.price}</Text>
                                                    </View>
                                                );
                                            })}
                                        </View>

                                        {/* Tear Line divider */}
                                        <View className="flex-row items-center gap-2 mb-6">
                                            <View className="h-[1px] bg-black flex-1 opacity-10" />
                                            <View className="w-2 h-2 rounded-full border border-black opacity-20" />
                                            <View className="h-[1px] bg-black flex-1 opacity-10" />
                                        </View>

                                        <View className="flex-row justify-between items-center bg-purple-50 p-4 rounded-[20px] border-[2px] border-black">
                                            <View>
                                                <Text className="text-[10px] font-black uppercase text-purple-900">Final Total</Text>
                                                <Text className="text-[8px] text-purple-500 uppercase">Incl. all taxes</Text>
                                            </View>
                                            <Text className="text-3xl font-black text-black">₹{totalPrice}</Text>
                                        </View>

                                        <View className="mt-4 opacity-30 items-center">
                                            <View className="w-full h-10 flex-row gap-[3px] justify-center overflow-hidden">
                                                {Array.from({ length: 30 }).map((_, i) => (
                                                    <View key={i} style={{ width: i % 3 === 0 ? 3 : 1 }} className="bg-black h-full" />
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Animated.View>
                        )}

                        <View className="mt-6">
                            <SmoothButton
                                onPress={handleNext}
                                containerStyle={{ width: '100%' }}
                                buttonStyle="bg-black py-4 rounded-[16px] items-center justify-center border-[2px] border-black"
                                shadowStyle="bg-[#A855F7] rounded-[16px] top-1.5 left-1.5"
                                depth={0}
                            >
                                <Text className="text-white text-base uppercase font-black tracking-widest text-center" style={{ fontFamily: FONT_SUB }}>
                                    {currentStep === 1 ? 'NEXT: TEAM INFO →' :
                                        currentStep === 2 ? 'NEXT: REVIEW & PAY →' :
                                            `PAY ₹${totalPrice}`}
                                </Text>
                            </SmoothButton>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* --- TRANSITION SKELETON OVERLAY --- */}
            {isTransitioning && (
                <View
                    className="absolute inset-0 z-[100] bg-[#F5E6FA] p-4"
                    style={StyleSheet.absoluteFill}
                >
                    <SafeAreaView className="flex-1" edges={['top']}>
                        {/* Skeleton Header */}
                        <View className="mb-6 mt-4">
                            <View className="h-14 w-56 bg-black/10 rounded-xl mb-3 overflow-hidden">
                                <SkeletonPulse />
                            </View>
                            <View className="h-4 w-40 bg-black/5 rounded-md overflow-hidden">
                                <SkeletonPulse />
                            </View>
                        </View>

                        {/* Skeleton Card (Profile Info) - Matches ProfileScreen layout */}
                        <View className="bg-white rounded-[30px] border-[3px] border-black/10 p-6 mb-6 overflow-hidden">
                            <View className="items-center mb-8">
                                <View className="w-24 h-24 rounded-full bg-black/5 overflow-hidden">
                                    <SkeletonPulse />
                                </View>
                            </View>
                            <View className="gap-6">
                                {[1, 2, 3].map(i => (
                                    <View key={i}>
                                        <View className="h-2 w-16 bg-black/10 rounded mb-3 overflow-hidden">
                                            <SkeletonPulse />
                                        </View>
                                        <View className="h-12 w-full bg-black/5 rounded-xl border border-black/5 overflow-hidden">
                                            <SkeletonPulse />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Skeleton Footer (Logout/Actions) */}
                        <View className="h-14 w-full bg-black/5 rounded-2xl overflow-hidden mt-auto mb-4">
                            <SkeletonPulse />
                        </View>
                    </SafeAreaView>
                </View>
            )}
        </SafeAreaView>
    );
};

// Helper for Pulse Effect
const SkeletonPulse = () => {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return <Animated.View style={[style, { flex: 1, backgroundColor: 'black' }]} />;
};

const InputGroup = ({ label, value, onChange, placeholder, keyboardType = 'default' }: any) => {
    return (
        <View>
            <Text className="text-[10px] font-bold text-black uppercase tracking-widest mb-1.5 ml-1" style={{ fontFamily: 'Softura' }}>
                {label}
            </Text>
            <View className="relative">
                <View className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-black rounded-xl" />
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    className="bg-white border-[2px] border-black rounded-xl px-4 py-2.5 text-sm text-gray-900 font-bold"
                    style={{ fontFamily: 'Gilton' }}
                />
            </View>
        </View>
    );
};

const EventSelectionCard = ({ event, selected, onToggle }: { event: any, selected: boolean, onToggle: () => void }) => {
    return (
        <Pressable onPress={onToggle} className="mb-2">
            <View className="relative">
                <View className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-black rounded-xl" />
                <View className={`border-[2px] border-black rounded-xl p-3 flex-row items-center justify-between ${selected ? 'bg-[#F0FDF4]' : 'bg-white'}`}>
                    <View className="flex-row items-center flex-1 gap-3">
                        <View className={`w-6 h-6 rounded border-[2px] border-black items-center justify-center ${selected ? 'bg-black' : 'bg-white'}`}>
                            {selected && <Check color="white" size={14} strokeWidth={4} />}
                        </View>
                        <View>
                            <Text className="text-sm font-bold uppercase text-black leading-4 mb-0.5" style={{ fontFamily: 'Softura' }}>
                                {event.name}
                            </Text>
                            <Text className="text-[10px] text-black/60" style={{ fontFamily: 'Gilton' }}>
                                {event.teamSize}
                            </Text>
                        </View>
                    </View>
                    <View className="border-[1.5px] border-black px-1.5 py-0.5 rounded bg-white shadow-sm">
                        <Text className="font-bold text-[10px]" style={{ fontFamily: 'Softura' }}>₹{event.price}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

export default EventRegistrationScreen;
