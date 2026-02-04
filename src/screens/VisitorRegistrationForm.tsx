import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    Modal,
    ScrollView,
    Dimensions,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    FadeInUp,
    FadeInDown,
    FadeIn,
    ZoomIn,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing,
    LinearTransition,
} from 'react-native-reanimated';
import { ChevronDown, Check, AlertCircle, X } from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import { useAuth } from '../context/AuthContext';

const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton';

// Helper Components
const ShadowInput = ({ label, placeholder, value, onChangeText, subtext, editable = true, keyboardType = 'default' }: any) => (
    <View className="mb-5">
        <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
            {label} <Text className="text-red-500">*</Text>
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
                keyboardType={keyboardType}
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

interface VisitorRegistrationFormProps {
    onBack: () => void;
}

export default function VisitorRegistrationForm({ onBack }: VisitorRegistrationFormProps) {
    const navigation = useNavigation<any>();
    const { user } = useAuth();

    const [step, setStep] = useState(0); // 0: Details, 1: Payment Summary
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    // Dropdown State
    const [isPassDropdownOpen, setIsPassDropdownOpen] = useState(false);

    // Form Data (Schema-compliant fields only)
    const [bookingId, setBookingId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [college, setCollege] = useState('');
    const [passType, setPassType] = useState('day1'); // Schema values: "day1", "day2", "dual", "full"

    // Pre-fill from user context
    useEffect(() => {
        if (user) {
            if (user.name) {
                const names = user.name.split(' ');
                setFirstName(names[0] || '');
                setLastName(names.slice(1).join(' ') || '');
            }
            if (user.email) setEmail(user.email);
            if (user.mobileNo) setPhone(user.mobileNo);
            if (user.collegeName) setCollege(user.collegeName);
            if (user.bookingId) setBookingId(user.bookingId);
        }
    }, [user]);

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
        onBack(); // Return to payments menu
    };

    // --- Timer Logic ---
    const [timer, setTimer] = useState(872); // 14:32

    useEffect(() => {
        if (step === 1 && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        showAlert("Session Expired", "Your payment session has expired. Please start again.", 'error');
                        setStep(0);
                        return 872;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Progress Animation
    const progressWidth = useSharedValue(0.5);
    const liquidAnim = useSharedValue(0);

    useEffect(() => {
        const target = step === 0 ? 0.5 : 1.0;
        progressWidth.value = withTiming(target, {
            duration: 500,
            easing: Easing.out(Easing.quad)
        });
    }, [step]);

    useEffect(() => {
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

    // Validation
    const validateForm = () => {
        if (!bookingId.trim()) { showAlert("Missing Detail", "Booking ID is required to proceed."); return false; }
        if (!firstName.trim()) { showAlert("Missing Detail", "Please enter your First Name."); return false; }
        if (!lastName.trim()) { showAlert("Missing Detail", "Please enter your Last Name."); return false; }
        if (!email.trim()) { showAlert("Missing Detail", "Please enter your Email."); return false; }
        if (!phone.trim()) { showAlert("Missing Detail", "Please enter your Phone Number."); return false; }
        if (!college.trim()) { showAlert("Missing Detail", "Please enter your College Name."); return false; }
        if (!acceptedTerms) { showAlert("Terms Required", "Please accept the terms and conditions."); return false; }
        return true;
    };

    // Payment Integration
    const handlePayment = async () => {
        setIsPaymentLoading(true);
        const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_S8rSjrgYttq3i7';

        const amount = passType === 'dual' ? 89 : 49;
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
            theme: { color: '#9C27B0' }
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
                userId: user?.id || null
            });

            // Prepare Receipt Data
            const receipt = {
                paymentId: paymentId,
                orderId: orderId,
                amount: amount,
                date: new Date().toLocaleString(),
                visitorName: `${firstName} ${lastName}`,
                syncError: !!error
            };

            setReceiptData(receipt);
            setShowReceipt(true);
            setIsPaymentLoading(false);

            if (error) {
                console.error("Supabase Error (Payment was success):", error);
            }

        } catch (err: any) {
            console.error("Save Error:", err);
            setReceiptData({
                paymentId: paymentId,
                amount: passType === 'dual' ? 89 : 49,
                date: new Date().toLocaleString(),
                visitorName: `${firstName} ${lastName}`,
                syncError: true
            });
            setShowReceipt(true);
            setIsPaymentLoading(false);
        }
    };

    const handleContinue = async () => {
        if (step === 0) {
            if (validateForm()) {
                setStep(1);
                progressWidth.value = withTiming(1.0, { duration: 500 });
            }
        } else {
            // Step 1: Open Payment Gateway
            await handlePayment();
        }
    };

    const handleBackPress = () => {
        if (step === 0) {
            onBack();
        } else {
            setStep(0);
            setTimer(872); // Reset timer
        }
    };

    return (
        <>
            <Animated.View
                entering={ZoomIn.duration(400)}
                className="w-full bg-white border-[3px] border-black rounded-[30px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="px-6 py-8">
                        {/* Return Button */}
                        <View className="mb-6">
                            <SmoothButton
                                onPress={handleBackPress}
                                buttonStyle="bg-[#FFEB3B] border-[2.5px] border-black rounded-xl py-3 px-5"
                                shadowStyle="bg-black rounded-xl"
                                depth={5}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Text className="text-[17px] mr-2" style={{ fontFamily: FONT_BOLD }}>←</Text>
                                    <Text className="text-[12px] uppercase" style={{ fontFamily: FONT_BOLD }}>{step === 0 ? 'Back' : 'Previous'}</Text>
                                </View>
                            </SmoothButton>
                        </View>

                        {/* Title Section */}
                        <View className="mb-8">
                            <Text className="text-4xl text-black leading-none" style={{ fontFamily: 'Bicubik' }}>VISITOR</Text>
                            <Text className="text-4xl text-[#9C27B0] leading-[38px]" style={{ fontFamily: 'Bicubik' }}>REGISTRATION.</Text>
                        </View>

                        {/* Progress Bar */}
                        <View className="mb-8">
                            <View className="w-full h-5 bg-white border-[2.5px] border-black rounded-full overflow-hidden flex-row">
                                <Animated.View
                                    style={[
                                        progressBarStyle,
                                        {
                                            height: '100%',
                                            backgroundColor: '#9C27B0',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }
                                    ]}
                                >
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
                            <View className="flex-row justify-between mt-3 px-1">
                                {['DETAILS', 'PAYMENT'].map((label, i) => (
                                    <Text
                                        key={label}
                                        className={`text-[11px] uppercase ${step >= i ? 'text-black font-bold' : 'text-gray-300'}`}
                                        style={{ fontFamily: 'Gilton' }}
                                    >
                                        {label}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        {/* Step 0: Details Form */}
                        {step === 0 && (
                            <Animated.View entering={FadeInDown.duration(400)} layout={LinearTransition.duration(400)}>
                                {/* Info Box */}
                                <View className="relative mb-8">
                                    <View style={{ position: 'absolute', top: 5, left: 5, width: '100%', height: '100%', backgroundColor: 'black', borderRadius: 20 }} />
                                    <View className="bg-[#D1E9FF] border-[2.5px] border-black rounded-[20px] p-5 flex-row items-center">
                                        <Text className="text-lg mr-3">📣</Text>
                                        <Text className="text-[13px] uppercase leading-4 flex-1" style={{ fontFamily: 'Gilton' }}>
                                            ALL FIELDS ARE REQUIRED. BOOKING ID IS MANDATORY.
                                        </Text>
                                    </View>
                                </View>

                                <ShadowInput
                                    label="YOUR BOOKING ID"
                                    placeholder="SGF26-XXXXXXXX"
                                    value={bookingId}
                                    onChangeText={setBookingId}
                                    subtext={
                                        <Text style={{ fontFamily: FONT_MAIN, fontSize: 10, color: '#6b7280', lineHeight: 14 }}>
                                            Find it in <Text onPress={() => navigation.navigate('Main', { screen: 'Profile' })} style={{ fontFamily: FONT_BOLD, color: '#3B82F6', textDecorationLine: 'underline' }}>Profile</Text>. Sign in first if you don't have one.
                                        </Text>
                                    }
                                />

                                {/* PASS SELECTOR */}
                                <View className="mb-5">
                                    <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
                                        SELECT PASS <Text className="text-red-500">*</Text>
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

                                <ShadowInput label="EMAIL ADDRESS" placeholder="signifiya@gmail.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
                                <ShadowInput label="PHONE NUMBER" placeholder="9883511660" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
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

                        {/* Step 1: Payment Summary */}
                        {step === 1 && (
                            <Animated.View entering={FadeInDown.duration(600)} layout={LinearTransition.duration(400)}>
                                {/* Step Header */}
                                <View className="relative mb-6">
                                    <View style={{ position: 'absolute', top: 6, left: 6, width: '100%', height: '100%', backgroundColor: 'black', borderRadius: 20 }} />
                                    <View className="bg-[#FFE4E1] border-[3px] border-black rounded-[20px] px-5 py-3 flex-row items-center justify-between">
                                        <Text className="text-sm uppercase font-bold tracking-tight" style={{ fontFamily: FONT_BOLD }}>
                                            STEP 2/2: PAYMENT
                                        </Text>
                                        <View className="flex-row items-center">
                                            <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                            <Text className="text-xs uppercase font-bold text-gray-600">Review & Pay</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Payment Card */}
                                <View className="relative mb-6">
                                    <View style={{ position: 'absolute', top: 8, left: 8, width: '100%', height: '100%', backgroundColor: 'black', borderRadius: 28 }} />
                                    <View className="bg-white border-[3px] border-black rounded-[28px] overflow-hidden">
                                        {/* Black Header with Timer */}
                                        <View className="bg-black px-6 py-4 flex-row items-center justify-between">
                                            <Text className="text-white text-sm uppercase font-bold tracking-wide" style={{ fontFamily: FONT_BOLD }}>
                                                Payment Summary
                                            </Text>
                                            <View className="bg-red-500 px-4 py-1.5 rounded-full">
                                                <Text className="text-white text-xs font-bold">EXPIRES IN {formatTime(timer)}</Text>
                                            </View>
                                        </View>

                                        {/* White Body */}
                                        <View className="px-6 py-6 bg-white">
                                            {/* Visitor Details with Gray Box */}
                                            <View className="bg-gray-50 rounded-2xl px-5 py-4 border-2 border-gray-200 mb-6">
                                                <View className="flex-row justify-between items-center mb-3">
                                                    <Text className="text-xs uppercase text-gray-400 font-bold">Visitor Name</Text>
                                                    <Text className="text-sm font-black text-black">{firstName} {lastName}</Text>
                                                </View>
                                                <View className="h-[1px] bg-gray-300 mb-3" />
                                                <View className="flex-row justify-between items-center mb-3">
                                                    <Text className="text-xs uppercase text-gray-400 font-bold">College</Text>
                                                    <Text className="text-sm font-black text-black">{college}</Text>
                                                </View>
                                                <View className="h-[1px] bg-gray-300 mb-3" />
                                                <View className="flex-row justify-between items-center">
                                                    <Text className="text-xs uppercase text-gray-400 font-bold">Pass Type</Text>
                                                    <Text className="text-sm font-black text-black">
                                                        {passType === 'day1' ? 'Single Day Pass' : 'Dual Day Pass'}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Total Section */}
                                            <View className="relative">
                                                <View style={{ position: 'absolute', top: 4, left: 4, width: '100%', height: '100%', backgroundColor: 'black', borderRadius: 20 }} />
                                                <View className="bg-purple-50 border-[3px] border-black rounded-[20px] px-5 py-4">
                                                    <View className="flex-row items-baseline justify-between">
                                                        <View>
                                                            <Text className="text-sm uppercase text-[#9C27B0] font-black">Final Total</Text>
                                                            <Text className="text-[10px] uppercase text-purple-400 font-bold">Incl. All Taxes</Text>
                                                        </View>
                                                        <Text className="text-5xl font-black text-black" style={{ fontFamily: 'Bicubik' }}>
                                                            ₹{passType === 'dual' ? '89' : '49'}
                                                        </Text>
                                                    </View>
                                                </View>
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
                                buttonStyle={`${step === 0 ? 'bg-black' : 'bg-[#9C27B0]'} rounded-[24px] py-5 items-center justify-center border-[2.5px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
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
                </ScrollView>
            </Animated.View >

            {/* Alert Modal */}
            < Modal
                visible={alertConfig.visible}
                transparent
                animationType="fade"
                onRequestClose={hideAlert}
            >
                <View className="flex-1 bg-black/50 items-center justify-center p-6">
                    <Animated.View entering={FadeIn} className="bg-white rounded-3xl border-[3px] border-black w-full max-w-sm overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <View className={`p-6 ${alertConfig.type === 'error' ? 'bg-red-100' : alertConfig.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center">
                                    <AlertCircle color={alertConfig.type === 'error' ? '#DC2626' : '#059669'} size={24} />
                                    <Text className="text-xl font-bold ml-3" style={{ fontFamily: FONT_BOLD }}>{alertConfig.title}</Text>
                                </View>
                                <TouchableOpacity onPress={hideAlert}>
                                    <X color="black" size={24} />
                                </TouchableOpacity>
                            </View>
                            <Text className="text-sm text-gray-800 leading-5" style={{ fontFamily: FONT_MAIN }}>{alertConfig.message}</Text>
                        </View>
                        <View className="p-4">
                            <SmoothButton
                                onPress={hideAlert}
                                buttonStyle="bg-black rounded-xl py-3"
                                shadowStyle="bg-black rounded-xl"
                                depth={4}
                            >
                                <Text className="text-white text-center uppercase font-bold" style={{ fontFamily: FONT_BOLD }}>Got It</Text>
                            </SmoothButton>
                        </View>
                    </Animated.View>
                </View>
            </Modal >

            {/* Receipt Modal */}
            < Modal
                visible={showReceipt}
                transparent
                animationType="fade"
                onRequestClose={handleCloseReceipt}
            >
                <View className="flex-1 bg-black/70 items-center justify-center p-6">
                    <Animated.View entering={ZoomIn.springify()} className="bg-white rounded-3xl border-[3px] border-black w-full max-w-sm overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                        {/* Header */}
                        <View className={`${receiptData?.syncError ? 'bg-orange-500' : 'bg-green-500'} p-6 items-center border-b-[3px] border-black`}>
                            <View className="w-16 h-16 bg-white rounded-full items-center justify-center border-[3px] border-black mb-3">
                                {receiptData?.syncError ? (
                                    <AlertCircle color="#F97316" size={32} />
                                ) : (
                                    <Check color="#22C55E" size={36} strokeWidth={4} />
                                )}
                            </View>
                            <Text className="text-2xl font-black text-white uppercase" style={{ fontFamily: 'Bicubik' }}>
                                {receiptData?.syncError ? 'Warning!' : 'Success!'}
                            </Text>
                        </View>

                        {/* Receipt Details */}
                        <View className="p-6">
                            {receiptData?.syncError && (
                                <View className="bg-orange-100 border-2 border-orange-500 rounded-xl p-4 mb-4">
                                    <Text className="text-xs font-bold text-orange-800 uppercase mb-1">⚠️ Sync Issue</Text>
                                    <Text className="text-xs text-orange-700">Payment successful but data not saved. Screenshot this receipt and contact support.</Text>
                                </View>
                            )}

                            <Text className="text-xs uppercase text-gray-500 mb-4 font-bold">Payment Receipt</Text>

                            <View className="space-y-3">
                                <View className="flex-row justify-between py-2 border-b border-gray-200">
                                    <Text className="text-xs text-gray-500">Payment ID</Text>
                                    <Text className="text-xs font-bold text-black">{receiptData?.paymentId}</Text>
                                </View>
                                <View className="flex-row justify-between py-2 border-b border-gray-200">
                                    <Text className="text-xs text-gray-500">Visitor Name</Text>
                                    <Text className="text-xs font-bold text-black">{receiptData?.visitorName}</Text>
                                </View>
                                <View className="flex-row justify-between py-2 border-b border-gray-200">
                                    <Text className="text-xs text-gray-500">Amount Paid</Text>
                                    <Text className="text-xs font-bold text-green-600">₹{receiptData?.amount}</Text>
                                </View>
                                <View className="flex-row justify-between py-2">
                                    <Text className="text-xs text-gray-500">Date</Text>
                                    <Text className="text-xs font-bold text-black">{receiptData?.date}</Text>
                                </View>
                            </View>

                            <View className="mt-8">
                                <SmoothButton
                                    onPress={handleCloseReceipt}
                                    buttonStyle="bg-black rounded-xl py-4"
                                    shadowStyle="bg-black rounded-xl"
                                    depth={5}
                                >
                                    <Text className="text-white text-center uppercase font-bold tracking-wider" style={{ fontFamily: FONT_BOLD }}>Done</Text>
                                </SmoothButton>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Modal >
        </>
    );
}
