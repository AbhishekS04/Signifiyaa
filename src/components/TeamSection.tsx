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
    image: any;
    socials: { instagram?: string; linkedin?: string; github?: string };
    category: 'FACULTY' | 'CORE MEMBER';
}

// ONLY CORE MEMBERS KEPT
const TEAM_MEMBERS: Member[] = [
    {
        id: 27,
        name: "Mr. Nisarga Chand",
        role: "FACULTY LEAD",
        desc: "Assistant Professor, ECE, SOET",
        image: require('../../assets/team/Nisarga.webp'),
        socials: { linkedin: "https://linkedin.com/in/hrishav-dey-2b2990291/", instagram: "https://instagram.com/hrishav.dey", github: "https://github.com/" },
        category: 'FACULTY'
    },
    {
        id: 26,
        name: "Ms. Soodipa Chakraborty",
        role: "FACULTY LEAD",
        desc: "Assistant Professor, ECE, SOET",
        image: require('../../assets/team/Soodipa.webp'),
        socials: { linkedin: "https://linkedin.com/in/hrishav-dey-2b2990291/", instagram: "https://instagram.com/hrishav.dey", github: "https://github.com/" },
        category: 'FACULTY'
    },
    {
        id: 28,
        name: "Mr. Prabhat Das",
        role: "TECH MENTOR",
        desc: "Assistant Professor, ECE, SOET",
        image: require('../../assets/team/Prabhat.webp'),
        socials: { linkedin: "https://linkedin.com/in/prabhatd/", instagram: "https://instagram.com/hrishav.dey", github: "https://github.com/" },
        category: 'FACULTY'
    },
    {
        id: 8,
        name: "Hrishav Dey",
        role: "EVENT ADVISOR",
        desc: "The force that turns bold ideas into flawlessly executed reality.",
        image: require('../../assets/avatar/avatar4.webp'),
        socials: { linkedin: "https://linkedin.com/in/hrishav-dey-2b2990291/", instagram: "https://instagram.com/hrishav.dey" },
        category: 'CORE MEMBER'
    },
    {
        id: 10,
        name: "Digant Mishra",
        role: "ON-GROUND COORDINATOR",
        desc: "The go-to problem solver who keeps the action running seamlessly on the ground.",
        image: require('../../assets/team/Digant.webp'),
        socials: { linkedin: "https://linkedin.com/in/digant-mishra-2b2990291/", instagram: "https://instagram.com/digantt._" },
        category: 'CORE MEMBER'
    },
    {
        id: 11,
        name: "Arijit De",
        role: "FINANCIAL LEAD",
        desc: "Driving partnerships and managing resources to power the fest’s biggest ambitions.",
        image: require('../../assets/team/Arijit.webp'),
        socials: { linkedin: "https://linkedin.com/in/arijit-de-ba1594358", instagram: "https://instagram.com/arijit_.04" },
        category: 'CORE MEMBER'
    },
    {
        id: 12,
        name: "Snehasish Mondal",
        role: "OPERATIONS LEAD",
        desc: "The backbone of smooth workflows, ensuring every detail runs right on time.",
        image: require('../../assets/team/Snehasish.webp'),
        socials: { linkedin: "https://linkedin.com/in/snehasish-mondal-2b2990291/", instagram: "https://instagram.com/snehasish.mondal", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 18,
        name: "Samriddhi Sinha",
        role: "DECORATIONS LEAD",
        desc: "Transforming spaces into immersive experiences that set the fest’s mood.",
        image: require('../../assets/team/Samriddhi.webp'),
        socials: { linkedin: "https://linkedin.com/in/samriddhi-sinha-2b2990291/", instagram: "https://instagram.com/samriddhi.sinha", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 25,
        name: "Arnab Mandal",
        role: "SOCIAL MEDIA HEAD",
        desc: "Turning strategies into action with energy, coordination, and commitment.",
        image: require('../../assets/team/Arnab.webp'),
        socials: { linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/arnab_mandal", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 20,
        name: "Ashish R. Das",
        role: "TECH LEAD",
        desc: "19, full stack web3 dev, community lead @0DAY",
        image: require('../../assets/team/Ashish.webp'),
        socials: { linkedin: "https://linkedin.com/in/arddev", instagram: "https://instagram.com/ashishh_rd_", github: "https://github.com/0day-Ashish" },
        category: 'CORE MEMBER'
    },
    {
        id: 23,
        name: "Subham Karmakar",
        role: "TECH SUPPORT",
        desc: "Architect of innovation, powering the fest with smart tech and seamless systems.",
        image: require('../../assets/team/Subham.webp'),
        socials: { linkedin: "https://linkedin.com/in/subham12r", instagram: "https://instagram.com/5ubhamkarmakar", github: "https://github.com/subham12r" },
        category: 'CORE MEMBER'
    },
    {
        id: 24,
        name: "Abhisekh Singh",
        role: "APP DEVELOPMENT",
        desc: "Turning strategies into action with energy, coordination, and commitment.",
        image: require('../../assets/team/Abhishek.webp'),
        socials: { linkedin: "https://linkedin.com/in/abhisekhsingh", instagram: "https://instagram.com/abhisekhsingh", github: "https://github.com/abhisekhsingh" },
        category: 'CORE MEMBER'
    },
    {
        id: 13,
        name: "Garima Roy",
        role: "DOCUMENTATIONS LEAD",
        desc: "The mind that captures every milestone and detail with clarity and precision.",
        image: require('../../assets/team/Garima.webp'),
        socials: { linkedin: "https://linkedin.com/in/garima-roy-032277290", instagram: "https://instagram.com/_garimaa.07_", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 14,
        name: "Leeza Bhowal",
        role: "DESIGN LEAD",
        desc: "The creative spark behind visuals that give the fest its identity and vibe.",
        image: require('../../assets/team/Leeza.webp'),
        socials: { linkedin: "https://linkedin.com/in/leeza-bhowal-2b2990291/", instagram: "https://instagram.com/leeza.bhowal", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 16,
        name: "Srijita Bera",
        role: "MARKETING LEAD",
        desc: "The voice of the fest, turning ideas into buzz and reach into impact.",
        image: require('../../assets/team/Srijita.webp'),
        socials: { linkedin: "https://linkedin.com/in/srijita-bera-ab5578291/", instagram: "https://instagram.com/veilof_mist", github: "https://github.com/Srijiiii" },
        category: 'CORE MEMBER'
    },
    {
        id: 17,
        name: "Siddartha Chakraborty",
        role: "ESPORTS LEAD",
        desc: "The strategist behind high-energy battles and next-level competitive gaming.",
        image: require('../../assets/team/Siddharth-01.webp'),
        socials: { linkedin: "https://linkedin.com/in/siddarthachakraborty/", instagram: "https://instagram.com/siddarthachk", github: "https://github.com/siddarthachk" },
        category: 'CORE MEMBER'
    },
    {
        id: 21,
        name: "Keshav Maheshwari",
        role: "EXECUTION CELL",
        desc: "The hands-on executor ensuring plans come alive with precision and speed.",
        image: require('../../assets/avatar/avatar7.webp'),
        socials: { linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/keshav.maheshwari", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 22,
        name: "Sampad Ghosh",
        role: "EXECUTION CELL",
        desc: "Turning strategies into action with energy, coordination, and commitment.",
        image: require('../../assets/avatar/avatar8.webp'),
        socials: { linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/sampad.ghosh", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 9,
        name: "Sudipto Barman",
        role: "EX SUPPORT",
        desc: "Turning strategies into action with energy, coordination, and commitment.",
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Sudipto',
        socials: { linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/sudipto.barman", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 19,
        name: "Titas Sarkar",
        role: "EX SUPPORT",
        desc: "Building decentralized solutions that add a future-ready edge to the fest.",
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Titas',
        socials: {},
        category: 'CORE MEMBER'
    },
    {
        id: 15,
        name: "Somnath Singha Roy",
        role: "EX SUPPORT",
        desc: "The dependable pillar ensuring help, coordination, and smooth resolutions for everyone.",
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Somnath',
        socials: { linkedin: "https://linkedin.com/in/somnath", instagram: "https://instagram.com/somnath" },
        category: 'CORE MEMBER'
    }
];

const CORE_MEMBERS = TEAM_MEMBERS;

const TeamSection = () => {
    const [activeMember, setActiveMember] = useState<Member>(CORE_MEMBERS[0]);

    const openLink = (url?: string) => {
        if (url && url !== '#' && url !== 'https://linkedin.com/in/' && url !== 'https://instagram.com/') {
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
                                source={typeof activeMember.image === 'string' ? { uri: activeMember.image } : activeMember.image}
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
                                    source={typeof member.image === 'string' ? { uri: member.image } : member.image}
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
