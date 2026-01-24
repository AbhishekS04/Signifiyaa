import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Linking, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;
import { Instagram, Linkedin, Github } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import SmoothButton from './ui/SmoothButton';

const SECTION_FONTS = {
    NAME: 'Gilton',
    ROLE: 'Gilton',
    DESCRIPTION: 'Softura',
    MEMBER_LIST: 'Softura',
    SECTION_HEADER: 'Gilton',
};

interface Member {
    id: number;
    name: string;
    role: string;
    desc: string;
    image: string;
    socials: { instagram: string; linkedin: string; github: string };
    category: 'CORE MEMBER';
}

// ONLY CORE MEMBERS KEPT
const TEAM_MEMBERS: Member[] = [
    {
        id: 1,
        name: 'Ashish Yadav',
        role: 'BLOCKCHAIN DEV',
        desc: 'Developing smart contracts and securing decentralized applications.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Ashish',
        socials: { instagram: 'https://instagram.com/ashish', linkedin: 'https://linkedin.com/in/ashish', github: 'https://github.com/ashish' },
        category: 'CORE MEMBER'
    },
    {
        id: 2,
        name: 'Garima Roy',
        role: 'FRONTEND DEV',
        desc: 'Building beautiful, responsive, and interactive user interfaces.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Garima',
        socials: { instagram: 'https://instagram.com/garima', linkedin: 'https://linkedin.com/in/garima', github: 'https://github.com/garima' },
        category: 'CORE MEMBER'
    },
    {
        id: 3,
        name: 'Leeza Bhowal',
        role: 'UI/UX DESIGNER',
        desc: 'Crafting intuitive user experiences and stunning visual designs.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Leeza',
        socials: { instagram: 'https://instagram.com/leeza', linkedin: 'https://linkedin.com/in/leeza', github: 'https://github.com/leeza' },
        category: 'CORE MEMBER'
    },
    {
        id: 4,
        name: 'Somnath Singha',
        role: 'BACKEND DEV',
        desc: 'Managing servers, APIs, and database architecture efficiency.',
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Somnath',
        socials: { instagram: 'https://instagram.com/somnath', linkedin: 'https://linkedin.com/in/somnath', github: 'https://github.com/somnath' },
        category: 'CORE MEMBER'
    },
];

const CORE_MEMBERS = TEAM_MEMBERS;

const TeamSection = () => {
    const [activeMember, setActiveMember] = useState<Member>(CORE_MEMBERS[0]);

    const openLink = (url: string) => {
        if (url && url !== '#') {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        }
    };

    const handleMemberSelect = (member: Member) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveMember(member);
    };

    return (
        <View className={`bg-[#F3E5F5] rounded-[32px] mb-4 mx-2 border-2 border-black ${isSmallDevice ? 'px-3 py-5' : 'px-5 py-6'}`}>

            <View className="items-center mb-4">
                <Text className="text-2xl text-black uppercase" style={{ fontFamily: SECTION_FONTS.SECTION_HEADER }}>
                    MEET THE TEAM
                </Text>
                <View className="h-1 w-16 bg-black mt-1 rounded-full" />
            </View>

            {/* COMPACT MAIN CARD */}
            <View className="items-center mb-6">
                <View className="relative w-full" style={{ minHeight: 280 }}>
                    <View className="absolute top-2 left-2 w-full h-full bg-black rounded-[24px]" />
                    <View
                        className="bg-white border-[3px] border-black rounded-[24px] p-4 w-full items-center relative overflow-hidden"
                        style={{ minHeight: 280 }}
                    >
                        <View className="w-20 h-20 bg-black rounded-[16px] mb-3 overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Image
                                source={{ uri: activeMember.image }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                resizeMode="cover"
                            />
                            <View
                                style={{ position: 'absolute', inset: 0, borderWidth: 2, borderColor: 'black', borderRadius: 16 }}
                                pointerEvents="none"
                            />
                        </View>

                        <View style={{ height: 28, justifyContent: 'center', marginBottom: 2, width: '100%' }}>
                            <Text
                                className={`text-black text-center uppercase text-lg`}
                                style={{ fontFamily: SECTION_FONTS.NAME }}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {activeMember.name}
                            </Text>
                        </View>

                        <View style={{ height: 16, justifyContent: 'center', marginBottom: 8 }}>
                            <Text className="text-[#8e99af] text-[10px] tracking-[0.1em] uppercase text-center" style={{ fontFamily: SECTION_FONTS.ROLE }}>
                                {activeMember.role}
                            </Text>
                        </View>

                        <View style={{ height: 36, marginBottom: 12, width: '100%' }}>
                            <Text
                                className="text-black text-center text-xs leading-4 px-1"
                                style={{ fontFamily: SECTION_FONTS.DESCRIPTION }}
                                numberOfLines={2}
                            >
                                {activeMember.desc}
                            </Text>
                        </View>

                        <View className="flex-row gap-4 mt-auto">
                            <SocialButton onPress={() => openLink(activeMember.socials.instagram)}>
                                <Instagram size={16} color="black" strokeWidth={2} />
                            </SocialButton>
                            <SocialButton onPress={() => openLink(activeMember.socials.linkedin)}>
                                <Linkedin size={16} color="black" strokeWidth={2} />
                            </SocialButton>
                            <SocialButton onPress={() => openLink(activeMember.socials.github)}>
                                <Github size={16} color="black" strokeWidth={2} />
                            </SocialButton>
                        </View>
                    </View>
                </View>
            </View>

            {/* CORE TEAM LIST ONLY */}
            <View>
                {/* No Text Header needed since it's the only team */}
                <View style={{ height: 65 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerClassName="px-1 gap-2"
                    >
                        {CORE_MEMBERS.map((member) => (
                            <TouchableOpacity
                                key={member.id}
                                onPress={() => handleMemberSelect(member)}
                                activeOpacity={0.7}
                                className="rounded-xl overflow-hidden bg-black relative"
                                style={{
                                    width: 54, // Slightly larger as requested "bit big"
                                    height: 54,
                                    borderWidth: activeMember.id === member.id ? 2 : 1,
                                    borderColor: activeMember.id === member.id ? '#000' : 'rgba(0,0,0,0.3)',
                                    opacity: activeMember.id === member.id ? 1 : 0.7,
                                }}
                            >
                                <Image
                                    source={{ uri: member.image }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

// Extracted Social Button
const SocialButton = ({ children, onPress }: { children: React.ReactNode, onPress: () => void }) => (
    <SmoothButton
        onPress={onPress}
        containerStyle={{ width: 36, height: 36 }} // w-9 = 36px
        buttonStyle="w-full h-full bg-white border-[2px] border-black rounded-lg items-center justify-center"
        shadowStyle="bg-black rounded-lg"
        depth={2}
    >
        {children}
    </SmoothButton>
);

export default TeamSection;
