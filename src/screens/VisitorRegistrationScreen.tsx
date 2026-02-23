import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    Modal,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    FadeInDown,
    FadeIn,
    ZoomIn,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    LinearTransition,
} from 'react-native-reanimated';
import { ChevronDown, Check, AlertCircle, X, PartyPopper, Lock, User, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import SmoothButton from '../components/ui/SmoothButton';
import { useAuth } from '../context/AuthContext';
import { calculateDiscountedPrice, getActiveDiscount } from '../lib/pricingUtils';

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton';

// Helper Components
const ShadowInput = ({ label, placeholder, value, onChangeText, subtext, editable = true, keyboardType = 'default', multiline = false, numberOfLines = 1 }: any) => (
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
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                className={`w-full border-[2.5px] border-black rounded-xl px-4 py-3 text-sm bg-white ${multiline ? 'min-h-[80px] pt-3' : ''}`}
                style={{ fontFamily: FONT_MAIN, color: 'black', textAlignVertical: multiline ? 'top' : 'center' }}
            />
        </View>
        {subtext && (
            <View className="mt-3 pl-1">
                {subtext}
            </View>
        )}
    </View>
);

const ShadowDropdown = ({ label, value, options, onSelect, isOpen, setIsOpen }: any) => (
    <View className="mb-5 flex-1">
        <Text className="text-[10px] uppercase mb-1.5 tracking-widest pl-1" style={{ fontFamily: FONT_BOLD, color: 'black' }}>
            {label}
        </Text>
        <View style={{ position: 'relative' }}>
            <View style={{ position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: 'black', borderRadius: 12, zIndex: -1 }} />
            <View className="overflow-hidden bg-white border-[2.5px] border-black rounded-xl">
                <TouchableOpacity
                    onPress={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-3 flex-row justify-between items-center"
                    activeOpacity={0.8}
                >
                    <Text className="text-[13px] uppercase" style={{ fontFamily: 'Gilton' }}>
                        {value || 'SELECT'}
                    </Text>
                    <ChevronDown
                        color="black"
                        size={18}
                        style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                    />
                </TouchableOpacity>

                {isOpen && (
                    <View className="border-t-[1.5px] border-black/10 bg-gray-50/50 max-h-40">
                        <ScrollView nestedScrollEnabled>
                            {options.map((option: any) => (
                                <TouchableOpacity
                                    key={option.value || option}
                                    onPress={() => {
                                        onSelect(option.value || option);
                                        setIsOpen(false);
                                    }}
                                    className="px-4 py-3 border-b border-black/5"
                                >
                                    <Text className="text-[13px] uppercase" style={{ fontFamily: 'Gilton' }}>{option.label || option}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>
        </View>
    </View>
);

export default function VisitorRegistrationScreen() {
    const navigation = useNavigation<any>();
    const { user, isLoading: authLoading } = useAuth();

    const [step, setStep] = useState(0); // 0: Details, 1: Payment, 2: Success
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form Data
    const [bookingId, setBookingId] = useState('');
    const [passType, setPassType] = useState('day1');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [college, setCollege] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('India');
    const [utrId, setUtrId] = useState('');

    // Dropdown States
    const [isPassDropdownOpen, setIsPassDropdownOpen] = useState(false);
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

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

    // Progress Animation
    const progressWidth = useSharedValue(0.33);
    useEffect(() => {
        const target = step === 0 ? 0.33 : step === 1 ? 0.66 : 1.0;
        progressWidth.value = withTiming(target, {
            duration: 500,
            easing: Easing.out(Easing.quad)
        });
    }, [step]);

    const progressBarStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value * 100}%`,
    }));

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

    const validateDetails = () => {
        if (!bookingId.trim()) { showAlert("Missing Detail", "Booking ID is required."); return false; }
        if (!firstName.trim()) { showAlert("Missing Detail", "First Name is required."); return false; }
        if (!lastName.trim()) { showAlert("Missing Detail", "Last Name is required."); return false; }
        if (!email.trim() || !email.includes('@')) { showAlert("Invalid Email", "Please enter a valid email address."); return false; }
        if (!phone.trim() || phone.length < 10) { showAlert("Invalid Phone", "Please enter a valid 10-digit phone number."); return false; }
        if (!college.trim()) { showAlert("Missing Detail", "College Name is required."); return false; }
        if (!address.trim()) { showAlert("Missing Detail", "Address is required."); return false; }
        if (!city.trim()) { showAlert("Missing Detail", "City is required."); return false; }
        if (!state) { showAlert("Missing Detail", "Please select a State."); return false; }
        if (!acceptedTerms) { showAlert("Terms Required", "Please accept the terms and conditions."); return false; }
        return true;
    };

    const handleContinueToPayment = () => {
        if (validateDetails()) {
            setStep(1);
        }
    };

    const handleSubmitPayment = async () => {
        if (!utrId.trim() || utrId.length < 12) {
            showAlert("Invalid UTR", "Please enter a valid 12-digit Transaction/UTR ID.");
            return;
        }

        setIsLoading(true);
        try {
            const baseAmount = passType === 'day1' ? 99 : 149;
            const amount = calculateDiscountedPrice(baseAmount, 'VISITOR');

            const { error } = await supabase.from('visitor_registration').insert({
                id: generateUUID(),
                name: `${firstName} ${lastName}`.trim(),
                email: email,
                phone: phone,
                college: college,
                passType: passType,
                amount: amount,
                status: 'pending',
                paymentProofUrl: utrId,
                bookingId: bookingId, // Legacy field
                userBookingId: bookingId,
                userId: user?.id || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            if (error) {
                console.error("[VisitorReg] Supabase Insert Error:", JSON.stringify(error, null, 2));
                throw new Error(error.message);
            }

            setStep(2);
        } catch (err: any) {
            console.error("Save Error:", err);
            showAlert("Submission Failed", err.message || "Something went wrong while saving your details.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturnHome = () => {
        navigation.navigate('Main', { screen: 'Home' });
    };

    const handleGoToProfile = () => {
        navigation.navigate('Main', { screen: 'Profile' });
    };

    const INDIAN_STATES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
        "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
    ];

    // ── Auth Guard ──
    if (!authLoading && !user) {
        return (
            <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'black' }}>
                <ScrollView
                    style={{ flex: 1, backgroundColor: 'black' }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 20 }}
                >
                    <Animated.View entering={ZoomIn.duration(400)} style={{ paddingTop: 80 }}>
                        {/* Header */}
                        <View style={{ marginBottom: 32 }}>
                            <Text style={{ fontSize: 40, textTransform: 'uppercase', letterSpacing: -1, fontFamily: FONT_BOLD, color: 'black', lineHeight: 44 }}>
                                VISITOR{`\n`}REGISTRATION
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
                                {/* Purple tinted lock circle — matches PaymentsScreen */}
                                <View style={{
                                    backgroundColor: 'rgba(156,39,176,0.1)',
                                    padding: 24, borderRadius: 9999,
                                    borderWidth: 2.5, borderColor: 'black',
                                    marginBottom: 24,
                                }}>
                                    <Lock color="#9C27B0" size={40} strokeWidth={2.5} />
                                </View>
                                <Text style={{ fontSize: 28, textAlign: 'center', marginBottom: 12, fontFamily: FONT_BOLD, color: 'black' }}>
                                    ACCESS RESTRICTED
                                </Text>
                                <Text style={{ fontSize: 13, textAlign: 'center', paddingHorizontal: 16, lineHeight: 20, fontFamily: FONT_MAIN, color: '#6b7280' }}>
                                    Please sign in to your account to manage your passes and registrations.
                                </Text>
                            </View>

                            <SmoothButton
                                onPress={() => navigation.navigate('Auth' as never)}
                                buttonStyle="bg-black border-[2.5px] border-black rounded-[20px] py-5 items-center justify-center"
                                shadowStyle="bg-black rounded-[20px]"
                                depth={6}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <User color="white" size={20} />
                                    <Text style={{ color: 'white', fontSize: 16, textTransform: 'uppercase', letterSpacing: 2, marginLeft: 12, fontFamily: FONT_BOLD }}>
                                        SIGN IN TO CONTINUE
                                    </Text>
                                </View>
                            </SmoothButton>

                            <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 24, textTransform: 'uppercase', letterSpacing: 2, fontFamily: FONT_MAIN, color: '#9ca3af' }}>
                                Signifiya'26 Secure Portal
                            </Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'black' }}>
            <ScrollView
                style={{ flex: 1, backgroundColor: 'black' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}
            >
                <Animated.View
                    entering={FadeInDown.duration(400)}
                    className="w-full bg-white border-[3px] border-black rounded-[35px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                >
                    <View className="px-6 py-8">
                        {/* Header Return Button */}
                        <View className="mb-6">
                            <SmoothButton
                                onPress={handleReturnHome}
                                buttonStyle="bg-[#FFEB3B] border-[2px] border-black rounded-lg py-2 px-4"
                                shadowStyle="bg-black rounded-lg"
                                depth={4}
                            >
                                <Text className="text-[10px] font-black" style={{ fontFamily: FONT_BOLD }}>← RETURN HOME</Text>
                            </SmoothButton>
                        </View>

                        {/* Title Section */}
                        <View className="mb-10">
                            <Text className="text-4xl text-black leading-none" style={{ fontFamily: 'Bicubik' }}>VISITOR</Text>
                            <Text className="text-4xl text-[#9C27B0] leading-[38px]" style={{ fontFamily: 'Bicubik' }}>REGISTRATION.</Text>
                        </View>

                        {/* Progress Bar */}
                        <View className="mb-10">
                            <View className="w-full h-4 bg-white border-[2px] border-black rounded-full overflow-hidden">
                                <Animated.View style={[progressBarStyle, { height: '100%', backgroundColor: 'black' }]}>
                                    <View style={{ flexDirection: 'row', height: '100%', opacity: 0.15 }}>
                                        {[...Array(40)].map((_, i) => (
                                            <View key={i} style={{ width: 6, height: '100%', backgroundColor: 'white', marginRight: 8, transform: [{ skewX: '-25deg' }] }} />
                                        ))}
                                    </View>
                                </Animated.View>
                            </View>
                            <View className="flex-row justify-between mt-2 px-1">
                                {['DETAILS', 'PAYMENT', 'DONE'].map((label, i) => (
                                    <Text key={label} className={`text-[9px] font-black ${step >= i ? 'text-black' : 'text-gray-300'}`} style={{ fontFamily: FONT_BOLD }}>{label}</Text>
                                ))}
                            </View>
                        </View>

                        {step === 0 && (
                            <Animated.View entering={FadeInDown.duration(400)}>
                                <View className="relative mb-8">
                                    <View style={{ position: 'absolute', top: 5, left: 5, width: '100%', height: '100%', backgroundColor: 'black', borderRadius: 20 }} />
                                    <View className="bg-[#D1E9FF] border-[2.5px] border-black rounded-[20px] p-5 flex-row items-center">
                                        <Text className="text-lg mr-3">👋</Text>
                                        <Text className="text-[12px] uppercase leading-4 flex-1 font-black" style={{ fontFamily: 'Gilton' }}>
                                            HEY THERE! FILL IN YOUR DETAILS TO GET STARTED.
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
                                            Find it in <Text onPress={handleGoToProfile} style={{ fontFamily: FONT_BOLD, color: 'black', textDecorationLine: 'underline' }}>Profile</Text>. Sign in first if you don't have one.
                                        </Text>
                                    }
                                />

                                <ShadowDropdown
                                    label="SELECT PASS"
                                    value={passType === 'day1'
                                        ? `Single Day Pass — ₹${calculateDiscountedPrice(99, 'VISITOR')}`
                                        : `Dual Day Pass — ₹${calculateDiscountedPrice(149, 'VISITOR')}`}
                                    options={[
                                        {
                                            label: `Single Day Pass — ₹${calculateDiscountedPrice(99, 'VISITOR')} ${getActiveDiscount('VISITOR') ? '(OFFER)' : ''}`,
                                            value: 'day1'
                                        },
                                        {
                                            label: `Dual Day Pass — ₹${calculateDiscountedPrice(149, 'VISITOR')} ${getActiveDiscount('VISITOR') ? '(OFFER)' : ''}`,
                                            value: 'dual'
                                        }
                                    ]}
                                    onSelect={(v: any) => setPassType(v)}
                                    isOpen={isPassDropdownOpen}
                                    setIsOpen={setIsPassDropdownOpen}
                                />

                                <View className="flex-row gap-4">
                                    <View className="flex-1">
                                        <ShadowInput label="FIRST NAME" placeholder="JOHN" value={firstName} onChangeText={setFirstName} />
                                    </View>
                                    <View className="flex-1">
                                        <ShadowInput label="LAST NAME" placeholder="DOE" value={lastName} onChangeText={setLastName} />
                                    </View>
                                </View>

                                <ShadowInput label="EMAIL ADDRESS" placeholder="JOHN@EXAMPLE.COM" value={email} onChangeText={setEmail} keyboardType="email-address" />
                                <ShadowInput label="PHONE NUMBER" placeholder="9876543210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                                <ShadowInput label="COLLEGE NAME" placeholder="INSTITUTE OF TECHNOLOGY" value={college} onChangeText={setCollege} />
                                <ShadowInput label="ADDRESS" placeholder="STREET, AREA" value={address} onChangeText={setAddress} multiline numberOfLines={3} />
                                <ShadowInput label="CITY" placeholder="CITY" value={city} onChangeText={setCity} />

                                <View className="flex-row gap-4">
                                    <ShadowDropdown label="STATE" value={state} options={INDIAN_STATES} onSelect={(v: any) => setState(v)} isOpen={isStateDropdownOpen} setIsOpen={setIsStateDropdownOpen} />
                                    <ShadowDropdown label="COUNTRY" value={country} options={['India', 'Others']} onSelect={(v: any) => setCountry(v)} isOpen={isCountryDropdownOpen} setIsOpen={setIsCountryDropdownOpen} />
                                </View>

                                <TouchableOpacity
                                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                                    className="flex-row items-center mt-3 mb-8 bg-white border-[2px] border-dashed border-gray-300 rounded-xl p-5"
                                >
                                    <View className={`w-8 h-8 rounded-full border-[2.5px] border-black items-center justify-center mr-4 ${acceptedTerms ? 'bg-black' : 'bg-white'}`}>
                                        {acceptedTerms && <Check color="white" size={18} strokeWidth={4} />}
                                    </View>
                                    <Text className="text-[11px] uppercase font-black tracking-tight flex-1" style={{ fontFamily: FONT_BOLD }}>
                                        I ACCEPT THE TERMS AND CONDITIONS
                                    </Text>
                                </TouchableOpacity>

                                <SmoothButton
                                    onPress={handleContinueToPayment}
                                    buttonStyle="bg-black py-5 rounded-[24px] items-center justify-center border-[2.5px] border-black"
                                    shadowStyle="bg-[#A855F7] rounded-[24px] top-1.5 left-1.5"
                                    depth={0}
                                >
                                    <Text className="text-white text-[16px] font-black uppercase tracking-[2px]">
                                        CONTINUE TO PAYMENT →
                                    </Text>
                                </SmoothButton>
                            </Animated.View>
                        )}

                        {step === 1 && (
                            <Animated.View entering={FadeInDown.duration(400)}>
                                <TouchableOpacity onPress={() => setStep(0)} className="mb-6">
                                    <Text className="text-xs font-black uppercase text-gray-400" style={{ fontFamily: FONT_BOLD }}>← EDIT DETAILS</Text>
                                </TouchableOpacity>

                                <View className="bg-[#f3f4f6] border-[2px] border-black rounded-[25px] p-6 mb-10">
                                    <Text className="text-xs font-black text-gray-500 uppercase mb-2" style={{ fontFamily: FONT_BOLD }}>PAYING FOR: {passType === 'day1' ? 'Single Day Pass' : 'Dual Day Pass'}</Text>
                                    <View className="flex-row items-baseline">
                                        <Text className="text-5xl font-black text-black" style={{ fontFamily: 'Bicubik' }}>₹{calculateDiscountedPrice(passType === 'day1' ? 99 : 149)}</Text>
                                        {getActiveDiscount() && (
                                            <Text className="ml-3 text-xl text-gray-400 line-through" style={{ fontFamily: 'Bicubik' }}>₹{passType === 'day1' ? '99' : '149'}</Text>
                                        )}
                                    </View>
                                    {getActiveDiscount() && (
                                        <Text className="mt-2 text-[#9C27B0] font-black text-[10px]" style={{ fontFamily: FONT_BOLD }}>
                                            {getActiveDiscount()?.label} APPLIED!
                                        </Text>
                                    )}
                                </View>

                                <View className="items-center mb-8">
                                    <View className="p-4 bg-white border-[3px] border-black rounded-[25px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                        <Image source={require('../../assets/QR.webp')} style={{ width: 220, height: 220, borderRadius: 10 }} />
                                    </View>
                                    <Text className="mt-8 text-black font-black text-sm text-center px-4" style={{ fontFamily: FONT_BOLD }}>Scan this QR code with any UPI app to pay.</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Clipboard.setStringAsync('8100775674-2@ybl');
                                            showAlert('COPIED', 'UPI ID copied to clipboard!', 'info');
                                        }}
                                        className="mt-2 flex-row items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
                                    >
                                        <Text className="text-gray-500 font-bold text-[10px] text-center" style={{ fontFamily: FONT_BOLD }}>
                                            UPI ID: 8100775674-2@ybl
                                        </Text>
                                        <Copy size={12} color="#6b7280" />
                                    </TouchableOpacity>
                                </View>

                                <ShadowInput label="ENTER TRANSACTION / UTR ID" placeholder="Enter 12-digit UTR ID" value={utrId} onChangeText={setUtrId} keyboardType="numeric" subtext={<Text className="text-[#9ca3af] text-[10px]">Usually starts with banking ref no. or 'UPI...'</Text>} />

                                <View className="mt-8">
                                    <SmoothButton onPress={handleSubmitPayment} buttonStyle="bg-[#5eead4] py-5 rounded-[24px] items-center justify-center border-[2.5px] border-black" shadowStyle="bg-gray-500 rounded-[24px] top-1.5 left-1.5" depth={0} disabled={isLoading}>
                                        <Text className="text-black text-[16px] font-black uppercase tracking-[2px]">{isLoading ? 'SUBMITTING...' : 'SUBMIT PAYMENT DETAILS →'}</Text>
                                    </SmoothButton>
                                </View>
                            </Animated.View>
                        )}

                        {step === 2 && (
                            <Animated.View entering={FadeIn.duration(400)} className="items-center py-10">
                                <View className="w-24 h-24 bg-[#00e676] rounded-full items-center justify-center border-[3px] border-black shadow-[0_0_20px_rgba(0,230,118,0.5)] mb-10">
                                    <PartyPopper color="white" size={48} />
                                </View>
                                <Text className="text-4xl text-black text-center mb-6" style={{ fontFamily: 'Bicubik' }}>THANK YOU!</Text>
                                <Text className="text-center px-4 mb-4 text-lg" style={{ fontFamily: FONT_MAIN }}>Thank You for Registering. We will review and send your pass to your email soon.</Text>
                                <Text className="text-center px-4 mb-10 text-gray-500">You can also check your <Text onPress={handleGoToProfile} className="text-black font-black underline">Profile</Text> section for ticket status.</Text>
                                <View className="w-full gap-4">
                                    <SmoothButton onPress={handleReturnHome} buttonStyle="bg-black py-5 rounded-2xl items-center justify-center border-[2px] border-black" shadowStyle="bg-gray-400 rounded-2xl top-1 left-1" depth={0}>
                                        <Text className="text-white font-black uppercase tracking-widest">RETURN HOME</Text>
                                    </SmoothButton>
                                    <SmoothButton onPress={handleGoToProfile} buttonStyle="bg-white py-5 rounded-2xl items-center justify-center border-[2px] border-black" shadowStyle="bg-black rounded-2xl top-1.5 left-1.5" depth={0}>
                                        <Text className="text-black font-black uppercase tracking-widest">GO TO PROFILE</Text>
                                    </SmoothButton>
                                </View>
                            </Animated.View>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Alert Modal */}
            <Modal visible={alertConfig.visible} transparent animationType="fade" onRequestClose={hideAlert}>
                <View className="flex-1 bg-black/50 items-center justify-center p-6">
                    <Animated.View entering={FadeIn} className="bg-white rounded-3xl border-[3px] border-black w-full max-w-sm overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <View className={`p-6 ${alertConfig.type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center">
                                    <AlertCircle color={alertConfig.type === 'error' ? '#DC2626' : '#059669'} size={24} />
                                    <Text className="text-xl font-bold ml-3">{alertConfig.title}</Text>
                                </View>
                                <TouchableOpacity onPress={hideAlert}><X color="black" size={24} /></TouchableOpacity>
                            </View>
                            <Text className="text-sm text-gray-800 leading-5">{alertConfig.message}</Text>
                        </View>
                        <View className="p-4">
                            <SmoothButton onPress={hideAlert} buttonStyle="bg-black rounded-xl py-3" shadowStyle="bg-black rounded-xl" depth={4}>
                                <Text className="text-white text-center uppercase font-bold">Got It</Text>
                            </SmoothButton>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
