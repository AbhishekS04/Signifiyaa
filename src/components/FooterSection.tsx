import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import SmoothButton from './ui/SmoothButton';
import SponsorModal from './SponsorModal';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

const FooterSection = () => {
    const [isSponsorModalVisible, setSponsorModalVisible] = useState(false);
    return (
        <View className="bg-[#4ADE80] rounded-t-[30px] px-6 pt-5 pb-18 mt-[-30px] z-10">

            {/* Header - Reduced size */}
            <View className="mb-6">
                <Text className={`${isSmallDevice ? 'text-xl' : 'text-2xl'} text-black leading-tight uppercase`}
                    style={{
                        fontFamily: 'BBHBartle',
                    }}
                >
                    DOWNLOAD THE
                </Text>
                <Text className={`${isSmallDevice ? 'text-xl' : 'text-2xl'} text-black leading-tight uppercase`}
                    style={{
                        fontFamily: 'BBHBartle',
                    }}
                >
                    SIGNIFIYA
                </Text>
                <Text className={`${isSmallDevice ? 'text-xl' : 'text-2xl'} text-black leading-tight uppercase`}
                    style={{
                        fontFamily: 'BBHBartle',
                    }}
                >
                    APP
                </Text>
                <Text className={`${isSmallDevice ? 'text-xl' : 'text-2xl'} text-black leading-tight uppercase`}
                    style={{
                        fontFamily: 'BBHBartle',
                    }}
                >
                    RIGHT NOW.
                </Text>
            </View>

            {/* App Buttons - Proper Icons */}
            <View className="gap-3 mb-6 self-start">
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
            <View className="gap-2 mb-8">
                {['HOME', 'BECOME A SPONSOR', 'EVENTS', 'CONTACT', 'FAQ', 'RULES & REGULATIONS'].map((item) => (
                    <TouchableOpacity
                        key={item}
                        activeOpacity={1}
                        onPress={() => {
                            if (item === 'BECOME A SPONSOR') {
                                setSponsorModalVisible(true);
                            }
                        }}
                    >
                        <Text className={`${isSmallDevice ? 'text-lg' : 'text-xl'} text-black uppercase`}
                            style={{
                                fontFamily: 'Softura',
                            }}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <SponsorModal visible={isSponsorModalVisible} onClose={() => setSponsorModalVisible(false)} />

            {/* Footer Area */}
            <View className="relative">
                {/* Links */}
                <View className="gap-1 mb-6">
                    <TouchableOpacity><Text className="text-xs text-black"
                        style={{
                            fontFamily: 'Softura',
                        }}
                    >ASSETS</Text></TouchableOpacity>
                    <TouchableOpacity><Text className="text-xs text-black"
                        style={{
                            fontFamily: 'Softura',
                        }}
                    >PRIVACY NOTICE</Text></TouchableOpacity>
                    <TouchableOpacity><Text className="text-xs text-black"
                        style={{
                            fontFamily: 'Softura',
                        }}
                    >TERMS OF SERVICE</Text></TouchableOpacity>
                </View>

                {/* Copyright */}
                <Text className={`${isSmallDevice ? 'text-base' : 'text-lg'} text-black mb-6`}
                    style={{
                        fontFamily: 'Gilton',
                    }}
                >
                    © 2026 SIGNIFIYA, SOET.
                </Text>

                {/* Decorations */}
                {/* Cartoon Pencil - Positioned */}
                <View className={`absolute right-[-10px] bottom-0 ${isSmallDevice ? 'w-20 h-40' : 'w-24 h-48'} pointer-events-none`}>
                    <Image
                        source={{ uri: '.../assets/original/VikfqxN0JL.lottie' }}
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
    <SmoothButton
        containerStyle={{ minWidth: isSmallDevice ? 200 : 230 }}
        buttonStyle="bg-white border-[3px] border-black rounded-xl px-4 py-3 flex-row items-center gap-3"
        shadowStyle="bg-black rounded-xl"
        depth={6}
    >
        <View className="w-9 h-9 items-center justify-center">
            {icon}
        </View>
        <View className="flex-1">
            <Text className="text-[#00000] text-[9px] uppercase"
                style={{
                    fontFamily: 'Softura',
                }}
            >COMING SOON !</Text>
            <Text className="text-black text-base leading-4"
                style={{
                    fontFamily: 'Softura',
                }}
            >{storeName}</Text>
        </View>
    </SmoothButton>
);

// --- Icons ---

const PlayStoreIcon = () => (
    <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/888/888857.png' }}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
    />
);

const AppleIcon = () => (
    <Svg width={28} height={28} viewBox="0 0 384 512" fill="black">
        <Path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </Svg>
);

export default FooterSection;
