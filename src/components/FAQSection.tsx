import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const FAQS = [
    { id: 1, question: 'WHAT IS SIGNIFIYA?', answer: 'Signifiya is the annual tech fest of the School of Engineering and Technology, Adamas University.' },
    { id: 2, question: 'HOW DO I GET STARTED?', answer: 'Simply register on the app, browse events, and sign up for the ones you are interested in.' },
    { id: 3, question: 'IS MY DATA SECURE?', answer: 'Yes, we prioritize user privacy and data security with industry-standard practices.' },
    { id: 4, question: 'ARE THERE ANY FEES?', answer: 'Most events are free, but some flagship competitions may have a nominal registration fee.' },
    { id: 5, question: 'HOW CAN I CONTACT SUPPORT?', answer: 'You can reach out to us via the contact section in the app or email us directly.' },
];

const FAQSection = () => {
    return (
        <View className="bg-[#F3E5F5] rounded-[40px] px-6 py-10 mb-10 mx-2 border-2 border-black">
            <View className="mb-8">
                <Text className="text-3xl text-black text-center leading-tight"
                style={{
                    fontFamily: 'Gilton',
                }}
                >FREQUENTLY ASKED QUESTIONS</Text>

                <Text className="text-gray-500 text-center leading-5 pr-6 pl-2 pt-5 pb-5"
                style={{
                    fontFamily: 'Gilton',
                }}>
                    <Text className='text-red-500'>Got questions</Text>
                    <Text className='text-red-500'>? </Text>
                    
                    
                    <Text className="opacity-90">
                        We've got <Text className='text-blue'>answers</Text>. Here are some of the most common questions we get from our community.
                    </Text>
                </Text>
            </View>

            <View className="gap-4">
                {FAQS.map((faq) => (
                    <AccordionItem key={faq.id} question={faq.question} answer={faq.answer} />
                ))}
            </View>
        </View>
    );
};

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const rotation = useSharedValue(0);

    const toggleOpen = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        rotation.value = withTiming(nextState ? 45 : 0, { duration: 200 });
    };

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={toggleOpen}
            className="bg-white border-[3px] border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
            <View className="p-5 flex-row justify-between items-center">
                <Text className="font-[ArchivoBlack_400Regular] text-lg text-black w-[80%] leading-6 uppercase">
                    {question}
                </Text>

                <Animated.View style={[
                    { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'black', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E0B0FF' },
                    iconStyle
                ]}>
                    <Plus size={18} color="black" strokeWidth={3} />
                </Animated.View>
            </View>

            {isOpen && (
                <View className="px-5 pb-5">
                    <Text className="font-[Inter_600SemiBold] text-gray-600 leading-5">
                        {answer}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default FAQSection;
