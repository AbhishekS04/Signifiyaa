import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Linking } from 'react-native';
import { ArrowLeft, Instagram, Linkedin, Phone } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

interface TeamMember {
    name: string;
    role: string;
    email: string;
    bgColor: string;
    instagram?: string;
    linkedin?: string;
    phone?: string;
}

const ContactSupportScreen = ({ navigation }: any) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: ''
    });

    const teamMembers: TeamMember[] = [
        {
            name: 'Ashish K. Das',
            role: 'LEAD DEVELOPER',
            email: 'ad@signifiya.com',
            bgColor: '#E1BEE7',
            instagram: 'https://instagram.com',
            linkedin: 'https://linkedin.com',
            phone: 'tel:+1234567890'
        },
        {
            name: 'Arjit Dey',
            role: 'FINANCE HEAD',
            email: 'arjit@signifiya.com',
            bgColor: '#FFD54F',
            instagram: 'https://instagram.com',
            linkedin: 'https://linkedin.com',
            phone: 'tel:+1234567890'
        },
        {
            name: 'Bardhan Roy',
            role: 'CORE COMMITTEE',
            email: 'bardhan@signifiya.com',
            bgColor: '#448AFF',
            instagram: 'https://instagram.com',
            linkedin: 'https://linkedin.com',
            phone: 'tel:+1234567890'
        }
    ];

    const handleSubmit = () => {
        // Handle form submission
        console.log('Form submitted:', formData);
        // You can add API call here
    };

    const openSocialLink = (url?: string) => {
        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <View className="flex-1 bg-black">
            {/* Purple Card Container */}
            <View
                className="flex-1 bg-[#E1BEE7] rounded-t-[40px] mt-2"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 10,
                }}
            >
                {/* Header */}
                <View className="pt-12 pb-6 px-6">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mb-6"
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={28} color="black" strokeWidth={2.5} />
                    </TouchableOpacity>

                    <Text
                        className={`text-black ${isSmallDevice ? 'text-4xl' : 'text-5xl'} mb-2`}
                        style={{ fontFamily: 'Gilton' }}
                    >
                        Contact Us
                    </Text>
                    <Text
                        className="text-black text-base"
                        style={{ fontFamily: 'Softura' }}
                    >
                        Get in touch with our team
                    </Text>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <View className="px-4 gap-4">
                        {/* Team Member Cards */}
                        {teamMembers.map((member, index) => (
                            <View
                                key={index}
                                className="rounded-[30px] p-6 border-4 border-black"
                                style={{
                                    backgroundColor: member.bgColor,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 8,
                                    elevation: 12,
                                }}
                            >
                                {/* Profile Image Placeholder */}
                                <View
                                    className="w-24 h-24 rounded-full bg-white border-4 border-black self-center mb-4"
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 6,
                                        elevation: 8,
                                    }}
                                />

                                {/* Name */}
                                <Text
                                    className="text-black text-center text-xl mb-1"
                                    style={{ fontFamily: 'Gilton' }}
                                >
                                    {member.name}
                                </Text>

                                {/* Role */}
                                <Text
                                    className="text-black text-center text-xs mb-4 tracking-wider"
                                    style={{ fontFamily: 'Softura' }}
                                >
                                    {member.role}
                                </Text>

                                {/* Email Button */}
                                <TouchableOpacity
                                    className="bg-black rounded-full py-3 px-6 mb-4"
                                    activeOpacity={0.8}
                                    onPress={() => Linking.openURL(`mailto:${member.email}`)}
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.5,
                                        shadowRadius: 6,
                                        elevation: 8,
                                    }}
                                >
                                    <Text
                                        className="text-white text-center text-sm"
                                        style={{ fontFamily: 'Softura' }}
                                    >
                                        {member.email}
                                    </Text>
                                </TouchableOpacity>

                                {/* Social Icons */}
                                <View className="flex-row justify-center gap-4">
                                    <TouchableOpacity
                                        className="w-10 h-10 rounded-full bg-[#E4405F] items-center justify-center border-2 border-black"
                                        activeOpacity={0.8}
                                        onPress={() => openSocialLink(member.instagram)}
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 3 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 4,
                                            elevation: 6,
                                        }}
                                    >
                                        <Instagram size={20} color="white" fill="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="w-10 h-10 rounded-full bg-[#0077B5] items-center justify-center border-2 border-black"
                                        activeOpacity={0.8}
                                        onPress={() => openSocialLink(member.linkedin)}
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 3 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 4,
                                            elevation: 6,
                                        }}
                                    >
                                        <Linkedin size={20} color="white" fill="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="w-10 h-10 rounded-full bg-[#25D366] items-center justify-center border-2 border-black"
                                        activeOpacity={0.8}
                                        onPress={() => openSocialLink(member.phone)}
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 3 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 4,
                                            elevation: 6,
                                        }}
                                    >
                                        <Phone size={20} color="white" fill="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        {/* Report an Issue Form */}
                        <View
                            className="bg-white rounded-[30px] p-6 border-4 border-black mt-2"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.4,
                                shadowRadius: 8,
                                elevation: 12,
                            }}
                        >
                            <Text
                                className="text-black text-2xl mb-6"
                                style={{ fontFamily: 'Gilton' }}
                            >
                                Report an Issue
                            </Text>

                            {/* Name Input */}
                            <View className="mb-4">
                                <Text
                                    className="text-black text-xs mb-2 tracking-wider"
                                    style={{ fontFamily: 'Softura' }}
                                >
                                    YOUR NAME *
                                </Text>
                                <TextInput
                                    className="bg-white border-2 border-black rounded-2xl px-4 py-3 text-black"
                                    placeholder="Enter your name"
                                    placeholderTextColor="#999"
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    style={{ fontFamily: 'Softura' }}
                                />
                            </View>

                            {/* Email Input */}
                            <View className="mb-4">
                                <Text
                                    className="text-black text-xs mb-2 tracking-wider"
                                    style={{ fontFamily: 'Softura' }}
                                >
                                    YOUR EMAIL *
                                </Text>
                                <TextInput
                                    className="bg-white border-2 border-black rounded-2xl px-4 py-3 text-black"
                                    placeholder="Enter your email"
                                    placeholderTextColor="#999"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={{ fontFamily: 'Softura' }}
                                />
                            </View>

                            {/* Description Input */}
                            <View className="mb-6">
                                <Text
                                    className="text-black text-xs mb-2 tracking-wider"
                                    style={{ fontFamily: 'Softura' }}
                                >
                                    ISSUE DESCRIPTION *
                                </Text>
                                <TextInput
                                    className="bg-white border-2 border-black rounded-2xl px-4 py-3 text-black"
                                    placeholder="Describe your issue here..."
                                    placeholderTextColor="#999"
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    style={{ fontFamily: 'Softura', minHeight: 100 }}
                                />
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                className="bg-black rounded-full py-4"
                                activeOpacity={0.8}
                                onPress={handleSubmit}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 6,
                                    elevation: 8,
                                }}
                            >
                                <Text
                                    className="text-white text-center text-base tracking-wider"
                                    style={{ fontFamily: 'Softura' }}
                                >
                                    SUBMIT ISSUE
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default ContactSupportScreen;
