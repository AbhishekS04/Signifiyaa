import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Linking, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;
import { ArrowUpRight } from 'lucide-react-native';

const S = StyleSheet.create({
    fontGilton: { fontFamily: 'Gilton' },
    fontSoftura: { fontFamily: 'Softura' },
});

const CERKLE_URL = 'https://vybecerkle.com/';

const NewsletterSupport = React.memo(() => {
    const navigation = useNavigation();

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

    const handleOpenCerkle = useCallback(() => Linking.openURL(CERKLE_URL), []);
    const handleGetSupport = useCallback(() => navigation.navigate('ContactSupport' as never), [navigation]);

    return (
        <Animated.View style={entranceStyle}>
            <View
                className="px-2 mb-10 gap-6"
            >

                {/* --- Card 1: Newsletter (Purple) --- */}
                <View className={`bg-[#E1BEE7] rounded-[30px] pb-12 ${isSmallDevice ? 'p-6' : 'p-8'}`}>

                    {/* Header Typography Mix */}
                    <View className="mb-4">
                        <Text className={`text-black leading-[0.9] ${isSmallDevice ? 'text-4xl' : 'text-5xl'}`}>
                            <Text style={S.fontGilton}>OUR </Text>
                            <Text style={S.fontGilton}>OFFICIAL</Text>
                        </Text>
                        <Text className={`text-black leading-[0.9] ${isSmallDevice ? 'text-4xl' : 'text-5xl'}`}>
                            <Text style={S.fontGilton}>COMMUNITY</Text>
                        </Text>
                        <Text className={`text-black leading-[0.9] -mt-1 ${isSmallDevice ? 'text-4xl' : 'text-5xl'}`}>
                            <Text style={S.fontGilton}>PARTNER </Text>
                        </Text>
                    </View>

                    {/* Subtext */}
                    <Text className="font-[Inter_500Medium] text-black text-base mb-8 leading-5"
                        style={S.fontSoftura}
                    >
                        Join our community partner Cerkle to connect with fellow attendees and stay updated!
                    </Text>

                    {/* Input Field
                <View className="bg-white rounded-full h-14 px-6 justify-center border-2 border-black mb-4"
                >
                    <TextInput
                        placeholder="Your email address"
                        placeholderTextColor="#9CA3AF"
                        className="font-[Inter_400Regular] text-black text-lg h-full"
                        value={email}
                        onChangeText={setEmail}
                        style={{
                            fontFamily: 'Softura',
                        }}
                    />
                </View> */}

                    {/* Subscribe Button */}
                    <TouchableOpacity
                        className="bg-black rounded-full h-14 flex-row justify-center items-center gap-2 mb-3/"
                        activeOpacity={0.8}
                        onPress={handleOpenCerkle}
                    >
                        <Text className="text-white text-lg tracking-widest uppercase"
                            style={S.fontSoftura}
                        >
                            JOIN CERKLE
                        </Text>
                        <ArrowUpRight size={24} color="white" strokeWidth={3} />
                    </TouchableOpacity>

                    {/* Checkbox Row
                <TouchableOpacity
                    className="flex-row items-center gap-3"
                    onPress={() => setAgreed(!agreed)}
                    activeOpacity={1}
                >
                    <View className={`w-5 h-5 border-2 border-black rounded-sm items-center justify-center ${agreed ? 'bg-black' : 'bg-transparent'}`}>
                        {agreed && <View className="w-2 h-2 bg-white rounded-[1px]" />}
                    </View>
                    <Text className="text-xs text-black shrink"
                    // style={{
                    //     fontFamily: 'Softura',
                    // }}
                    >
                        I agree to receive communications from SIGNIFIYA'26.
                    </Text>
                </TouchableOpacity> */}
                </View>


                {/* --- Card 2: Support Section (Blue) --- */}
                <View className={`bg-[#448AFF] rounded-[30px] pb-12 ${isSmallDevice ? 'p-6' : 'p-8'}`}>

                    {/* Header Typography Mix */}
                    <View className="mb-10">
                        <Text className={`text-black leading-[0.9] ${isSmallDevice ? 'text-4xl' : 'text-5xl'}`}>
                            <Text className="font-[ArchivoBlack_400Regular]"
                                style={S.fontGilton}
                            >ALWAYS HERE</Text>
                        </Text>
                        <Text className={`text-black leading-[0.9] ${isSmallDevice ? 'text-4xl' : 'text-5xl'}`}>
                            <Text className="font-[ArchivoBlack_400Regular]"
                                style={S.fontGilton}
                            >TO </Text>
                            <Text className="font-[Inter_900Black] "
                                style={S.fontGilton}
                            >HELP</Text>
                        </Text>
                    </View>

                    {/* Body Text */}
                    <Text className="font-[Inter_600SemiBold] text-black text-xl mb-12 leading-7"
                        style={S.fontSoftura}
                    >
                        Got questions ? Our Support Team is here to help 24*7!
                    </Text>

                    {/* Action Button */}
                    <TouchableOpacity
                        className="bg-black rounded-full px-8 h-14 flex-row items-center self-start gap-2"
                        activeOpacity={0.8}
                        onPress={handleGetSupport}
                    >
                        <Text className="text-white font-[Inter_700Bold] text-lg uppercase"
                            style={S.fontSoftura}
                        >
                            GET SUPPORT
                        </Text>
                        <ArrowUpRight size={24} color="white" strokeWidth={3} />
                    </TouchableOpacity>

                </View>

            </View>
        </Animated.View>
    );
});

export default NewsletterSupport;
