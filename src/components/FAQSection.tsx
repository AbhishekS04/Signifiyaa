import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolate,
    Extrapolation,
    FadeIn,
    Layout,
    measure,
    runOnUI,
    useAnimatedRef,
    interpolateColor
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
// Note: SmoothButton is NOT used here to allow full control over the accordion layout

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

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
        <Animated.View
            className="bg-[#F3E5F5] rounded-[30px] px-6 py-10 mb-10 mx-2 border-2 border-black"
            layout={Layout.springify().damping(20).stiffness(100).mass(1)} // PARENT: Slower (Damp 20, Stiff 100)
        >
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

            {/* Intermediate List Container - Matches Parent physics for smooth propagation */}
            <Animated.View
                className="gap-4"
                layout={Layout.springify().damping(20).stiffness(100).mass(1)}
            >
                {FAQS.map((faq, index) => (
                    <Animated.View
                        key={faq.id}
                        layout={Layout.springify().damping(16).stiffness(120).mass(1)} // Wrapper: Medium speed
                    >
                        <AccordionItem question={faq.question} answer={faq.answer} />
                    </Animated.View>
                ))}
            </Animated.View>
        </Animated.View>
    );
};

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Animation Values
    const rotation = useSharedValue(0);
    const buttonOffset = useSharedValue(-4); // Initial depth

    const toggleOpen = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (nextState) {
            // Rotate 45deg to turn Plus into Cross (X)
            rotation.value = withSpring(45, { damping: 12, stiffness: 120 });
            buttonOffset.value = withSpring(0, { damping: 15, stiffness: 150 }); // Press down
        } else {
            rotation.value = withSpring(0, { damping: 12, stiffness: 120 });
            buttonOffset.value = withSpring(-4, { damping: 15, stiffness: 150 }); // Pop up
        }
    };

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }]
    }));

    // Interpolate color based on rotation (0 to 45)
    const iconContainerStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            rotation.value,
            [0, 45],
            ['#E0B0FF', '#FF8A80'] // Purple -> Red
        );
        return { backgroundColor };
    });

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: buttonOffset.value }]
    }));

    // CHILD PHYSICS: Faster/Snappier (Damp 14, Stiff 200)
    // Ensures child shrinks BEFORE parent collapses to prevent clipping.
    const childLayoutRef = Layout.springify().damping(14).stiffness(200).mass(1);

    return (
        // OUTER CONTAINER (Shadow)
        <Animated.View
            className="relative mb-3 bg-black rounded-xl"
            layout={childLayoutRef}
        >
            {/* INNER CONTAINER (White Card) */}
            <Animated.View
                className="bg-white border-[3px] border-black rounded-xl overflow-hidden"
                style={cardStyle}
                layout={childLayoutRef}
            >
                <TouchableOpacity
                    onPress={toggleOpen}
                    activeOpacity={0.9}
                    className="p-5 flex-row justify-between items-center bg-white"
                >
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
                        },
                        iconContainerStyle,
                        iconStyle
                    ]}>
                        <Plus size={18} color="black" strokeWidth={3} />
                    </Animated.View>
                </TouchableOpacity>

                {/* Answer Content */}
                {isOpen && (
                    <Animated.View
                        entering={FadeIn.duration(150).delay(50)}
                        exiting={FadeIn.duration(0)}
                        style={{ overflow: 'hidden' }}
                    >
                        <View className="px-5 pb-5 pt-0">
                            <View className="border-t-[1px] border-black/10 pt-4">
                                <Text
                                    className="text-gray-800 text-base leading-6"
                                    style={{ fontFamily: FAQ_FONTS.ANSWER }}
                                >
                                    {answer}
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </Animated.View>
        </Animated.View>
    );
};

export default FAQSection;
