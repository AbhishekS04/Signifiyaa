import React, { useEffect, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Smile } from 'lucide-react-native';
import SmoothButton from './ui/SmoothButton';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

const S = StyleSheet.create({
    fontGilton: { fontFamily: 'Gilton' },
    fontSoftura: { fontFamily: 'Softura' },
    btnContainer: { alignSelf: 'flex-start' as const },
    btnInner: { paddingHorizontal: 32, paddingVertical: 16 },
});

const AboutSection = React.memo(() => {
    const navigation = useNavigation<any>();

    const handleGetPass = useCallback(() => {
        navigation.navigate('VisitorRegistration');
    }, [navigation]);

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

    return (
        <Animated.View style={entranceStyle}>
            <View className={`bg-[#F3E5F5] rounded-[30px] mb-4 mt-6 ${isSmallDevice ? 'p-6' : 'p-8'}`}>
                {/* Pale Pink Background, No Border, Larger Radius */}

                {/* Header Row */}
                <View className="flex-row justify-between items-start mb-6">
                    <View>

                        <Text className={`text-black uppercase leading-none mt-4 ${isSmallDevice ? 'text-2xl' : 'text-3xl'}`} style={S.fontGilton}>
                            ABOUT
                            SIGNIFIYA'26
                        </Text>

                    </View>

                    {/* Yellow Smiley Sticker */}
                    <View className="bg-[#FFEB3B] border-[3px] border-black rounded-full p-2 rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Smile size={32} color="black" strokeWidth={2.5} />
                    </View>
                </View>

                {/* Body Text */}
                <View className="mb-10">
                    <Text className={`text-black/80 text-base leading-7 ${isSmallDevice ? 'text-sm' : 'text-base'}`}
                        style={S.fontSoftura}>
                        Signifiya is not just an event; it's an experience. We bring together the brightest minds, the boldest creators, and the most passionate individuals for a celebration of innovation, art, and culture.
                    </Text>
                </View>

                {/* Button */}
                <SmoothButton
                    onPress={handleGetPass}
                    containerStyle={S.btnContainer}
                    buttonStyle="bg-black rounded-full"
                    shadowStyle="bg-gray-800 rounded-full"
                    depth={3}
                    innerButtonStyle={S.btnInner}
                >
                    <Text className="text-white text-sm uppercase tracking-widest"
                        style={S.fontSoftura}>
                        GET VISITOR'S PASS
                    </Text>
                </SmoothButton>

                {/* Footer Note */}
                <Text className="text-gray-600 text-[10px] leading-3 mt-6 ml-1"
                    style={S.fontSoftura}>
                    * Students participating in any Signifiya event do not need a visitor's pass.
                </Text>
            </View>
        </Animated.View>
    );
});

export default AboutSection;

