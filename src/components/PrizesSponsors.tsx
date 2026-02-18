import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image as RNImage } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import SmoothButton from './ui/SmoothButton';
import SponsorModal from './SponsorModal';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    withSequence,
    Easing,
    interpolate
} from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');
const isSmallDevice = width < 380;

// Realistic Paper Money with Curved Bend and Natural Physics
const MoneyBill = React.memo(({
    delay,
    startX,
    drift,
    size,
    opacity,
    swaySpeed,
    turbulence
}: {
    delay: number;
    startX: number;
    drift: number;
    size: number;
    opacity: number;
    swaySpeed: number;
    turbulence: number;
}) => {
    const translateY = useSharedValue(-100);
    const translateX = useSharedValue(0);
    const rotateZ = useSharedValue(0); // Only gentle flutter

    useEffect(() => {
        // Faster falling for smooth flow effect
        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(height + 150, {
                    duration: 4000 + Math.random() * 2000, // 4-6 seconds (much faster)
                    easing: Easing.bezier(0.42, 0, 0.58, 1),
                }),
                -1,
                false
            )
        );

        // Gentle horizontal drift (minimal)
        translateX.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(drift * 0.3, {
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    withTiming(-drift * 0.3, {
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                    })
                ),
                -1,
                true
            )
        );

        // Subtle flutter only (no complex 3D rotations)
        rotateZ.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(8, {
                        duration: 1200,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    withTiming(-8, {
                        duration: 1200,
                        easing: Easing.inOut(Easing.sin),
                    })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { translateX: translateX.value },
                { rotateZ: `${rotateZ.value}deg` }, // Only subtle flutter
            ],
        };
    });

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: 'absolute',
                    left: startX,
                    width: 44 * size,
                    height: 22 * size,
                    opacity: opacity,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                }
            ]}
            className="bg-[#4CAF50] rounded-sm"
        >
            {/* Rupee note with detail */}
            <View className="w-full h-full border-2 border-[#2E7D32] items-center justify-center bg-gradient-to-br from-[#66BB6A] to-[#4CAF50]">
                <Text style={{ fontSize: 12 * size }} className="font-bold text-white">₹</Text>
            </View>
        </Animated.View>
    );
});

