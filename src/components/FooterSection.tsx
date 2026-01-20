import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const FooterSection = () => {
    return (
        <View className="bg-[#4ADE80] rounded-t-[30px] px-6 py-8 mt-[-30px] z-10">

            {/* Header - Reduced size */}
            <View className="mb-6">
                <Text className="font-[ArchivoBlack_400Regular] text-3xl text-black leading-tight uppercase">
                    DOWNLOAD
                </Text>
                <Text className="font-[ArchivoBlack_400Regular] text-3xl text-black leading-tight uppercase">
                    THE SIGNIFIYA
                </Text>
                <Text className="font-[ArchivoBlack_400Regular] text-3xl text-black leading-tight uppercase">
                    APP RIGHT NOW.
                </Text>
            </View>

            {/* App Buttons - Proper Icons */}
            <View className="gap-4 mb-10 self-start">
                <AppStoreButton
                    storeName="Google Play"
                    icon={<PlayStoreIcon />}
                />
                <AppStoreButton
                    storeName="App Store"
                    icon={<AppleIcon />}
                />
            </View>

            {/* Main Menu - Compact spacing */}
            <View className="gap-2 mb-12">
                {['HOME', 'BECOME A SPONSOR', 'EVENTS', 'CONTACT', 'FAQ', 'RULES & REGULATIONS'].map((item) => (
                    <TouchableOpacity key={item} activeOpacity={0.7}>
                        <Text className="font-[ArchivoBlack_400Regular] text-xl text-black uppercase">
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Footer Area */}
            <View className="relative">
                {/* Links */}
                <View className="gap-1 mb-6">
                    <TouchableOpacity><Text className="font-[Inter_700Bold] text-xs text-black">ASSETS</Text></TouchableOpacity>
                    <TouchableOpacity><Text className="font-[Inter_700Bold] text-xs text-black">PRIVACY NOTICE</Text></TouchableOpacity>
                    <TouchableOpacity><Text className="font-[Inter_700Bold] text-xs text-black">TERMS OF SERVICE</Text></TouchableOpacity>
                </View>

                {/* Copyright */}
                <Text className="font-[Inter_700Bold] text-xs text-black mb-6">
                    © 2026 SIGNIFIYA, SOET.
                </Text>

                {/* Decorations */}
                {/* Cartoon Pencil - Positioned */}
                <View className="absolute right-[-10px] bottom-0 w-24 h-48 pointer-events-none">
                    <Image
                        source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/pencil-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--write-edit-tool-school-education-pack-miscellaneous-illustrations-4712039.png?f=webp' }}
                        className="w-full h-full"
                        resizeMode="contain"
                    />
                </View>

                {/* Scroll To Top Removed as requested */}

            </View>

        </View>
    );
};

// --- Subcomponents ---

const AppStoreButton = ({ storeName, icon }: { storeName: string, icon: React.ReactNode }) => (
    <TouchableOpacity
        className="bg-white border-[3px] border-black rounded-xl px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-row items-center gap-3 w-56"
        activeOpacity={0.8}
    >
        <View className="w-8 h-8 items-center justify-center">
            {icon}
        </View>
        <View>
            <Text className="font-[Inter_900Black] text-[#FF0055] text-[9px] uppercase">COMING SOON !</Text>
            <Text className="font-[Inter_900Black] text-black text-base leading-4">{storeName}</Text>
        </View>
    </TouchableOpacity>
);

// --- Icons ---

const PlayStoreIcon = () => (
    <Svg width={28} height={28} viewBox="0 0 24 24">
        <Path d="M5,5 L19,12 L5,19 V5 Z" fill="#000000" />
        <Path d="M3.7,1.8 L16.8,9.2 C17.2,9.4 17.5,9.8 17.5,10.2 C17.5,10.6 17.2,11 16.8,11.2 L3.7,18.6 C3.3,18.8 2.8,18.8 2.4,18.6 C2,18.4 1.8,18 1.8,17.6 L1.8,2.8 C1.8,2.4 2,2 2.4,1.8 C2.8,1.6 3.3,1.6 3.7,1.8 Z" fill="none" />
        <Path fill="#4285F4" d="M16.4,8.8 L4.5,2.1 C4.1,1.8 3.5,1.8 3,2.2 L10.8,10 L16.4,8.8 Z" />
        <Path fill="#34A853" d="M16.4,11.6 L10.8,10.4 L3,18.2 C3.5,18.6 4.1,18.6 4.5,18.3 L16.4,11.6 Z" />
        <Path fill="#FCBC04" d="M16.4,8.8 L10.8,10 L16.4,11.6 L20.8,9.2 C21.4,8.8 21.4,11.6 20.8,11.2 L16.4,8.8 Z" />
        <Path fill="#EA4335" d="M3,2.2 C2.7,2.5 2.5,3 2.5,3.5 L2.5,16.9 C2.5,17.4 2.7,17.9 3,18.2 L10.8,10.4 L3,2.2 Z" />
    </Svg>
);

const AppleIcon = () => (
    <Svg width={28} height={28} viewBox="0 0 384 512" fill="black">
        <Path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </Svg>
);

export default FooterSection;
