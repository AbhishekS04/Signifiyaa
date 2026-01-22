import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
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
        desc: 'Developing smart contracts.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Ashish',
        socials: { instagram: 'https://instagram.com/ashish', linkedin: 'https://linkedin.com/in/ashish', github: 'https://github.com/ashish' }
    },
    {
        id: 2,
        name: 'Garima Roy',
        role: 'FRONTEND DEV',
        desc: 'Building beautiful UIs.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Garima',
        socials: { instagram: 'https://instagram.com/garima', linkedin: 'https://linkedin.com/in/garima', github: 'https://github.com/garima' }
    },
    {
        id: 3,
        name: 'Leeza Bhowal',
        role: 'UI/UX DESIGNER',
        desc: 'Crafting user experiences.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Leeza',
        socials: { instagram: 'https://instagram.com/leeza', linkedin: 'https://linkedin.com/in/leeza', github: 'https://github.com/leeza' }
    },
    {
        id: 4,
        name: 'Somnath Singha',
        role: 'BACKEND DEV',
        desc: 'Managing servers & APIs.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Somnath',
        socials: { instagram: 'https://instagram.com/somnath', linkedin: 'https://linkedin.com/in/somnath', github: 'https://github.com/somnath' }
    },
    {
        id: 5,
        name: 'Srijita Bera',
        role: 'CONTENT LEAD',
        desc: 'Writing compelling stories.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Srijita',
        socials: { instagram: 'https://instagram.com/srijita', linkedin: 'https://linkedin.com/in/srijita', github: 'https://github.com/srijita' }
    },
    {
        id: 6,
        name: 'Siddhartha',
        role: 'TECH LEAD',
        desc: 'Overseeing technology.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Siddhartha',
        socials: { instagram: 'https://instagram.com/siddhartha', linkedin: 'https://linkedin.com/in/siddhartha', github: 'https://github.com/siddhartha' }
    },
    {
        id: 7,
        name: 'Snehasish Mondal',
        role: 'EVENT MANAGER',
        desc: 'Organizing chaos.',
        image: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/c6682553-ae50-45c1-9fc3-5ff2918f194d.jpg',
        socials: { instagram: 'https://instagram.com/snehasish', linkedin: 'https://linkedin.com/in/snehasish', github: 'https://github.com/snehasish' }
    },
    {
        id: 8,
        name: 'Abhishek Singh',
        role: 'Application Developer',
        desc: 'Building beautiful UIs.',
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
        <View className="bg-[#F3E5F5] rounded-[40px] px-6 py-10 mb-6 mx-2 border-2 border-black">

            {/* Active Member Display Card */}
            <View className="mb-10 items-center">
                <View className="bg-white border-[3px] border-black rounded-[32px] p-8 w-full items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <View className="w-32 h-32 bg-black rounded-[28px] mb-6 overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                        {/* Perfect Border Overlay - Eliminates sub-pixel gaps */}
                        <View
                            style={{ position: 'absolute', inset: 0, borderWidth: 3, borderColor: 'black', borderRadius: 28 }}
                            pointerEvents="none"
                        />
                    </View>

                    <Text className="text-3xl text-black text-center mb-1 uppercase" style={{ fontFamily: SECTION_FONTS.NAME }}>
                        {activeMember.name}
                    </Text>
                    <Text className="text-[#8e99af] text-[12px] tracking-[0.2em] uppercase mb-4 text-center" style={{ fontFamily: SECTION_FONTS.ROLE }}>
                        {activeMember.role}
                    </Text>
                    <Text className="text-black text-center text-sm mb-8 leading-6 px-4" style={{ fontFamily: SECTION_FONTS.DESCRIPTION }}>
                        {activeMember.desc}
                    </Text>

                    {/* Socials - Premium Icons */}
                    <View className="flex-row gap-4">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                openLink(activeMember.socials.instagram);
                            }}
                            className="p-3 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <Instagram size={20} color="black" strokeWidth={2.5} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                openLink(activeMember.socials.linkedin);
                            }}
                            className="p-3 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] items-center justify-center"
                        >
                            <Linkedin size={20} color="black" strokeWidth={2.5} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                openLink(activeMember.socials.github);
                            }}
                            className="p-3 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] items-center justify-center"
                        >
                            <Github size={20} color="black" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Compact Member Selector - Horizontal Scroll for Infinite Members */}
            <View className="mb-8">
                <View className="items-center mb-6">
                    <Text className="text-2xl text-black uppercase" style={{ fontFamily: SECTION_FONTS.SECTION_HEADER }}>
                        MEET THE TEAM
                    </Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="px-2 gap-4"
                >
                    {TEAM_MEMBERS.map((member) => (
                        <TouchableOpacity
                            key={member.id}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setActiveMember(member);
                            }}
                            activeOpacity={0.7}
                            className={`w-16 h-16 rounded-2xl overflow-hidden bg-black relative`}
                            style={{
                                borderWidth: activeMember.id === member.id ? 3 : 2,
                                borderColor: activeMember.id === member.id ? '#B9F6CA' : 'black',
                                shadowColor: '#000',
                                shadowOffset: { width: 4, height: 4 },
                                shadowOpacity: 1,
                                shadowRadius: 0,
                            }}
                        >
                            <Image
                                source={{ uri: member.image }}
                                className={`w-full h-full ${activeMember.id === member.id ? 'opacity-100' : 'opacity-60'}`}
                                style={{
                                    width: '125%',
                                    height: '125%',
                                    position: 'absolute',
                                    left: '-10%',
                                    top: '-12.5%'
                                }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

export default TeamSection;
