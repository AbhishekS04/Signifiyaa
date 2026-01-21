import { View, Text, TouchableOpacity } from 'react-native';
import { Smile } from 'lucide-react-native';

const AboutSection = () => {
    return (
        <View className="bg-[#F3E5F5] rounded-[40px] p-8 mb-4 mt-6">
            {/* Pale Pink Background, No Border, Larger Radius */}

            {/* Header Row */}
            <View className="flex-row justify-between items-start mb-6">
                <View>
                
                    <Text className="text-black text-3xl uppercase leading-none mt-4" style={{ fontFamily: 'Gilton' }}>
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
                <Text className="text-black/80  text-base leading-7" 
                style={{ fontFamily: 'Softura' }}>
                    Signifiya is not just an event; it's an experience. We bring together the brightest minds, the boldest creators, and the most passionate individuals for a celebration of innovation, art, and culture.
                </Text>
            </View>

            {/* Button */}
            <TouchableOpacity className="bg-black rounded-full px-8 py-4 self-start active:translate-y-1">
                <Text className="text-white text-sm uppercase tracking-widest"
                style={{ fontFamily: 'Softura' }}>
                    GET VISITOR'S PASS
                </Text>
            </TouchableOpacity>

            {/* Footer Note */}
            <Text className="text-gray-600 text-[10px] leading-3 mt-6 ml-1"
            style={{ fontFamily: 'Softura' }}>
                * Students participating in any Signifiya event do not need a visitor's pass.
            </Text>
        </View>
    );
};

export default AboutSection;