const PrizesSponsors = () => {
    // Reduced from 25 to 12 bills — imperceptible visual difference, halves animation load
    // 75 shared values → 36 shared values = 52% less UI thread work
    const moneyBills = React.useMemo(() => Array.from({ length: 12 }, (_, i) => {
        const wave = Math.floor(i / 4); // Smaller waves of 4 bills
        const positionInWave = i % 4;

        return {
            delay: wave * 3000 + positionInWave * 200,
            startX: (Math.random() * (width - 60)),
            drift: 40 + Math.random() * 50,
            size: 0.7 + Math.random() * 0.4,
            opacity: 0.4 + Math.random() * 0.35,
            swaySpeed: 3000 + Math.random() * 2000,
            turbulence: 10 + Math.random() * 20,
        };
    }), []);

    // ============================================
    // SPONSORS DATA (Easy to update)
    // ============================================
    // how to use:
    // 1. Upload your logo to `assets/sponsors/google.png`
    // 2. Import it: `import googleLogo from '../../assets/sponsors/google.png'`
    // 3. Or use a URL: `logo: 'https://example.com/logo.png'`
    const SPONSORS: any[] = [
        // Royal Enfield and Dada Boudi removed
    ];

    const COMMUNITY_PARTNERS = [
        { name: 'CSI', logo: require('../../assets/Sponsors/Spnl1.avif') },
        { name: 'ACM', logo: require('../../assets/Sponsors/Spnl2.avif') },
        { name: 'Cerkle', logo: require('../../assets/Sponsors/Spnl3.avif') },
    ];

    const [isSponsorModalVisible, setSponsorModalVisible] = useState(false);

    return (
        <View className="w-full pb-8">
            {/* Section A: Prize Pool Card with Floating Money */}
            <View className="bg-[#E8EAF6] rounded-3xl p-8 items-center relative overflow-hidden border-[3px] border-black shadow-sm mb-6">

                {/* ULTRA-LIGHT FLOATING MONEY ANIMATION */}
                {moneyBills.map((bill, index) => (
                    <MoneyBill
                        key={index}
                        delay={bill.delay}
                        startX={bill.startX}
                        drift={bill.drift}
                        size={bill.size}
                        opacity={bill.opacity}
                        swaySpeed={bill.swaySpeed}
                        turbulence={bill.turbulence}
                    />
                ))}

                {/* Content (Above the money rain) */}
                <View className="z-10">
                    {/* Massive Typography Block */}
                    <View className="items-center mb-4">
                        <Text className={`leading-[50px] text-black ${isSmallDevice ? 'text-[30px]' : 'text-[50px]'}`}
                            style={{
                                fontFamily: 'BBHBartle',
                            }}
                        >
                            200K+
                        </Text>
                        <Text className={`leading-[50px] text-black -mt-2 ${isSmallDevice ? 'text-[30px]' : 'text-[50px]'}`}
                            style={{
                                fontFamily: 'BBHBartle',
                            }}
                        >
                            INR
                        </Text>
                        <Text className="text-xl text-black mt-1 tracking-widest uppercase"
                            style={{
                                fontFamily: 'Gilton',
                            }}>
                            IN PRIZE POOL
                        </Text>
                    </View>

                    {/* Footer Text with sparkle */}
                    <Text className="text-gray-800 text-center uppercase text-sm tracking-wide"
                        style={{
                            fontFamily: 'Softura',
                        }}>
                        GOODIES, MERCHES &{'\n'}MANY MORE...
                    </Text>
                </View>
            </View>

            {/* Section B: Our Sponsors Card */}
            <View className="bg-white rounded-3xl p-6 border-[3px] border-black shadow-sm">

                {/* Header */}
                <View className="items-center mb-4">
                    <View className="flex-row items-baseline">
                        <View className="items-center">
                            <Text className={`text-black ${isSmallDevice ? 'text-4xl' : 'text-5xl'}`} style={{
                                fontFamily: 'Gilton',
                            }}>CURRENT</Text>
                            <Text className={`text-black -mt-2 ${isSmallDevice ? 'text-4xl' : 'text-5xl'}`} style={{
                                fontFamily: 'Gilton',
                            }}>SPONSORS</Text>
                        </View>
                    </View>
                    <Text className="text-gray-500 text-lg mt-1 text-center" style={{
                        fontFamily: 'Softura',
                    }}>
                        Powered by the best in the industry
                    </Text>
                </View>

                {/* Horizontal Separator Line */}
                <View className="w-full h-[3px] bg-black my-8" />

                {/* COMMUNITY PARTNERS SECTION */}
                <View className="items-center mb-10">
                    <Text className="text-black text-4xl uppercase" style={{ fontFamily: 'Gilton' }}>
                        COMMUNITY
                    </Text>
                    <Text className="text-black text-4xl uppercase -mt-2" style={{ fontFamily: 'Gilton', transform: [{ skewX: '-10deg' }] }}>
                        PARTNERS
                    </Text>
                </View>

                {/* Community Partner Logos - Vertical Layout as per image */}
                <View className="items-center gap-12 mb-10">
                    {COMMUNITY_PARTNERS.map((partner, index) => (
                        <View
                            key={index}
                            className="w-40 h-24 items-center justify-center"
                        >
                            <ExpoImage
                                source={
                                    typeof partner.logo === 'string' && (partner.logo.startsWith('http') || partner.logo.startsWith('https'))
                                        ? { uri: partner.logo }
                                        : partner.logo
                                }
                                style={{ width: '100%', height: '100%' }}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                                transition={200}
                            />
                        </View>
                    ))}
                </View>

                {/* Original Sponsor Grid (Hidden or Empty for now as per request) */}
                {SPONSORS.length > 0 && (
                    <View className="flex-row flex-wrap justify-center gap-8 mb-10 pt-4">
                        {SPONSORS.map((sponsor, index) => (
                            <View
                                key={index}
                                className="w-[45%] h-32 items-center justify-center p-0"
                            >
                                <ExpoImage
                                    source={{ uri: sponsor.logo }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="contain"
                                    cachePolicy="memory-disk"
                                    transition={200}
                                />
                            </View>
                        ))}
                    </View>
                )}

                {/* Action Button */}
                <SmoothButton
                    onPress={() => setSponsorModalVisible(true)}
                    containerStyle={{ width: '100%' }}
                    buttonStyle="bg-black py-4 rounded-full items-center"
                    shadowStyle="bg-black rounded-full"
                    depth={1}
                >
                    <Text className="text-white text-lg"
                        style={{
                            fontFamily: 'Softura',
                        }}>
                        BECOME A SPONSOR
                    </Text>
                </SmoothButton>

                <SponsorModal visible={isSponsorModalVisible} onClose={() => setSponsorModalVisible(false)} />

            </View>
        </View>
    );
};

export default React.memo(PrizesSponsors);
