import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Linking, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;
import { Instagram, Linkedin, Github } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// ============================================
// DESIGN SYSTEM: FONTS (EASY TO CHANGE)
// ============================================
const SECTION_FONTS = {
    NAME: 'Gilton',
    ROLE: 'Gilton',
    DESCRIPTION: 'Softura',
    MEMBER_LIST: 'Softura',
    SECTION_HEADER: 'Gilton',
};

const TEAM_MEMBERS = [
    {
        id: 1,
        name: 'Ashish Yadav',
        role: 'BLOCKCHAIN DEV',
        desc: 'Developing smart contracts and securing decentralized applications.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Ashish',
        socials: { instagram: 'https://instagram.com/ashish', linkedin: 'https://linkedin.com/in/ashish', github: 'https://github.com/ashish' }
    },
    {
        id: 2,
        name: 'Garima Roy',
        role: 'FRONTEND DEV',
        desc: 'Building beautiful, responsive, and interactive user interfaces.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Garima',
        socials: { instagram: 'https://instagram.com/garima', linkedin: 'https://linkedin.com/in/garima', github: 'https://github.com/garima' }
    },
    {
        id: 3,
        name: 'Leeza Bhowal',
        role: 'UI/UX DESIGNER',
        desc: 'Crafting intuitive user experiences and stunning visual designs.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Leeza',
        socials: { instagram: 'https://instagram.com/leeza', linkedin: 'https://linkedin.com/in/leeza', github: 'https://github.com/leeza' }
    },
    {
        id: 4,
        name: 'Somnath Singha',
        role: 'BACKEND DEV',
        desc: 'Managing servers, APIs, and database architecture efficiency.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Somnath',
        socials: { instagram: 'https://instagram.com/somnath', linkedin: 'https://linkedin.com/in/somnath', github: 'https://github.com/somnath' }
    },
    {
        id: 5,
        name: 'Srijita Bera',
        role: 'CONTENT LEAD',
        desc: 'Writing compelling stories and managing brand narratives.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Srijita',
        socials: { instagram: 'https://instagram.com/srijita', linkedin: 'https://linkedin.com/in/srijita', github: 'https://github.com/srijita' }
    },
    {
        id: 6,
        name: 'Siddhartha',
        role: 'TECH LEAD',
        desc: 'Overseeing technology strategy and guiding the dev team.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Siddhartha',
        socials: { instagram: 'https://instagram.com/siddhartha', linkedin: 'https://linkedin.com/in/siddhartha', github: 'https://github.com/siddhartha' }
    },
    {
        id: 7,
        name: 'Snehasish Mondal',
        role: 'EVENT MANAGER',
        desc: 'Organizing chaos into seamless and memorable event experiences.',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/c6682553-ae50-45c1-9fc3-5ff2918f194d.jpg',
        socials: { instagram: 'https://instagram.com/snehasish', linkedin: 'https://linkedin.com/in/snehasish', github: 'https://github.com/snehasish' }
    },
    {
        id: 8,
        name: 'Abhishek Singh',
        role: 'Application Developer',
        desc: 'Building cross-platform mobile experiences with React Native.',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/68e0efce-84a4-42ae-9bd7-a2be6aca73d8.jpg',
        socials: { instagram: 'https://instagram.com/abhishek', linkedin: 'https://linkedin.com/in/abhishek', github: 'https://github.com/abhishek' }
    },
];

