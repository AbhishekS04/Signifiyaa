import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const PrizesSponsors = () => {
    return (
        <View className="w-full pb-8">
            {/* Section A: Prize Pool Card */}
            <View className="bg-[#E8EAF6] rounded-3xl p-8 items-center relative overflow-hidden border-[3px] border-black shadow-sm mb-6">

                {/* Floating Confetti Decorations */}
                <View className="absolute top-10 left-10 bg-[#B9F6CA] w-3 h-6 rotate-12 opacity-80" />
                <View className="absolute top-20 right-12 bg-[#B9F6CA] w-4 h-4 rotate-45 opacity-80" />
                <View className="absolute bottom-16 left-20 bg-[#B9F6CA] w-3 h-5 -rotate-12 opacity-80" />
                <View className="absolute top-14 right-1/2 bg-[#B9F6CA] w-2 h-4 rotate-12 opacity-60" />

                {/* Massive Typography Block */}
                <View className="items-center mb-6">
                    <Text className="font-[ArchivoBlack_400Regular] text-[80px] leading-[80px] text-black">
                        120K+
                    </Text>
                    <Text className="font-[ArchivoBlack_400Regular] text-[60px] leading-[60px] text-black -mt-2">
                        INR
                    </Text>
                    <Text className="font-[Inter_400Regular] text-2xl text-black mt-2 tracking-widest uppercase">
                        IN PRIZE POOL
                    </Text>
                </View>

                {/* Footer Text */}
                <Text className="font-[Inter_700Bold] text-gray-800 text-center uppercase text-sm tracking-wide">
                    GOODIES, MERCH & MANY MORE...
                </Text>
            </View>

            {/* Section B: Our Sponsors Card */}
            <View className="bg-white rounded-3xl p-6 border-[3px] border-black shadow-sm">

                {/* Header */}
                <View className="items-center mb-8">
                    <View className="flex-row items-baseline">
                        <Text className="font-[ArchivoBlack_400Regular] text-3xl text-black mr-2">OUR</Text>
                        <Text className="font-[Inter_700Bold] text-3xl text-black italic">SPONSORS</Text>
                    </View>
                    <Text className="font-[Inter_400Regular] text-gray-500 text-sm mt-1">
                        Powered by the best in the industry.
                    </Text>
                </View>

                {/* Sponsor Grid */}
                <View className="flex-row flex-wrap justify-between gap-y-8 px-4 mb-8">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <View key={item} className="w-[45%] h-20 items-center justify-center">
                            {/* Placeholder for Logos */}
                            <Text className="font-[Inter_700Bold] text-gray-300 text-lg">
                                Sponsor {item}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Action Button */}
                <TouchableOpacity className="bg-black py-4 rounded-full items-center shadow-md">
                    <Text className="font-[ArchivoBlack_400Regular] text-white text-lg">
                        BECOME A SPONSOR
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default PrizesSponsors;
