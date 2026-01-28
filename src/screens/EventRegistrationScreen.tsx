import React, { useState, useEffect } from 'react';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Pressable, BackHandler, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, AlertCircle, X } from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import Animated, { FadeInDown, Layout, FadeIn } from 'react-native-reanimated';
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
        if (currentStep === 4) {
            const interval = setInterval(() => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentStep]);

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

            // Handle Success
            console.log(`Payment Success: ${data.razorpay_payment_id}`);
            showAlert(
                "REGISTRATION SUCCESSFUL!",
                `Payment ID: ${data.razorpay_payment_id}\n\nYour team has been registered successfully.`,
                'success'
            );

            // Navigate after a delay or let user close alert
            setTimeout(() => {
                (navigation as any).navigate('Main', { screen: 'Events' });
            }, 2000);

        } catch (error: any) {
            // Handle Failure
            console.log(`Payment Error: ${error.code} | ${error.description}`);

            // Don't show error if user cancelled
            if (error.code !== 0) { // 0 is often used for cancellation or check description
                showAlert("PAYMENT FAILED", error.description || "The payment transaction failed.", 'error');
            } else {
                // User cancelled, maybe just log or show info
                console.log("User cancelled payment");
            }
        }
    };

    // Fonts
    const FONT_HEADING = 'BBHBartle';
    const FONT_BODY = 'Gilton';
    const FONT_SUB = 'Softura';

    // Validation
    const validateStep1 = () => {
        if (!teamName.trim()) { showAlert("MISSING INPUT", "Please enter your Team Name.", 'error'); return false; }
        if (!leaderName.trim()) { showAlert("MISSING INPUT", "Please enter the Team Leader's Name.", 'error'); return false; }
        if (!bookingId.trim()) {
            showAlert("MISSING BOOKING ID", "You must enter your Booking ID to proceed.", 'error');
            return false;
        }

        // --- BOOKING ID VERIFICATION ---
        // Normalizes string comparison (trim + uppercase)
        const inputId = bookingId.trim().toUpperCase();
        const actualId = user?.bookingId?.trim().toUpperCase();

        if (inputId !== actualId) {
            showAlert(
                "INVALID BOOKING ID",
                "The Booking ID you entered does not match your profile.\n\nPlease visit your Profile, copy your unique Booking ID, and use that to register.",
                'error'
            );
            return false;
        }

        return true;
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (!validateStep1()) return;
        }
        if (currentStep < 4) setCurrentStep(currentStep + 1);
        else handlePay();
    };

    const ProgressBar = () => {
        const progressWidth = currentStep === 1 ? '25%' : currentStep === 2 ? '50%' : currentStep === 3 ? '75%' : '100%';

        return (
            <View className="mb-2">
                <View className="h-6 w-full bg-white border-[2px] border-black rounded-full overflow-hidden relative">
                    <View className="h-full bg-[#1F2937] relative overflow-hidden" style={{ width: progressWidth }}>
                        <View className="absolute top-0 left-0 right-0 bottom-0 opacity-20 bg-gray-500" />
                        <View className="absolute top-0 left-0 w-full h-full opacity-30 bg-black" />
                    </View>
                </View>
                <View className="flex-row justify-between px-1 mt-2">
                    <Text className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>LEADER</Text>
                    <Text className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>EVENTS</Text>
                    <Text className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= 3 ? 'text-black' : 'text-gray-400'}`}>TEAM</Text>
                    <Text className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= 4 ? 'text-black' : 'text-gray-400'}`}>PAY</Text>
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
                                <View className="bg-[#FAE8FF] border-[2px] border-black rounded-full py-2 px-5 shadow-[3px_3px_0px_#000000]">
                                    <Text className="text-xs font-black uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                        STEP 1/4: TEAM LEADER DETAILS
                                    </Text>
                                </View>
                            )}
                            {currentStep === 2 && (
                                <View className="bg-[#FEF08A] border-[2px] border-black rounded-full py-2 px-5 shadow-[3px_3px_0px_#000000] flex-row justify-between items-center">
                                    <Text className="text-xs font-black uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                        STEP 2/4: CHOOSE EVENTS
                                    </Text>
                                    <Text className="text-xs font-black uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                        ₹{totalPrice}
                                    </Text>
                                </View>
                            )}
                            {currentStep === 3 && (
                                <View className="bg-[#BFDBFE] border-[2px] border-black rounded-full py-2 px-5 shadow-[3px_3px_0px_#000000]">
                                    <Text className="text-xs font-black uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                        STEP 3/4: ADD TEAM
                                    </Text>
                                </View>
                            )}
                            {currentStep === 4 && (
                                <View className="bg-[#FECACA] border-[2px] border-black rounded-full py-2 px-5 shadow-[3px_3px_0px_#000000] flex-row justify-between items-center">
                                    <Text className="text-xs font-black uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                        STEP 4/4: PAYMENT
                                    </Text>
                                    <Text className="text-xs font-black uppercase tracking-widest text-[#DC2626]" style={{ fontFamily: FONT_SUB }}>
                                        {formatTime(timer)}
                                    </Text>
                                </View>
                            )}
                        </Animated.View>

                        {currentStep === 1 && (
                            <Animated.View entering={FadeInDown} exiting={FadeInDown} className="gap-5 mb-6">
                                <InputGroup label="TEAM NAME" value={teamName} onChange={setTeamName} placeholder="CODE WARRIORS" />
                                <InputGroup label="LEADER NAME" value={leaderName} onChange={setLeaderName} placeholder="JANE DOE" />
                                <InputGroup label="COLLEGE" value={college} onChange={setCollege} placeholder="ADAMAS UNIVERSITY" />
                                <InputGroup label="EMAIL" value={email} onChange={setEmail} placeholder="EMAIL@COLLEGE.EDU" keyboardType="email-address" />
                                <InputGroup label="PHONE" value={phone} onChange={setPhone} placeholder="9876543210" keyboardType="phone-pad" />

                                <View>
                                    <InputGroup
                                        label="BOOKING ID"
                                        value={bookingId}
                                        onChange={setBookingId}
                                        placeholder="SGF26-XXXXXXXX"
                                    />
                                    <Text className="text-[11px] text-gray-500 mt-2 leading-4 ml-1" style={{ fontFamily: FONT_BODY }}>
                                        Find it in <Text className="underline font-bold text-black" onPress={() => (navigation as any).navigate('Main', { screen: 'Profile' })}>Profile</Text>. Sign in and visit Profile first if you don't have one.
                                    </Text>
                                </View>
                            </Animated.View>
                        )}

                        {currentStep === 2 && (
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

                        {currentStep === 3 && (
                            <Animated.View entering={FadeInDown} className="gap-5 mb-4">
                                {teamMembers.map((member, index) => (
                                    <View key={member.id} className="relative mt-2">
                                        <View className="absolute -top-3 left-6 z-20 bg-black px-3 py-1 rounded-md transform -rotate-2">
                                            <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
                                                MEMBER {index + 1}
                                            </Text>
                                        </View>
                                        {teamMembers.length > 1 && (
                                            <TouchableOpacity onPress={() => removeMember(member.id)} className="absolute -top-3 right-4 z-20 bg-red-500 border-2 border-black w-7 h-7 rounded-full items-center justify-center">
                                                <Text className="text-white font-bold text-[10px]">X</Text>
                                            </TouchableOpacity>
                                        )}
                                        <View className="bg-white border-[2px] border-black rounded-[20px] p-4 pt-6 gap-3 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                                            <InputGroup label="FULL NAME" value={member.name} onChange={(t: string) => updateMember(member.id, 'name', t)} placeholder="Name" />
                                            <InputGroup label="COLLEGE" value={member.college} onChange={(t: string) => updateMember(member.id, 'college', t)} placeholder="College" />
                                            <InputGroup label="PHONE" value={member.phone} onChange={(t: string) => updateMember(member.id, 'phone', t)} placeholder="Phone" keyboardType="phone-pad" />
                                            <InputGroup label="EMAIL" value={member.email} onChange={(t: string) => updateMember(member.id, 'email', t)} placeholder="Email" keyboardType="email-address" />
                                        </View>
                                    </View>
                                ))}
                                <TouchableOpacity onPress={addMember} className="border-[2px] border-black border-dashed rounded-[20px] py-4 items-center justify-center bg-gray-50 active:bg-gray-100">
                                    <Text className="text-black font-bold uppercase tracking-widest text-xs">+ ADD MEMBER</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {currentStep === 4 && (
                            <Animated.View entering={FadeInDown} className="gap-5 mb-4">
                                <View className="relative">
                                    <View className="absolute -top-3 self-center w-6 h-6 rounded-full bg-black z-20 border-[2px] border-white" />
                                    <View className="bg-white border-[2px] border-black rounded-[30px] px-5 py-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                        <Text className="text-center font-bold text-sm tracking-[0.2em] mb-4 uppercase" style={{ fontFamily: 'Courier New' }}>Receipt Summary</Text>
                                        <View className="border-b-[2px] border-black border-dashed mb-6 opacity-30" />
                                        <View className="gap-3 mb-6">
                                            {selectedEvents.map((id) => {
                                                const event = AVAILABLE_EVENTS.find(e => e.id === id);
                                                return (
                                                    <View key={id} className="flex-row justify-between items-center">
                                                        <Text className="text-sm font-bold text-black max-w-[70%]" style={{ fontFamily: 'Courier New' }}>{event?.name}</Text>
                                                        <Text className="text-sm font-bold text-black" style={{ fontFamily: 'Courier New' }}>₹{event?.price}</Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                        <View className="h-[2px] bg-black mb-4" />
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-lg font-extrabold uppercase">TOTAL</Text>
                                            <Text className="text-xl font-black">₹{totalPrice}</Text>
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
                                    {currentStep === 1 ? 'NEXT: SELECT EVENT →' :
                                        currentStep === 2 ? 'NEXT: TEAM DETAILS →' :
                                            currentStep === 3 ? 'PROCEED TO PAY →' :
                                                `PAY ₹${totalPrice}`}
                                </Text>
                            </SmoothButton>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
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
