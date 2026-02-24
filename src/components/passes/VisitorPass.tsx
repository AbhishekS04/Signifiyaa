import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { X, Download } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';

interface VisitorPassProps {
    data: any;
    userName: string;
    bookingId: string;
    onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VisitorPass = ({ data, userName, bookingId, onClose }: VisitorPassProps) => {
    const currentBookingId = data.userBookingId || bookingId;

    // Pass type label
    let passTypeLabel = 'Visitor Pass';
    if (data.passType === 'Single Day Pass' || data.passType === 'day 1 pass' || data.passType === 'day1' || data.passType === 'single') passTypeLabel = 'Single Day Pass';
    else if (data.passType === 'Double Day Pass' || data.passType === 'day 2 pass' || data.passType === 'dual' || data.passType === 'combo' || data.passType === 'double') passTypeLabel = 'Double Day Pass';
    else passTypeLabel = data.passType || 'Visitor Pass';

    // QR value - only Booking ID
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentBookingId || '')}&bgcolor=ffffff&color=000000&margin=0`;

    // Video Player
    const videoSource = require('../../../assets/bg.mp4');
    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = true;
        player.muted = true;
        player.play();
    });

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            className="w-full max-w-[380px]"
        >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-4 px-2">
                <Text style={{ fontFamily: 'Gilton' }} className="text-white text-2xl">
                    My Pass
                </Text>
                <View className="flex-row gap-3">
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20">
                        <Download color="white" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20"
                    >
                        <X color="white" size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* The Pass Card */}
            <View style={styles.glowBorder}>
                <View style={styles.cardContainer}>
                    {/* Top Section: Video & Mascot */}
                    <View className="h-[220px] relative overflow-hidden">
                        <VideoView
                            style={StyleSheet.absoluteFill}
                            player={player}
                            contentFit="cover"
                            nativeControls={false}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(10,10,10,0.8)', '#0a0a0a']}
                            className="absolute inset-0"
                        />

                        {/* Logo */}
                        <Image
                            source={require('../../../assets/bglogo.png')}
                            style={styles.logo}
                            contentFit="contain"
                        />

                        {/* Robot Mascot */}
                        <Image
                            source={require('../../../assets/robo.webp')}
                            style={styles.mascot}
                            contentFit="contain"
                        />

                        {/* Signifiya Text */}
                        <View className="absolute bottom-4 left-6">
                            <Text className="text-white/60 text-sm font-bold tracking-tighter">
                                Signifiya <Text className="text-white/80">2026</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Bottom Section: Info */}
                    <View className="bg-[#0a0a0a] p-6 pt-2">
                        <View className="flex-row items-center gap-1 mb-6">
                            <Text className="text-zinc-500 text-lg font-bold tracking-tighter">Pass :</Text>
                            <Text className="text-zinc-400 text-lg font-semibold tracking-tighter">
                                {passTypeLabel}
                            </Text>
                        </View>

                        <Text className="text-white text-4xl font-bold tracking-tighter mb-8 leading-none">
                            {userName}
                        </Text>

                        {/* QR and IDs */}
                        <View className="flex-row items-center gap-6">
                            <View className="p-2 bg-white rounded-lg">
                                <Image
                                    source={{ uri: qrUrl }}
                                    style={{ width: 100, height: 100 }}
                                    contentFit="contain"
                                />
                            </View>

                            <View className="flex-1 gap-4">
                                <View>
                                    <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Booking ID</Text>
                                    <Text className="text-white text-sm font-bold tracking-tighter uppercase">
                                        {currentBookingId}
                                    </Text>
                                </View>
                                <Text className="text-zinc-600 text-[10px] leading-tight">
                                    Scan QR or use Booking ID at entry.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    glowBorder: {
        borderRadius: 24,
        padding: 4,
        backgroundColor: '#d400ff',
        // Creating the blue glow effect
        shadowColor: 'rgba(0,0,255,1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 15,
    },
    cardContainer: {
        backgroundColor: '#0a0a0a',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    logo: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 50,
        height: 50,
        opacity: 0.8,
    },
    mascot: {
        position: 'absolute',
        top: 20,
        right: 0,
        width: 200,
        height: 200,
        zIndex: 10,
    },
});

export default VisitorPass;
