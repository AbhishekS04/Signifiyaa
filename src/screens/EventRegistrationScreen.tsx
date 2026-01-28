import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Pressable, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check } from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

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
    const [currentStep, setCurrentStep] = useState(1);

    // --- Step 1 State ---
    const [teamName, setTeamName] = useState('CODE WARRIORS');
    const [leaderName, setLeaderName] = useState('JANE DOE');
    const [college, setCollege] = useState('ADAMAS UNIVERSITY');
    const [email, setEmail] = useState('EMAIL@COLLEGE.EDU');
    const [phone, setPhone] = useState('9876543210');
    const [bookingId, setBookingId] = useState('SGF26-XXXXXXXX');

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

    // Timer Effect
    React.useEffect(() => {
        if (currentStep === 4) {
            const interval = setInterval(() => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentStep]);

    // Back Handler
    React.useEffect(() => {
        const backAction = () => {
            if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
                return true; // Prevent default behavior (exit)
            }
            return false; // Let default behavior happen (go back to previous screen)
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [currentStep]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handlePay = () => {
        // Mock Payment Success
        (navigation as any).navigate('Main', { screen: 'Events' }); // Navigate back to Events tab
    };

    // Fonts
    const FONT_HEADING = 'BBHBartle';
    const FONT_BODY = 'Gilton';
    const FONT_SUB = 'Softura';

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
        else handlePay();
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else navigation.goBack();
    };

    // Progress Bar Component
    const ProgressBar = () => {
        const progressWidth = currentStep === 1 ? '25%' : currentStep === 2 ? '50%' : currentStep === 3 ? '75%' : '100%';

        return (
            <View className="mb-2">
                <View className="h-6 w-full bg-white border-[2px] border-black rounded-full overflow-hidden relative">
                    {/* Dynamic Progress Fill */}
                    <View className="h-full bg-[#1F2937] relative overflow-hidden" style={{ width: progressWidth }}>
                        <View className="absolute top-0 left-0 right-0 bottom-0 opacity-20 bg-gray-500" />
                        {/* Striped Pattern Overlay - Removed backgroundImage as it's not supported in RN ViewStyle */}
                        <View className="absolute top-0 left-0 w-full h-full opacity-30 bg-black" />
                    </View>
                </View>
                {/* Labels with Dynamic Highlighting */}
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
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-6 pt-4"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    {/* Header: Return Home Button */}
                    <View className="self-start mb-6">
                        <SmoothButton
                            onPress={() => navigation.goBack()}
                            buttonStyle="bg-[#FFEB3B] px-4 py-2 rounded-lg border-[2.5px] border-black flex-row items-center gap-2"
                            shadowStyle="bg-black rounded-lg"
                            depth={3}
                        >
                            <ArrowLeft color="black" size={16} strokeWidth={3} />
                            <Text className="text-xs font-bold uppercase tracking-widest text-black" style={{ fontFamily: 'Gilton' }}>
                                RETURN HOME
                            </Text>
                        </SmoothButton>
                    </View>

                    {/* Main Title */}
                    <View className="mb-6">
                        <Text className="text-5xl uppercase leading-[45px] text-black" style={{ fontFamily: FONT_HEADING }}>
                            EVENT
                        </Text>
                        <Text className="text-5xl uppercase leading-[45px] text-[#A855F7]" style={{ fontFamily: FONT_HEADING }}>
                            REGISTRATION.
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <View className="mb-8">
                        <ProgressBar />
                    </View>

                    {/* Dynamic Step Header */}
                    <Animated.View layout={Layout.springify()} className="mb-8">
                        {currentStep === 1 && (
                            <View className="bg-[#FAE8FF] border-[3px] border-black rounded-full py-2 px-6 shadow-[4px_4px_0px_#000000]">
                                <Text className="text-xs font-bold uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                    STEP 1/4: TEAM LEADER DETAILS
                                </Text>
                            </View>
                        )}
                        {currentStep === 2 && (
                            <View className="bg-[#FEF08A] border-[3px] border-black rounded-full py-2 px-6 shadow-[4px_4px_0px_#000000] flex-row justify-between items-center">
                                <Text className="text-xs font-bold uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                    STEP 2/4: CHOOSE YOUR BATTLES
                                </Text>
                                <Text className="text-xs font-bold uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                    TOTAL: ₹{totalPrice}
                                </Text>
                            </View>
                        )}
                        {currentStep === 3 && (
                            <View className="bg-[#BFDBFE] border-[3px] border-black rounded-full py-2 px-6 shadow-[4px_4px_0px_#000000]">
                                <Text className="text-xs font-bold uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                    STEP 3/4: ADD TEAM MEMBERS
                                </Text>
                            </View>
                        )}
                        {currentStep === 4 && (
                            <View className="bg-[#FECACA] border-[3px] border-black rounded-full py-2 px-6 shadow-[4px_4px_0px_#000000] flex-row justify-between items-center">
                                <Text className="text-xs font-bold uppercase tracking-widest text-black" style={{ fontFamily: FONT_SUB }}>
                                    STEP 4/4: SECURE PAYMENT
                                </Text>
                                <Text className="text-xs font-bold uppercase tracking-widest text-[#DC2626]" style={{ fontFamily: FONT_SUB }}>
                                    EXP: {formatTime(timer)}
                                </Text>
                            </View>
                        )}
                    </Animated.View>

                    {/* STEP 1 FORM */}
                    {currentStep === 1 && (
                        <Animated.View entering={FadeInDown} exiting={FadeInDown} className="gap-5 mb-8">
                            <InputGroup label="TEAM NAME" value={teamName} onChange={setTeamName} placeholder="Enter Team Name" />
                            <InputGroup label="LEADER NAME" value={leaderName} onChange={setLeaderName} placeholder="Enter Your Name" />
                            <InputGroup label="COLLEGE" value={college} onChange={setCollege} placeholder="Enter College Name" />
                            <InputGroup label="EMAIL" value={email} onChange={setEmail} placeholder="Enter Email Address" keyboardType="email-address" />
                            <InputGroup label="PHONE" value={phone} onChange={setPhone} placeholder="Enter Phone Number" keyboardType="phone-pad" />

                            <View>
                                <InputGroup label="BOOKING ID" value={bookingId} onChange={setBookingId} placeholder="Enter Booking ID" />
                                <Text className="text-[10px] text-gray-500 mt-2 leading-3" style={{ fontFamily: FONT_BODY }}>
                                    Find it in <Text className="underline font-bold">Profile</Text>. Sign in and visit Profile first if you don't have one.
                                </Text>
                            </View>
                        </Animated.View>
                    )}

                    {/* STEP 2 EVENTS LIST */}
                    {currentStep === 2 && (
                        <Animated.View entering={FadeInDown} className="gap-4 mb-8">
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

                    {/* STEP 3 MEMBER FORMS */}
                    {currentStep === 3 && (
                        <Animated.View entering={FadeInDown} className="gap-6 mb-8">
                            {teamMembers.map((member, index) => (
                                <View key={member.id} className="relative mt-4">
                                    {/* Member Badge Overlay */}
                                    <View className="absolute -top-3 left-6 z-20 bg-black px-3 py-1 rounded-md transform -rotate-2">
                                        <Text className="text-white text-xs font-bold uppercase tracking-widest">
                                            MEMBER {index + 1}
                                        </Text>
                                    </View>

                                    {/* Remove Button (if > 1) */}
                                    {teamMembers.length > 1 && (
                                        <TouchableOpacity
                                            onPress={() => removeMember(member.id)}
                                            className="absolute -top-3 right-4 z-20 bg-red-500 border-2 border-black w-8 h-8 rounded-full items-center justify-center transform rotate-2"
                                        >
                                            <Text className="text-white font-bold text-xs">X</Text>
                                        </TouchableOpacity>
                                    )}

                                    {/* Card Container */}
                                    <View className="bg-white border-[3px] border-black rounded-[30px] p-6 pt-8 gap-4 shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                                        <InputGroup
                                            label="FULL NAME"
                                            value={member.name}
                                            onChange={(text: string) => updateMember(member.id, 'name', text)}
                                            placeholder="Name"
                                        />
                                        <InputGroup
                                            label="COLLEGE NAME"
                                            value={member.college}
                                            onChange={(text: string) => updateMember(member.id, 'college', text)}
                                            placeholder="College"
                                        />
                                        <InputGroup
                                            label="PHONE"
                                            value={member.phone}
                                            onChange={(text: string) => updateMember(member.id, 'phone', text)}
                                            placeholder="9876543210"
                                            keyboardType="phone-pad"
                                        />
                                        <InputGroup
                                            label="EMAIL"
                                            value={member.email}
                                            onChange={(text: string) => updateMember(member.id, 'email', text)}
                                            placeholder="email@example.com"
                                            keyboardType="email-address"
                                        />
                                    </View>
                                </View>
                            ))}

                            {/* Add Member Button - Dashed */}
                            <TouchableOpacity
                                onPress={addMember}
                                className="border-[3px] border-black border-dashed rounded-[30px] py-6 items-center justify-center bg-[#F9FAFB] active:bg-gray-100 mt-2"
                            >
                                <Text className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                                    + ADD ANOTHER MEMBER
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* STEP 4: RECEIPT SUMMARY */}
                    {currentStep === 4 && (
                        <Animated.View entering={FadeInDown} className="gap-6 mb-8">

                            {/* Receipt Card */}
                            <View className="relative">
                                {/* Hole Punch Visual */}
                                <View className="absolute -top-3 self-center w-6 h-6 rounded-full bg-black z-20 border-[2px] border-white" />

                                <View className="bg-white border-[3px] border-black rounded-[30px] px-6 py-8 shadow-[5px_5px_0px_rgba(0,0,0,1)]">

                                    <Text className="text-center font-bold text-sm tracking-[0.2em] mb-4 uppercase" style={{ fontFamily: 'Courier New' }}>
                                        Receipt Summary
                                    </Text>

                                    {/* Dashed Line */}
                                    <View className="border-b-[2px] border-black border-dashed mb-6 opacity-30" />

                                    {/* Items List */}
                                    <View className="gap-3 mb-6">
                                        {selectedEvents.map((id) => {
                                            const event = AVAILABLE_EVENTS.find(e => e.id === id);
                                            return (
                                                <View key={id} className="flex-row justify-between items-center">
                                                    <Text className="text-sm font-bold text-black max-w-[70%]" style={{ fontFamily: 'Courier New' }}>
                                                        {event?.name}
                                                    </Text>
                                                    <Text className="text-sm font-bold text-black" style={{ fontFamily: 'Courier New' }}>
                                                        ₹{event?.price}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>

                                    {/* Divider */}
                                    <View className="h-[2px] bg-black mb-4" />

                                    {/* Total */}
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-lg font-extrabold uppercase" style={{ fontFamily: FONT_SUB }}>
                                            TOTAL
                                        </Text>
                                        <Text className="text-xl font-black" style={{ fontFamily: FONT_SUB }}>
                                            ₹{totalPrice}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Payment Info Card */}
                            <View className="bg-gray-100 border-[3px] border-black rounded-[20px] p-5">
                                <Text className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: FONT_SUB }}>
                                    Total Amount: ₹{totalPrice}
                                </Text>
                                <Text className="text-xs text-gray-500 leading-4" style={{ fontFamily: FONT_BODY }}>
                                    Click below to proceed with secure payment via Razorpay.
                                </Text>
                            </View>

                        </Animated.View>
                    )}

                </ScrollView>

                {/* Bottom Navigation Buttons */}
                <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex-row gap-4">
                    {currentStep > 1 && (
                        <View className="flex-1">
                            <SmoothButton
                                onPress={handleBack}
                                containerStyle={{ width: '100%' }}
                                buttonStyle="bg-white py-4 rounded-2xl items-center justify-center border-[3px] border-black"
                                shadowStyle="bg-black rounded-2xl"
                                depth={4}
                            >
                                <Text className="text-black text-lg uppercase font-bold tracking-widest" style={{ fontFamily: FONT_SUB }}>
                                    BACK
                                </Text>
                            </SmoothButton>
                        </View>
                    )}

                    <View className="flex-1">
                        <SmoothButton
                            onPress={handleNext}
                            containerStyle={{ width: '100%' }}
                            buttonStyle={`${currentStep === 4 ? 'bg-[#10B981]' : 'bg-black'} py-4 rounded-2xl items-center justify-center border-[3px] border-black`}
                            shadowStyle={
                                currentStep === 1 ? "bg-[#A855F7] rounded-2xl" :
                                    currentStep === 2 ? "bg-[#FEF08A] rounded-2xl" :
                                        currentStep === 3 ? "bg-[#3B82F6] rounded-2xl" : // Blue for Step 3
                                            "bg-[#10B981] rounded-2xl" // Green for Pay
                            }
                            depth={4}
                        >
                            <Text className={`${currentStep === 4 ? 'text-black' : 'text-white'} text-lg uppercase font-bold tracking-widest text-center`} style={{ fontFamily: FONT_SUB }}>
                                {currentStep === 1 ? 'NEXT: SELECT EVENT →' :
                                    currentStep === 2 ? 'NEXT: TEAM DETAILS →' :
                                        currentStep === 3 ? 'PROCEED TO PAY →' :
                                            `PAY ₹${totalPrice} & REGISTER`}
                            </Text>
                        </SmoothButton>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Reusable 3D Input Component
const InputGroup = ({ label, value, onChange, placeholder, keyboardType = 'default' }: any) => {
    return (
        <View>
            <Text className="text-[10px] font-bold text-black uppercase tracking-widest mb-2 ml-1" style={{ fontFamily: 'Softura' }}>
                {label}
            </Text>
            <View className="relative">
                {/* 3D Shadow - Pure visual */}
                <View className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-black rounded-2xl" />
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    className="bg-white border-[2.5px] border-black rounded-2xl px-4 py-3 text-base text-gray-700 font-medium"
                    style={{ fontFamily: 'Gilton' }}
                />
            </View>
        </View>
    );
};

// Event Selection Card for Step 2
const EventSelectionCard = ({ event, selected, onToggle }: { event: any, selected: boolean, onToggle: () => void }) => {
    return (
        <Pressable onPress={onToggle} className="mb-2">
            <View className="relative">
                {/* 3D Shadow */}
                <View className="absolute top-1 left-1 right-[-4px] bottom-[-4px] bg-black rounded-2xl" />

                {/* Card Body */}
                <View className={`border-[2.5px] border-black rounded-2xl p-4 flex-row items-center justify-between ${selected ? 'bg-[#F0FDF4]' : 'bg-white'}`}>

                    {/* Checkbox + Info */}
                    <View className="flex-row items-center flex-1 gap-4">
                        {/* Custom Animated Checkbox */}
                        <View className={`w-8 h-8 rounded-md border-[2.5px] border-black items-center justify-center ${selected ? 'bg-black' : 'bg-white'}`}>
                            {selected && <Check color="white" size={20} strokeWidth={4} />}
                        </View>

                        <View>
                            <Text className="text-lg font-bold uppercase text-black leading-5 mb-1" style={{ fontFamily: 'Softura' }}>
                                {event.name}
                            </Text>
                            <Text className="text-xs text-black/60" style={{ fontFamily: 'Gilton' }}>
                                {event.teamSize}
                            </Text>
                        </View>
                    </View>

                    {/* Price Tag */}
                    <View className="border-[2px] border-black px-2 py-1 rounded bg-white shadow-sm">
                        <Text className="font-bold text-xs" style={{ fontFamily: 'Softura' }}>₹{event.price}</Text>
                    </View>

                </View>
            </View>
        </Pressable>
    );
};

export default EventRegistrationScreen;
