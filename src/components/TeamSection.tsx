import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Linking, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL = SCREEN_WIDTH < 380;
import { Instagram, Linkedin, Github } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import SmoothButton from './ui/SmoothButton';

// ─── Static font map ───────────────────────────────────────────────────────────
const FONTS = {
    NAME: 'Gilton',
    ROLE: 'Gilton',
    DESC: 'Softura',
    HEADER: 'Gilton',
} as const;

interface Member {
    id: number;
    name: string;
    role: string;
    desc: string;
    image: any;
    socials: { instagram?: string; linkedin?: string; github?: string };
    category: 'FACULTY' | 'CORE MEMBER';
}

// ─── Static data (module scope — stable reference forever) ─────────────────────
const TEAM_MEMBERS: Member[] = [
    {
        id: 1,
        name: "Mr. Nisarga Chand",
        role: "FACULTY LEAD",
        desc: "Assistant Professor, ECE, SOET",
        image: require('../../assets/team/Nisarga.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/nisarga-chand-48634667/", instagram: "https://www.instagram.com/nisarga_chand/" },
        category: 'FACULTY'
    },
    {
        id: 2,
        name: "Ms. Soodipa Chakraborty",
        role: "FACULTY LEAD",
        desc: "Assistant Professor, ECE, SOET",
        image: require('../../assets/team/Soodipa.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/soodipachakraborty/", instagram: "https://www.instagram.com/soodipa_c/" },
        category: 'FACULTY'
    },
    {
        id: 3,
        name: "Sudipto Barman",
        role: "FACULTY LEAD",
        desc: "Turning strategies into action with energy, coordination, and commitment.",
        image: require('../../assets/team/Sr.webp'),
        socials: { linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/sudipto.barman", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 4,
        name: "Mr. Prabhat Das",
        role: "TECH MENTOR",
        desc: "Assistant Professor, ECE, SOET",
        image: require('../../assets/team/Prabhat.webp'),
        socials: { linkedin: "https://linkedin.com/in/prabhatd/", github: "https://github.com/prabhatdash/" },
        category: 'FACULTY'
    },
    {
        id: 5,
        name: "Hrishav Dey",
        role: "EVENT ADVISOR",
        desc: "The force that turns bold ideas into flawlessly executed reality.",
        image: require('../../assets/team/Hrishav.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/hrishav-dey-60a8292aa/", instagram: "https://www.instagram.com/hrishav_02/" },
        category: 'CORE MEMBER'
    },
    {
        id: 6,
        name: "Digant Mishra",
        role: "ON-GROUND COORDINATOR",
        desc: "The go-to problem solver who keeps the action running seamlessly on the ground.",
        image: require('../../assets/team/Digant.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/digant-mishra-2b2990291/", instagram: "https://www.instagram.com/digantt._" },
        category: 'CORE MEMBER'
    },
    {
        id: 7,
        name: "Arijit De",
        role: "FINANCIAL LEAD",
        desc: "Driving partnerships and managing resources to power the fest's biggest ambitions.",
        image: require('../../assets/team/Arijit.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/arijit-de-ba1594358/", instagram: "https://instagram.com/arijit_.04" },
        category: 'CORE MEMBER'
    },
    {
        id: 8,
        name: "Snehasish Mondal",
        role: "OPERATIONS LEAD",
        desc: "The backbone of smooth workflows, ensuring every detail runs right on time.",
        image: require('../../assets/team/Snehasish.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/snehasish-mondal/", instagram: "https://www.instagram.com/sn3hasishhhhh/", github: "https://github.com/Snehasish321" },
        category: 'CORE MEMBER'
    },
    {
        id: 9,
        name: "Samriddhi Sinha",
        role: "DECORATIONS LEAD",
        desc: "Transforming spaces into immersive experiences that set the fest's mood.",
        image: require('../../assets/team/Samriddhi.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/samriddhi-sinha-555768280/", instagram: "https://www.instagram.com/samriddhibelike_/", github: "https://github.com/Samriddhie" },
        category: 'CORE MEMBER'
    },
    {
        id: 10,
        name: "Arnab Mandal",
        role: "SOCIAL MEDIA HEAD",
        desc: "Turning strategies into action with energy, coordination, and commitment.",
        image: require('../../assets/team/Arnab.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/arnab-mandal-4b61151a1/", instagram: "https://www.instagram.com/arna4b/", github: "https://github.com/arnaabh" },
        category: 'CORE MEMBER'
    },
    {
        id: 11,
        name: "Garima Roy",
        role: "DOCUMENTATIONS LEAD",
        desc: "The mind that captures every milestone and detail with clarity and precision.",
        image: require('../../assets/team/Garima.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/garima-roy-032277290/", instagram: "https://www.instagram.com/_garimaa.07_", github: "https://github.com/GarimaRoy07" },
        category: 'CORE MEMBER'
    },
    {
        id: 12,
        name: "Ashish R. Das",
        role: "TECH LEAD",
        desc: "19, full stack web3 dev, community lead @0DAY",
        image: require('../../assets/team/Ashish.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/arddev", instagram: "https://www.instagram.com/ashishh_rd_", github: "https://github.com/0day-Ashish" },
        category: 'CORE MEMBER'
    },
    {
        id: 13,
        name: "Subham Karmakar",
        role: "TECH SUPPORT",
        desc: "Architect of innovation, powering the fest with smart tech and seamless systems.",
        image: require('../../assets/team/Subham.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/subham12r", instagram: "https://www.instagram.com/5ubhamkarmakar", github: "https://github.com/subham12r" },
        category: 'CORE MEMBER'
    },
    {
        id: 14,
        name: "Abhisekh Singh",
        role: "APP DEVELOPMENT",
        desc: "Turning strategies into action with energy, coordination, and commitment.",
        image: require('../../assets/team/Abhishek.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/abhi3hekk/", instagram: "https://www.instagram.com/abhi3hekk/", github: "https://github.com/AbhishekS04/" },
        category: 'CORE MEMBER'
    },
    {id:15,
        name: "Tushar kanti Dey",
        role: "APP DEVELOPMENT",
        desc: "Turning complex ideas into scalable, production-ready solutions.",
        image: require('../../assets/team/Tushar.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/tushar-kanti-dey/", instagram: "https://www.instagram.com/tushardevx01", github: "https://github.com/tusharxhub" },
        category: 'CORE MEMBER'
    },
    {id:16,
        name: "Sayan Mukherjee",
        role: "APP DEVELOPMENT",
        desc: "Turning strategies into action with energy, coordination, and commitment.",
        image: require('../../assets/team/Sayan.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/sayan-mukherjee-258751356", instagram: "https://www.instagram.com/sa.yan1047", github: "https://github.com/Sani05M" },
        category: 'CORE MEMBER'},
    {
        id: 17,
        name: "Leeza Bhowal",
        role: "DESIGN LEAD",
        desc: "The creative spark behind visuals that give the fest its identity and vibe.",
        image: require('../../assets/team/Leeza.webp'),
        socials: { linkedin: "https://www.linkedin.com/in/leeza-bhowal/", instagram: "https://www.instagram.com/leeza_bhowal/", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 18,
        name: "Srijita Bera",
        role: "MARKETING LEAD",
        desc: "The voice of the fest, turning ideas into buzz and reach into impact.",
        image: require('../../assets/team/Srijita.webp'),
        socials: { linkedin: "https://linkedin.com/in/srijita-bera-ab5578291/", instagram: "https://instagram.com/veilof_mist", github: "https://github.com/Srijiiii" },
        category: 'CORE MEMBER'
    },
    {
        id: 19,
        name: "Siddartha Chakraborty",
        role: "ESPORTS LEAD",
        desc: "The strategist behind high-energy battles and next-level competitive gaming.",
        image: require('../../assets/team/Siddharth-01.webp'),
        socials: { linkedin: "https://linkedin.com/in/siddarthachakraborty/", instagram: "https://instagram.com/siddarthachk", github: "https://github.com/siddarthachk" },
        category: 'CORE MEMBER'
    },
    {
        id: 20,
        name: "Keshav Maheshwari",
        role: "EXECUTION CELL",
        desc: "The hands-on executor ensuring plans come alive with precision and speed.",
        image: require('../../assets/team/keshav.webp'),
        socials: { linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/keshav.maheshwari", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    {
        id: 21,
        name: "Sampad Ghosh",
        role: "EXECUTION CELL",
        desc: "Turning strategies into action with energy, coordination, and commitment.",
        image: require('../../assets/team/Sampad.webp'),
        socials: { linkedin: "https://linkedin.com/in/", instagram: "https://instagram.com/sampad.ghosh", github: "https://github.com/" },
        category: 'CORE MEMBER'
    },
    
    {
        id: 22,
        name: "Titas Sarkar",
        role: "EX SUPPORT",
        desc: "Building decentralized solutions that add a future-ready edge to the fest.",
        image: require('../../assets/team/Titas.webp'),
        socials: {},
        category: 'CORE MEMBER'
    },
    {
        id: 23,
        name: "Somnath Singha Roy",
        role: "EX SUPPORT",
        desc: "The dependable pillar ensuring help, coordination, and smooth resolutions for everyone.",
        image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Somnath',
        socials: { linkedin: "https://linkedin.com/in/somnath", instagram: "https://instagram.com/somnath" },
        category: 'CORE MEMBER'
    }
];

// ─── StyleSheet (module scope — zero per-render cost) ──────────────────────────
const S = StyleSheet.create({
    fontName: { fontFamily: FONTS.NAME },
    fontRole: { fontFamily: FONTS.ROLE },
    fontDesc: { fontFamily: FONTS.DESC },
    fontHeader: { fontFamily: FONTS.HEADER },
    // Main card
    mainCardMinH: { minHeight: 280 },
    // Avatar
    avatarImg: { width: '100%', height: '100%' },
    avatarBorder: { position: 'absolute', inset: 0, borderWidth: 2, borderColor: 'black', borderRadius: 16 },
    // Name row
    nameRow: { height: 28, justifyContent: 'center', marginBottom: 2, width: '100%' },
    // Role row
    roleRow: { height: 16, justifyContent: 'center', marginBottom: 8 },
    // Desc row
    descRow: { height: 36, marginBottom: 12, width: '100%' },
    // Thumbnail list
    thumbListH: { height: 65 },
    // Thumbnail base
    thumbActive: { width: 54, height: 54, borderWidth: 2, borderColor: '#000', opacity: 1 },
    thumbInactive: { width: 54, height: 54, borderWidth: 1, borderColor: 'rgba(0,0,0,0.3)', opacity: 0.7 },
    thumbImg: { width: '100%', height: '100%' },
    // Social button
    socialBtn: { width: 36, height: 36 },
    // FlatList content
    flatListContent: { paddingHorizontal: 4, gap: 8 },
});

// ─── Helpers ───────────────────────────────────────────────────────────────────
const PLACEHOLDER_URLS = new Set([
    '#', 'https://linkedin.com/in/', 'https://instagram.com/',
]);

const openLink = (url?: string) => {
    if (url && !PLACEHOLDER_URLS.has(url)) {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
};

const resolveImageSource = (image: any) =>
    typeof image === 'string' && (image.startsWith('http') || image.startsWith('https'))
        ? { uri: image }
        : image;

const keyExtractor = (item: Member) => String(item.id);

// ─── SocialButton (static, memoized) ──────────────────────────────────────────
const SocialButton = React.memo(({ children, onPress }: { children: React.ReactNode; onPress: () => void }) => (
    <SmoothButton
        onPress={onPress}
        containerStyle={S.socialBtn}
        buttonStyle="w-full h-full bg-white border-[2px] border-black rounded-lg items-center justify-center"
        shadowStyle="bg-black rounded-lg"
        depth={2}
    >
        {children}
    </SmoothButton>
));

// ─── ThumbnailItem (memoized — only re-renders when isActive flips) ────────────
const ThumbnailItem = React.memo(({ member, isActive, onSelect }: {
    member: Member; isActive: boolean; onSelect: (m: Member) => void;
}) => {
    const handlePress = useCallback(() => onSelect(member), [member, onSelect]);
    const source = useMemo(() => resolveImageSource(member.image), [member.image]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className="rounded-xl overflow-hidden bg-black relative"
            style={isActive ? S.thumbActive : S.thumbInactive}
        >
            <Image
                source={source}
                style={S.thumbImg}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={150}
                recyclingKey={`team-thumb-${member.id}`}
            />
        </TouchableOpacity>
    );
});

// ─── Main Component ────────────────────────────────────────────────────────────
const TeamSection = React.memo(() => {
    const [activeMember, setActiveMember] = useState<Member>(TEAM_MEMBERS[0]);

    const enterOpacity = useSharedValue(0);
    const enterTranslateY = useSharedValue(30);

    useEffect(() => {
        enterOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        enterTranslateY.value = withSpring(0, { damping: 14, stiffness: 100 });
    }, []);

    const entranceStyle = useAnimatedStyle(() => ({
        opacity: enterOpacity.value,
        transform: [{ translateY: enterTranslateY.value }],
    }));

    const handleMemberSelect = useCallback((member: Member) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveMember(member);
    }, []);

    // Stable social link callbacks derived from active member
    const openInstagram = useCallback(() => openLink(activeMember.socials.instagram), [activeMember.socials.instagram]);
    const openLinkedin = useCallback(() => openLink(activeMember.socials.linkedin), [activeMember.socials.linkedin]);
    const openGithub = useCallback(() => openLink(activeMember.socials.github), [activeMember.socials.github]);

    // Resolve main avatar source (memoized — only recalculates on member change)
    const avatarSource = useMemo(() => resolveImageSource(activeMember.image), [activeMember.image]);

    // FlatList renderItem (stable ref — ThumbnailItem handles its own memoization)
    const renderThumbnail = useCallback(({ item }: { item: Member }) => (
        <ThumbnailItem
            member={item}
            isActive={item.id === activeMember.id}
            onSelect={handleMemberSelect}
        />
    ), [activeMember.id, handleMemberSelect]);

    return (
        <Animated.View style={entranceStyle}>
        <View className={`bg-[#F3E5F5] rounded-[32px] mb-4 mx-2 border-2 border-black ${IS_SMALL ? 'px-3 py-5' : 'px-5 py-6'}`}>

            <View className="items-center mb-4">
                <Text className="text-2xl text-black uppercase" style={S.fontHeader}>MEET THE TEAM</Text>
                <View className="h-1 w-16 bg-black mt-1 rounded-full" />
            </View>

            {/* MAIN CARD */}
            <View className="items-center mb-6">
                <View className="relative w-full" style={S.mainCardMinH}>
                    <View className="absolute top-2 left-2 w-full h-full bg-black rounded-[24px]" />
                    <View
                        className="bg-white border-[3px] border-black rounded-[24px] p-4 w-full items-center relative overflow-hidden"
                        style={S.mainCardMinH}
                    >
                        <View className="w-20 h-20 bg-black rounded-[16px] mb-3 overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Image
                                source={avatarSource}
                                style={S.avatarImg}
                                contentFit="cover"
                                cachePolicy="memory-disk"
                                transition={200}
                                recyclingKey={`team-avatar-${activeMember.id}`}
                            />
                            <View style={S.avatarBorder} pointerEvents="none" />
                        </View>

                        <View style={S.nameRow}>
                            <Text
                                className="text-black text-center uppercase text-lg"
                                style={S.fontName}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {activeMember.name}
                            </Text>
                        </View>

                        <View style={S.roleRow}>
                            <Text className="text-[#8e99af] text-[10px] tracking-[0.1em] uppercase text-center" style={S.fontRole}>
                                {activeMember.role}
                            </Text>
                        </View>

                        <View style={S.descRow}>
                            <Text
                                className="text-black text-center text-xs leading-4 px-1"
                                style={S.fontDesc}
                                numberOfLines={2}
                            >
                                {activeMember.desc}
                            </Text>
                        </View>

                        <View className="flex-row gap-4 mt-auto">
                            <SocialButton onPress={openInstagram}>
                                <Instagram size={16} color="black" strokeWidth={2} />
                            </SocialButton>
                            <SocialButton onPress={openLinkedin}>
                                <Linkedin size={16} color="black" strokeWidth={2} />
                            </SocialButton>
                            <SocialButton onPress={openGithub}>
                                <Github size={16} color="black" strokeWidth={2} />
                            </SocialButton>
                        </View>
                    </View>
                </View>
            </View>

            {/* VIRTUALIZED THUMBNAIL LIST */}
            <View style={S.thumbListH}>
                <FlatList
                    data={TEAM_MEMBERS}
                    horizontal
                    keyExtractor={keyExtractor}
                    renderItem={renderThumbnail}
                    initialNumToRender={6}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    removeClippedSubviews
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={S.flatListContent}
                />
            </View>
        </View>
        </Animated.View>
    );
});

export default TeamSection;