const TeamSection = () => {
    const [activeMember, setActiveMember] = useState(TEAM_MEMBERS[0]);

    const openLink = (url: string) => {
        if (url && url !== '#') {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        }
    };

    return (
        <View className={`bg-[#F3E5F5] rounded-[40px] mb-6 mx-2 border-2 border-black ${isSmallDevice ? 'px-4 py-8' : 'px-6 py-10'}`}>

            {/* Header */}
            <View className="items-center mb-6">
                <Text className="text-2xl text-black uppercase" style={{ fontFamily: SECTION_FONTS.SECTION_HEADER }}>
                    MEET THE TEAM
                </Text>
            </View>

            {/* Active Member Display Card - FIXED HEIGHT */}
            <View className="items-center mb-8">
                <View
                    className="bg-white border-[3px] border-black rounded-[40px] p-8 w-full items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                    style={{ minHeight: 460 }} // Fixed minimum height ensures card doesn't shrink/grow
                >
                    {/* Member Image - Centered and Larger */}
                    <View className="w-36 h-36 bg-black rounded-[28px] mb-6 overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Image
                            source={{ uri: activeMember.image }}
                            style={{
                                width: '125%',
                                height: '125%',
                                position: 'absolute',
                                left: '-10%',
                                top: '-12.5%'
                            }}
                            resizeMode="cover"
                        />
                        {/* Perfect Border Overlay */}
                        <View
                            style={{ position: 'absolute', inset: 0, borderWidth: 3, borderColor: 'black', borderRadius: 28 }}
                            pointerEvents="none"
                        />
                    </View>

                    {/* Name - Truncated if too long, fixed height container */}
                    <View style={{ height: 40, justifyContent: 'center', marginBottom: 4, width: '100%' }}>
                        <Text
                            className={`text-black text-center uppercase ${isSmallDevice ? 'text-2xl' : 'text-3xl'}`}
                            style={{ fontFamily: SECTION_FONTS.NAME }}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {activeMember.name}
                        </Text>
                    </View>

                    {/* Role - Fixed height container */}
                    <View style={{ height: 24, justifyContent: 'center', marginBottom: 16 }}>
                        <Text className="text-[#8e99af] text-[12px] tracking-[0.2em] uppercase text-center" style={{ fontFamily: SECTION_FONTS.ROLE }}>
                            {activeMember.role}
                        </Text>
                    </View>

                    {/* Description - Fixed height text area */}
                    <View style={{ height: 48, marginBottom: 32, width: '100%' }}>
                        <Text
                            className="text-black text-center text-sm leading-6 px-4"
                            style={{ fontFamily: SECTION_FONTS.DESCRIPTION }}
                            numberOfLines={2}
                        >
                            {activeMember.desc}
                        </Text>
                    </View>

                    {/* Socials - Premium Icons - Anchored at bottom via flex or absolute */}
                    <View className="flex-row gap-4 mt-auto">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                openLink(activeMember.socials.instagram);
                            }}
                            className="w-12 h-12 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] items-center justify-center"
                        >
                            <Instagram size={20} color="black" strokeWidth={2.5} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                openLink(activeMember.socials.linkedin);
                            }}
                            className="w-12 h-12 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] items-center justify-center"
                        >
                            <Linkedin size={20} color="black" strokeWidth={2.5} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                openLink(activeMember.socials.github);
                            }}
                            className="w-12 h-12 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] items-center justify-center"
                        >
                            <Github size={20} color="black" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Compact Member Selector - Horizontal Scroll for Infinite Members */}
            {/* NOW AT THE BOTTOM */}
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="px-2 gap-3"
                    className="py-2"
                >
                    {TEAM_MEMBERS.map((member) => (
                        <TouchableOpacity
                            key={member.id}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setActiveMember(member);
                            }}
                            activeOpacity={0.7}
                            className={`rounded-2xl overflow-hidden bg-black relative transition-all duration-200`}
                            style={{
                                width: 68,
                                height: 68,
                                borderWidth: activeMember.id === member.id ? 3 : 2,
                                borderColor: activeMember.id === member.id ? '#000' : 'rgba(0,0,0,0.3)', // Black active, subtle inactive
                                transform: [{ scale: activeMember.id === member.id ? 1.05 : 0.95 }],
                                opacity: activeMember.id === member.id ? 1 : 0.7,
                                // Active indicator styling
                                shadowColor: '#000',
                                shadowOffset: { width: activeMember.id === member.id ? 4 : 0, height: activeMember.id === member.id ? 4 : 0 },
                                shadowOpacity: activeMember.id === member.id ? 0.3 : 0,
                                shadowRadius: 0,
                                elevation: activeMember.id === member.id ? 5 : 0,
                            }}
                        >
                            <Image
                                source={{ uri: member.image }}
                                className="w-full h-full"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                resizeMode="cover"
                            />

                            {/* Active Indicator Overlay */}
                            {activeMember.id === member.id && (
                                <View className="absolute inset-0 bg-black/0 border-2 border-white/20 rounded-xl" pointerEvents="none" />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

        </View>
    );
};

export default TeamSection;
