import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';

const NewsletterSupport = () => {
    const [email, setEmail] = useState('');
    const [agreed, setAgreed] = useState(false);

    return (
        <View className="px-2 mb-10 gap-6">

            {/* --- Card 1: Newsletter (Purple) --- */}
            <View className="bg-[#E1BEE7] rounded-[40px] p-8 pb-12">

                {/* Header Typography Mix */}
                <View className="mb-4">
                    <Text className="text-5xl text-black leading-[0.9]">
                        <Text className=""
                        style={{
                            fontFamily: 'Gilton',
                        }}
                        >YOUR </Text>
                        <Text className=" "
                        style={{
                            fontFamily: 'Gilton',
                        }}
                        >INBOX</Text>
                    </Text>
                    <Text className="text-5xl text-black leading-[0.9]">
                        <Text className=""
                        style={{
                            fontFamily: 'Gilton',
                        }}
                        >JUST</Text>
                    </Text>
                    <Text className="text-5xl text-black leading-[0.9] -mt-1">
                        <Text className=""
                        style={{
                            fontFamily: 'Gilton',
                        }}
                        >GOT </Text>
                        <Text className=""
                        style={{
                            fontFamily: 'Gilton',
                        }}
                        >BETTER</Text>
                    </Text>
                </View>

                {/* Subtext */}
                <Text className="font-[Inter_500Medium] text-black text-base mb-8 leading-5"
                style={{
                    fontFamily: 'Softura',
                }}
                >
                    Subscribe to our newsletter for VIP access to news, offers, and insights!
                </Text>

                {/* Input Field */}
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
                </View>

                {/* Subscribe Button */}
                <TouchableOpacity
                    className="bg-black rounded-full h-14 justify-center items-center mb-6"
                    activeOpacity={0.8}
                >
                    <Text className="text-white text-lg tracking-widest uppercase"
                    style={{
                        fontFamily: 'Softura',
                    }}
                    >
                        SUBSCRIBE
                    </Text>
                </TouchableOpacity>

                {/* Checkbox Row */}
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
                </TouchableOpacity>
            </View>


            {/* --- Card 2: Support Section (Blue) --- */}
            <View className="bg-[#448AFF] rounded-[40px] p-8 pb-12">

                {/* Header Typography Mix */}
                <View className="mb-10">
                    <Text className="text-5xl text-black leading-[0.9]">
                        <Text className="font-[ArchivoBlack_400Regular]"
                        style={{
                            fontFamily: 'Gilton',
                        }}
                        >ALWAYS HERE</Text>
                    </Text>
                    <Text className="text-5xl text-black leading-[0.9]">
                        <Text className="font-[ArchivoBlack_400Regular]"
                        style={{
                            fontFamily: 'Gilton',
                        }}
                        >TO </Text>
                        <Text className="font-[Inter_900Black] "
                        style={{
                            fontFamily: 'Gilton',
                        }}
                        >HELP</Text>
                    </Text>
                </View>

                {/* Body Text */}
                <Text className="font-[Inter_600SemiBold] text-black text-xl mb-12 leading-7"
                style={{
                    fontFamily: 'Softura',
                }}
                >
                    Got questions ? Our Support Team is here to help 24*7!
                </Text>

                {/* Action Button */}
                <TouchableOpacity
                    className="bg-black rounded-full px-8 h-14 flex-row items-center self-start gap-2"
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-[Inter_700Bold] text-lg uppercase"
                    style={{
                        fontFamily: 'Softura',
                    }}
                    >
                        GET SUPPORT
                    </Text>
                    <ArrowUpRight size={24} color="white" strokeWidth={3} />
                </TouchableOpacity>

            </View>

        </View>
    );
};

export default NewsletterSupport;
