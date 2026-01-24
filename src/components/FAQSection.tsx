import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutChangeEvent, Dimensions } from 'react-native';
import { Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolate,
    Extrapolation,
    Easing
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const FAQ_FONTS = {
    QUESTION: 'Softura',
    ANSWER: 'Gilton'
};

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
                <Text className={`text-black text-center leading-tight ${isSmallDevice ? 'text-2xl' : 'text-3xl'}`}
                    style={{
                        fontFamily: FAQ_FONTS.QUESTION,
                    }}
                >FREQUENTLY ASKED QUESTIONS</Text>

                <Text className="text-gray-500 text-center leading-5 pr-6 pl-2 pt-5 pb-5"
                    style={{
                        fontFamily: 'Gilton',
                    }}>
                    <Text className='text-red-500'>Got questions</Text>
                    <Text className='text-red-500'>? </Text>


                    <Text className="opacity-90">
                        We've got <Text className='text-[#4169E1]'>answers</Text>. Here are some of the most common questions we get from our community.
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

    // Animation values
    const animatedHeight = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);

    const toggleOpen = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);

        // Haptic feedback for premium feel
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (nextState) {
            // Opening - use large maxHeight
            animatedHeight.value = withSpring(500, {
                damping: 18,
                stiffness: 120,
            });
            rotation.value = withSpring(45, {
                damping: 15,
                stiffness: 150,
            });
            scale.value = withSpring(1.05, {
                damping: 12,
                stiffness: 200,
            });
            // Smooth immediate opacity - no stagger
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            // Closing - ultra smooth, no jarring bounce
            animatedHeight.value = withTiming(0, {
                duration: 350,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1) // Smooth cubic-bezier
            });
            rotation.value = withSpring(0, {
                damping: 16, // Smooth controlled rotation
                stiffness: 150,
            });
            scale.value = withSpring(1, {
                damping: 15, // Subtle settle back
                stiffness: 200,
            });
            opacity.value = withTiming(0, { duration: 250 });
        }
    };



    // Animated styles
    const containerStyle = useAnimatedStyle(() => ({
        maxHeight: animatedHeight.value,
        overflow: 'hidden',
    }));

    const iconContainerStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotation.value}deg` },
            { scale: scale.value }
        ],
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{
            translateY: interpolate(
                opacity.value,
                [0, 1],
                [10, 0],
                Extrapolation.CLAMP
            )
        }]
    }));

    return (
        <View className="relative mb-4">
            <View className="absolute top-1.5 left-1.5 w-full h-full bg-black rounded-xl" />
            <TouchableOpacity
                activeOpacity={1}
                onPress={toggleOpen}
                className="bg-white border-[3px] border-black rounded-xl overflow-hidden active:translate-x-1.5 active:translate-y-1.5"
            >
                <View className="p-5 flex-row justify-between items-center">
                    <Text
                        className="text-lg text-black w-[80%] leading-6 uppercase"
                        style={{ fontFamily: FAQ_FONTS.QUESTION }}
                    >
                        {question}
                    </Text>

                    <Animated.View style={[
                        {
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            borderWidth: 2,
                            borderColor: 'black',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#E0B0FF'
                        },
                        iconContainerStyle
                    ]}>
                        <Plus size={18} color="black" strokeWidth={3} />
                    </Animated.View>
                </View>

                {/* Animated Content Container - No measurement needed */}
                <Animated.View style={containerStyle}>
                    <Animated.View
                        style={contentAnimatedStyle}
                        className="px-5 pb-5 border-t-[1px] border-black/10 pt-4"
                    >
                        <Text
                            className="text-gray-800 text-base leading-6"
                            style={{ fontFamily: FAQ_FONTS.ANSWER }}
                        >
                            {answer}
                        </Text>
                    </Animated.View>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

export default FAQSection;
