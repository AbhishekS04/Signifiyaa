import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    StyleSheet,
    Alert,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    FadeInUp,
    FadeInDown,
    FadeIn, // Added FadeIn
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSpring,
    Easing,
    LinearTransition,
    CurvedTransition,
} from 'react-native-reanimated';
import { ChevronDown, Check, AlertCircle, X } from 'lucide-react-native';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import SmoothButton from '../components/ui/SmoothButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Font Configuration
const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton'; // Using Inter for actual bold weights

// --- Helper Components ---

const ShadowInput = ({ label, placeholder, value, onChangeText, subtext, editable = true }: any) => (
    <View className="mb-5">
        <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
            {label}
        </Text>
        <View style={{ position: 'relative' }}>
            <View
                style={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    right: -4,
                    bottom: -4,
                    backgroundColor: 'black',
                    borderRadius: 12,
                    zIndex: -1,
                }}
            />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                editable={editable}
                className="w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-white"
                style={{ fontFamily: FONT_MAIN, color: 'black' }}
            />
        </View>
        {subtext && (
            <View className="mt-3 pl-1">
                {subtext}
            </View>
        )}
    </View>
);

// --- Main Screen ---

export default function VisitorRegistrationScreen() {
    const navigation = useNavigation<any>();
    const [step, setStep] = useState(0); // 0: Details, 1: Payment Summary
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Dropdown State
    const [isPassDropdownOpen, setIsPassDropdownOpen] = useState(false);

    // Form Data
    const [bookingId, setBookingId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [college, setCollege] = useState('');
    const [passType, setPassType] = useState('day1'); // Schema values: "day1", "day2", "dual", "full"

    // UI State
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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

    const handleCloseReceipt = () => {
        setShowReceipt(false);
        // Navigate to Profile after success
        navigation.navigate('Main', { screen: 'Profile' });
    };

    // Validation
    const validateForm = () => {
        // STRICT: Booking ID is mandatory
        if (!bookingId.trim()) { showAlert("Missing Detail", "Booking ID is required to proceed."); return false; }
        if (!firstName.trim()) { showAlert("Missing Detail", "Please enter your First Name."); return false; }
        if (!lastName.trim()) { showAlert("Missing Detail", "Please enter your Last Name."); return false; }
        if (!email.trim()) { showAlert("Missing Detail", "Please enter your Email."); return false; }
        if (!phone.trim()) { showAlert("Missing Detail", "Please enter your Phone Number."); return false; }
        if (!college.trim()) { showAlert("Missing Detail", "Please enter your College Name."); return false; }
        if (!acceptedTerms) { showAlert("Terms Required", "Please accept the terms and conditions."); return false; }
        return true;
    };

    // Progress Animation
    const progressWidth = useSharedValue(0.33);
    const liquidAnim = useSharedValue(0);

    // --- Timer Logic ---
    const [timer, setTimer] = useState(872); // 14:32

    useEffect(() => {
        if (step === 1) {
            const interval = setInterval(() => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step]);

    useEffect(() => {
        if (timer === 0 && step === 1) {
            showAlert(
                "SESSION EXPIRED",
                "Your registration session has timed out.",
                'error'
            );
            setStep(0);
            setTimer(872);
        }
    }, [timer, step]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        const target = step === 0 ? 0.5 : 1.0;
        progressWidth.value = withTiming(target, {
            duration: 500,
            easing: Easing.out(Easing.quad)
        });
    }, [step]);

    useEffect(() => {
        // Continuous smooth rolling animation for the liquid inside
        liquidAnim.value = withRepeat(
            withTiming(40, { duration: 1500, easing: Easing.linear }),
            -1,
            false
        );
        return () => {
            liquidAnim.value = 0;
        };
    }, []);

    const progressBarStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value * 100}%`,
    }));

    const liquidStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: liquidAnim.value }],
    }));

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
            if (step === 0) {
                return;
            }
            if (showReceipt) {
                // If receipt is open, going back should go to profile/home
                return;
            }

            e.preventDefault();
            setStep(step - 1);
        });

        return unsubscribe;
    }, [navigation, step, showReceipt]);

    const handlePayment = async () => {
        setIsPaymentLoading(true);
        const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_S8rSjrgYttq3i7';

        const amount = passType.includes('89') ? 89 : 49;
        const amountInPaise = amount * 100;

        const options = {
            description: 'Visitor Pass',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: amountInPaise,
            name: 'Signifiya 2026',
            prefill: {
                email: email,
                contact: phone,
                name: `${firstName} ${lastName}`.trim()
            },
            theme: { color: '#000000' }
        };

        try {
            console.log('🚀 Opening Razorpay Checkout...');
            const data = await RazorpayCheckout.open(options);
            console.log('✅ Payment Success:', data);

            // Payment Successful -> Save Data
            await saveRegistrationObj(data.razorpay_payment_id, data.razorpay_order_id);

        } catch (error: any) {
            console.error('❌ Payment Error:', error);
            setIsPaymentLoading(false);
            if (error.code !== 0 && error.code !== 'PAYMENT_CANCELLED') {
                showAlert("Payment Failed", error.description || "Something went wrong during payment.", 'error');
            }
        }
    };

    const saveRegistrationObj = async (paymentId: string, orderId?: string) => {
        try {
            // Calculate amount based on passType
            const amount = passType === 'dual' ? 89 : 49;

            // Save to Supabase with ONLY schema-defined fields
            const { error } = await supabase.from('visitor_registration').insert({
                name: `${firstName} ${lastName}`.trim(),
                email: email,
                phone: phone,
                college: college,
                passType: passType, // "day1" | "day2" | "dual" | "full"
                amount: amount,
                status: 'verified',
                paymentProofUrl: paymentId,
                bookingId: null, // Legacy field, not used
                userBookingId: bookingId, // User's booking ID from profile
                userId: null // Will be set if implementing user context
            });

            // Prepare Receipt Data regardless of DB sync error (Payment is confirmed!)
            const receipt = {
                paymentId: paymentId,
                orderId: orderId,
                amount: amount,
                date: new Date().toLocaleString(),
                syncError: !!error // Flag to show warning if DB save failed
            };

            setReceiptData(receipt);
            setShowReceipt(true);
            setIsPaymentLoading(false);

            if (error) {
                console.error("Supabase Error (Payment was success):", error);
                // We do NOT show an alert here to avoid hiding the receipt. 
                // The Receipt Modal will handle the "Sync Error" warning.
            }

        } catch (err: any) {
            console.error("Save Error:", err);
            // Even if an exception occurs, show receipt with error flag
            setReceiptData({
                paymentId: paymentId,
                amount: passType.includes('89') ? 89 : 49,
                date: new Date().toLocaleString(),
                syncError: true
            });
            setShowReceipt(true);
            setIsPaymentLoading(false);
        }
    };

    const handleContinue = async () => {
        if (step === 0) {
            // STEP 0: VALIDATION & MOVE TO PAYMENT
            if (validateForm()) {
                setStep(1);
            }
        } else if (step === 1) {
            // STEP 1: STRICT PAYMENT TRIGGER
            handlePayment();
        }
    };

    const handleReturnHome = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }} edges={['top', 'left', 'right', 'bottom']}>

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
                        <View className="absolute top-2 left-2 right-[-8px] bottom-[-8px] bg-white/20 rounded-[24px]" />
                        <View className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-black rounded-[24px]" />

                        <View className="bg-white border-[3px] border-black rounded-[24px] p-6 items-center">
                            <View className={`p-4 rounded-full border-[2px] border-black mb-4 ${alertConfig.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                {alertConfig.type === 'success' ? <Check color="black" size={32} /> : <AlertCircle color="black" size={32} strokeWidth={2.5} />}
                            </View>

                            <Text className="text-xl font-black uppercase text-center mb-2" style={{ fontFamily: 'Bicubik' }}>
                                {alertConfig.title}
                            </Text>

                            <Text className="text-center text-black/70 font-medium mb-6 leading-5" style={{ fontFamily: FONT_MAIN }}>
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
                onRequestClose={() => { }}
            >
                <View className="flex-1 bg-black/90 items-center justify-center px-4">
                    <Animated.View entering={FadeInDown.delay(200).springify()} className="w-full max-w-sm bg-white rounded-[20px] overflow-hidden">
                        {/* Receipt Header */}
                        <View className={`${receiptData?.syncError ? 'bg-orange-500' : 'bg-green-500'} p-6 items-center`}>
                            <View className="bg-white p-3 rounded-full mb-3 shadow-lg">
                                {receiptData?.syncError ? <AlertCircle color="orange" size={32} strokeWidth={3} /> : <Check color="green" size={32} strokeWidth={4} />}
                            </View>
                            <Text className="text-white text-xl font-black uppercase tracking-widest text-center" style={{ fontFamily: 'Bicubik' }}>
                                {receiptData?.syncError ? 'Payment Success' : 'Payment Successful'}
                            </Text>
                            <Text className="text-white/90 text-[10px] font-bold uppercase tracking-widest mt-1 text-center">
                                {receiptData?.syncError ? 'BUT SYNC FAILED - SAVE RECEIPT' : 'Visitor Registration Confirmed'}
                            </Text>
                        </View>

                        {/* ZigZag / Tear Line Visual */}
                        <View className={`${receiptData?.syncError ? 'bg-orange-500' : 'bg-green-500'} h-4 relative z-10`}>
                            <View className="absolute -bottom-2 w-full flex-row ml-[-5px]">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <View key={i} className="w-4 h-4 bg-white transform rotate-45 ml-1.5" />
                                ))}
                            </View>
                        </View>

                        {/* Receipt Details */}
                        <View className="p-6 pt-8 bg-white gap-4">
                            {receiptData?.syncError && (
                                <View className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-2">
                                    <Text className="text-orange-800 text-[10px] font-bold text-center">
                                        Server sync failed. Please screenshot this screen and contact support with Payment ID.
                                    </Text>
                                </View>
                            )}

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
                                    <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Visitor</Text>
                                    <Text className="text-xs font-bold text-black uppercase" style={{ fontFamily: FONT_BOLD }}>{firstName} {lastName}</Text>
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

            <ScrollView
                style={{ flex: 1, backgroundColor: 'transparent' }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 20 : 40, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                bounces={true}
                scrollEventThrottle={16}
                nestedScrollEnabled={true}
            >
                {/* Visitor Registration Card */}
                <Animated.View
                    entering={FadeInUp.duration(500).easing(Easing.out(Easing.cubic))}
                    className="w-full bg-white border-[3px] border-black rounded-[30px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                >
                    <View className="px-6 py-8">
                        {/* Return Home Button (3D Effect) */}
                        <View className="mb-8">
                            <SmoothButton
                                onPress={handleReturnHome}
                                buttonStyle="bg-[#FFEB3B] border-[2.5px] border-black rounded-xl py-3 px-5"
                                shadowStyle="bg-black rounded-xl"
                                depth={5}
                                containerStyle={{ width: 170 }}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Text className="text-[17px] font-black mr-4" style={{ fontFamily: FONT_BOLD }}>←</Text>
                                    <Text className="text-[12px] uppercase" style={{ fontFamily: FONT_BOLD }}>PREVIOUS</Text>
                                </View>
                            </SmoothButton>
                        </View>

                        {/* Title Section */}
                        <View className="mb-8">
                            <Text className="text-4xl text-black leading-none" style={{ fontFamily: 'Bicubik' }}>VISITOR</Text>
                            <Text className="text-4xl text-[#9C27B0] leading-[38px]" style={{ fontFamily: 'Bicubik' }}>REGISTRATION.</Text>
                        </View>

                        {/* Liquid Progress Bar */}
                        <View className="mb-8">
                            <View className="w-full h-5 bg-white border-[2.5px] border-black rounded-full overflow-hidden flex-row">
                                <Animated.View
                                    style={[
                                        progressBarStyle,
                                        {
                                            height: '100%',
                                            backgroundColor: '#1a1a1a',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }
                                    ]}
                                >
                                    {/* Rolling Liquid Patterns */}
                                    <Animated.View
                                        style={[
                                            liquidStyle,
                                            {
                                                flexDirection: 'row',
                                                height: '100%',
                                                opacity: 0.3
                                            }
                                        ]}
                                    >
                                        {[...Array(40)].map((_, i) => (
                                            <View
                                                key={i}
                                                style={{
                                                    width: 12,
                                                    height: '100%',
                                                    backgroundColor: 'white',
                                                    marginRight: 10,
                                                    transform: [{ skewX: '-25deg' }]
                                                }}
                                            />
                                        ))}
                                    </Animated.View>
                                </Animated.View>
                            </View>
                            <View className="flex-row justify-between mt-3 px-1" >
                                {['DETAILS', 'PAYMENT'].map((label, i) => (
                                    <Text
                                        key={label}
                                        className={`text-[11px] uppercase ${step >= i ? 'text-black' : 'text-gray-300'}`}
                                        style={{ fontFamily: 'Gilton' }}
                                    >
                                        {label}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        {/* Message Box */}
                        <Animated.View layout={LinearTransition.duration(400)} className="relative mb-8">
                            <View style={{ position: 'absolute', top: 5, left: 5, width: '100%', height: '100%', backgroundColor: 'black', borderRadius: 20 }} />
                            <View className="bg-[#D1E9FF] border-[2.5px] border-black rounded-[20px] p-5 flex-row items-center">
                                <Text className="text-lg mr-3">📣</Text>
                                <Text className="text-[13px] uppercase leading-4  flex-1" style={{ fontFamily: 'Gilton' }}>
                                    HEY THERE! FILL IN YOUR DETAILS TO GET STARTED.
                                </Text>
                            </View>
                        </Animated.View>

                        {/* Form Section */}
                        {step === 0 && (
                            <Animated.View entering={FadeInDown.duration(400)} layout={LinearTransition.duration(400)}>
                                <ShadowInput
                                    label="YOUR BOOKING ID"
                                    placeholder="SGF26-XXXXXXXX"
                                    value={bookingId}
                                    onChangeText={setBookingId}
                                    subtext={
                                        <Text style={{ fontFamily: FONT_MAIN, fontSize: 10, color: '#6b7280', lineHeight: 14 }}>
                                            Find it in <Text onPress={() => navigation.navigate('Main', { screen: 'Profile' })} style={{ fontFamily: FONT_BOLD, color: '#3B82F6', textDecorationLine: 'underline' }}>Profile</Text>. Sign in and visit Profile first if you don't have one.
                                        </Text>
                                    }
                                />

                                {/* PASS SELECTOR */}
                                <View className="mb-5">
                                    <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                        SELECT PASS
                                    </Text>
                                    <Animated.View layout={LinearTransition.duration(400)} style={{ position: 'relative' }}>
                                        <View style={{ position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: 'black', borderRadius: 12, zIndex: -1 }} />
                                        <View className="overflow-hidden bg-white border-[2.5px] border-black rounded-xl">
                                            <TouchableOpacity
                                                onPress={() => setIsPassDropdownOpen(!isPassDropdownOpen)}
                                                className="w-full px-4 py-3 flex-row justify-between items-center"
                                                activeOpacity={0.8}
                                            >
                                                <Text className="text-[13px]" style={{ fontFamily: 'Gilton' }}>
                                                    {passType === 'day1' ? 'Single Day Pass — ₹49' : 'Dual Day Pass — ₹89'}
                                                </Text>
                                                <ChevronDown
                                                    color="black"
                                                    size={18}
                                                    style={{ transform: [{ rotate: isPassDropdownOpen ? '180deg' : '0deg' }] }}
                                                />
                                            </TouchableOpacity>

                                            {isPassDropdownOpen && (
                                                <View className="border-t-[1.5px] border-black/10 bg-gray-50/50">
                                                    {[
                                                        { label: 'Single Day Pass — ₹49', value: 'day1' },
                                                        { label: 'Dual Day Pass — ₹89', value: 'dual' }
                                                    ].map((option) => (
                                                        <TouchableOpacity
                                                            key={option.value}
                                                            onPress={() => {
                                                                setPassType(option.value);
                                                                setIsPassDropdownOpen(false);
                                                            }}
                                                            className="px-4 py-3 border-b border-black/5"
                                                        >
                                                            <Text className="text-[13px]" style={{ fontFamily: 'Gilton' }}>{option.label}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    </Animated.View>
                                </View>

                                <View className="flex-row gap-4">
                                    <View className="flex-1">
                                        <ShadowInput label="FIRST NAME" placeholder="Abhishek" value={firstName} onChangeText={setFirstName} />
                                    </View>
                                    <View className="flex-1">
                                        <ShadowInput label="LAST NAME" placeholder="Singh" value={lastName} onChangeText={setLastName} />
                                    </View>
                                </View>

                                <ShadowInput label="EMAIL ADDRESS" placeholder="signifiya@gmail.com" value={email} onChangeText={setEmail} />
                                <ShadowInput label="PHONE NUMBER" placeholder="9883511660" value={phone} onChangeText={setPhone} />
                                <ShadowInput label="COLLEGE NAME" placeholder="Adamas University" value={college} onChangeText={setCollege} />

                                {/* Terms Checkbox */}
                                <TouchableOpacity
                                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                                    className="flex-row items-center mt-3 mb-8 bg-gray-50 border-[1.5px] border-dashed border-gray-300 rounded-xl p-4"
                                >
                                    <View className={`w-6 h-6 rounded-full border-2 border-black items-center justify-center mr-3 ${acceptedTerms ? 'bg-black' : 'bg-white'}`}>
                                        {acceptedTerms && <Check color="white" size={14} strokeWidth={4} />}
                                    </View>
                                    <Text className="text-[11px] uppercase font-black tracking-tighter" style={{ fontFamily: FONT_BOLD }}>
                                        I ACCEPT THE TERMS AND CONDITIONS
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {step === 1 && (
                            <Animated.View entering={FadeInDown.duration(600)} layout={LinearTransition.duration(400)} className="gap-5 mb-4">
                                <View className="bg-white border-[2.5px] border-black rounded-[30px] overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                                    {/* Receipt Top Section */}
                                    <View className="bg-black p-4 flex-row justify-between items-center">
                                        <Text className="text-white text-[10px] font-black tracking-widest uppercase">Payment Summary</Text>
                                        <View className="bg-red-600 px-3 py-1 rounded-full">
                                            <Text className="text-white text-[9px] font-bold">EXPIRES IN {formatTime(timer)}</Text>
                                        </View>
                                    </View>

                                    <View className="p-6">
                                        {/* Visitor Info Snippet */}
                                        <View className="mb-6 bg-gray-50 p-4 rounded-[20px] border-[1.5px] border-black/10">
                                            <View className="flex-row justify-between mb-2">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase">VISITOR</Text>
                                                <Text className="text-[11px] font-black text-black uppercase">{`${firstName} ${lastName}`}</Text>
                                            </View>
                                            <View className="flex-row justify-between mb-2">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase">COLLEGE</Text>
                                                <Text className="text-[11px] font-bold text-black uppercase" numberOfLines={1}>{college}</Text>
                                            </View>
                                            <View className="flex-row justify-between">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase">PASS TYPE</Text>
                                                <Text className="text-[11px] font-medium text-black uppercase">
                                                    {passType === 'day1' ? 'Single Day' : 'Dual Day'}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text className="text-[10px] font-black tracking-[0.2em] mb-4 text-gray-400 uppercase">DETAILS</Text>

                                        <View className="gap-3 mb-6">
                                            <View className="flex-row justify-between items-center pb-2 border-b-[1px] border-gray-100">
                                                <View className="flex-1">
                                                    <Text className="text-xs font-bold text-black" style={{ fontFamily: 'Courier New' }}>Visitor Date</Text>
                                                    <Text className="text-[9px] text-gray-400 uppercase tracking-tighter">Event Entry</Text>
                                                </View>
                                                <Text className="text-sm font-black text-black">
                                                    {passType === 'dual' ? '₹89' : '₹49'}
                                                </Text>
                                            </View>
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
                                            <Text className="text-3xl font-black text-black">
                                                {passType === 'dual' ? '₹89.00' : '₹49.00'}
                                            </Text>
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



                        {/* Continue Button */}
                        <View className="mt-8">
                            <SmoothButton
                                onPress={handleContinue}
                                buttonStyle={`${step === 0 ? 'bg-black' : step === 1 ? 'bg-[#9C27B0]' : 'bg-green-600'} rounded-[24px] py-5 items-center justify-center border-[2.5px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
                                shadowStyle="bg-black rounded-[24px]"
                                depth={7}
                                disabled={(step === 0 && !acceptedTerms) || isPaymentLoading}
                            >
                                <Text className="text-white text-[18px] uppercase tracking-widest" style={{ fontFamily: 'Gilton' }}>
                                    {isPaymentLoading ? 'Processing...' : step === 0 ? 'Continue to Payment' : `PAY ₹${passType === 'dual' ? '89' : '49'}`} →
                                </Text>
                            </SmoothButton>
                        </View>
                    </View>
                </Animated.View>
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
