import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, ChevronDown, Calendar, Ticket, Lock, User } from 'lucide-react-native';
import SmoothButton from '../components/ui/SmoothButton';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Font Constants
const FONT_MAIN = 'Gilton';
const FONT_BOLD = 'Gilton'; // Assuming Gilton has bold weight or is used for headings

const ProfileScreen = () => {
    // Mock State
    const [name, setName] = useState('Abhishek Singh');
    const [email, setEmail] = useState('abhishek23main@gmail.com');
    const [mobile, setMobile] = useState('+919883511660');
    const [college, setCollege] = useState('Adamas University');
    const [gender, setGender] = useState('Male');
    const bookingId = 'SGF26-DC2940D1';

    return (
        <SafeAreaView className="flex-1 bg-black pt-3" edges={['top', 'left', 'right']}>
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
                <Animated.View
                    entering={FadeInUp.delay(100).duration(500)}
                    className="w-full bg-white border-[3px] border-black rounded-[30px] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6"
                >
                    {/* Avatar */}
                    <View className="items-center mb-6">
                        <View className="w-24 h-24 rounded-full border-[3px] border-black overflow-hidden mb-2 bg-gray-200">
                            {/* Placeholder Avatar */}
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/300?img=11' }} // Mock Avatar
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        <TouchableOpacity>
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
                                editable={false} // Usually email is locked
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

                </Animated.View>

                {/* Registered Events Card */}
                <Animated.View
                    entering={FadeInUp.delay(200).duration(500)}
                    className="w-full bg-white border-[3px] border-black rounded-[30px] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6"
                >
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
                </Animated.View>

                {/* My Passes Card */}
                <Animated.View
                    entering={FadeInUp.delay(300).duration(500)}
                    className="w-full bg-white border-[3px] border-black rounded-[30px] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10"
                >
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
                </Animated.View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
