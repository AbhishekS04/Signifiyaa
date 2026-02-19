import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    Easing,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

// ─── Static constants (module scope) ────────────────────────────────────────────
const FONT_QUESTION = 'Softura';
const FONT_ANSWER = 'Gilton';
const COLOR_INACTIVE = '#E0B0FF';
const COLOR_ACTIVE = '#FF8A80';

const S = StyleSheet.create({
    fontQuestion: { fontFamily: FONT_QUESTION },
    fontAnswer: { fontFamily: FONT_ANSWER },
    fontGilton: { fontFamily: 'Gilton' },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    answerOverflow: { overflow: 'hidden' },
});

const FAQS = [
    { id: 1, question: 'WHAT IS SIGNIFIYA?', answer: 'SIGNIFIYA 2026 is the largest student-driven Techfest of SOET, designed to give students a platform to showcase technical skills, creativity, teamwork, and leadership. It is a two-day event where students compete, collaborate, and learn beyond the classroom.' },
    { id: 2, question: 'Why should I participate in SIGNIFIYA 2026?', answer: 'Participation in SIGNIFIYA allows students to apply theoretical knowledge in real competitive scenarios, explore interests beyond their core discipline, develop confidence, communication, and leadership skills, gain exposure to inter-college competition and peer learning. It is both a learning experience and a personal growth opportunity.' },
    { id: 3, question: 'What kind of events can students take part in?', answer: 'Students can participate in technical events such as robotics, coding challenges, circuit design, and core engineering competitions, gaming events including BGMI and Valorant, non-technical events like dance battles, rap battles, treasure hunts, and arm wrestling. This variety ensures opportunities for students from all interests and skill levels.' },
    { id: 4, question: 'Can students from different branches participate together?', answer: 'Yes. SIGNIFIYA actively encourages interdisciplinary participation. Many events allow or require team participation across different branches, promoting collaboration, coordination, and shared problem-solving.' },
    { id: 5, question: 'Is SIGNIFIYA beneficial for first-year and non-technical students?', answer: 'Yes. The inclusion of non-technical and cultural events ensures that students from all years and backgrounds can participate, contribute, and feel involved in the fest.' },
    { id: 6, question: 'Is SIGNIFIYA only for Adamas University students?', answer: 'No. While Adamas University students form the core participant group, SIGNIFIYA is also open to students from other universities, engineering colleges, polytechnics, and schools, making it a large inter-institutional event.' },
];

const FAQSection = React.memo(() => {
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
        <Animated.View
            className="bg-[#F3E5F5] rounded-[30px] px-6 py-10 mb-10 mx-2 border-2 border-black"
        >
            <View className="mb-8">
                <Text className={`text-black text-center leading-tight ${isSmallDevice ? 'text-2xl' : 'text-3xl'}`}
                    style={S.fontQuestion}
                >FREQUENTLY ASKED QUESTIONS</Text>

                <Text className="text-gray-500 text-center leading-5 pr-6 pl-2 pt-5 pb-5"
                    style={S.fontGilton}>
                    <Text className='text-red-500'>Got questions</Text>
                    <Text className='text-red-500'>? </Text>


                    <Text className="opacity-90">
                        We've got <Text className='text-[#4169E1]'>answers</Text>. Here are some of the most common questions we get from our community.
                    </Text>
                </Text>
            </View>

            <Animated.View className="gap-4">
                {FAQS.map((faq) => (
                    <AccordionItem key={faq.id} question={faq.question} answer={faq.answer} />
                ))}
            </Animated.View>
        </Animated.View>
        </Animated.View>
    );
});

// ─── Layout transition configs (module scope) ──────────────────────────────────
const ANSWER_ENTER = FadeIn.duration(150).delay(50);
const ANSWER_EXIT = FadeOut.duration(150);

const AccordionItem = React.memo(({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const rotation = useSharedValue(0);
    const buttonOffset = useSharedValue(-4);

    const toggleOpen = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsOpen((prev) => {
            const nextState = !prev;

            if (nextState) {
                rotation.value = withSpring(45, { damping: 12, stiffness: 120 });
                buttonOffset.value = withSpring(0, { damping: 15, stiffness: 150 });
            } else {
                rotation.value = withSpring(0, { damping: 12, stiffness: 120 });
                buttonOffset.value = withSpring(-4, { damping: 15, stiffness: 150 });
            }
            return nextState;
        });
    }, [rotation, buttonOffset]);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    // Discrete color switch — avoids per-frame interpolateColor math
    const iconContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: rotation.value > 22.5 ? COLOR_ACTIVE : COLOR_INACTIVE,
    }));

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: buttonOffset.value }],
    }));

    return (
        <Animated.View className="relative mb-3 bg-black rounded-xl">
            <Animated.View
                className="bg-white border-[3px] border-black rounded-xl overflow-hidden"
                style={cardStyle}
            >
                <TouchableOpacity
                    onPress={toggleOpen}
                    activeOpacity={0.9}
                    className="p-5 flex-row justify-between items-center bg-white"
                >
                    <Text
                        className="text-lg text-black w-[80%] leading-6 uppercase"
                        style={S.fontQuestion}
                    >
                        {question}
                    </Text>

                    <Animated.View style={[S.iconCircle, iconContainerStyle, iconStyle]}>
                        <Plus size={18} color="black" strokeWidth={3} />
                    </Animated.View>
                </TouchableOpacity>

                {isOpen && (
                    <Animated.View
                        entering={ANSWER_ENTER}
                        exiting={ANSWER_EXIT}
                        style={S.answerOverflow}
                    >
                        <View className="px-5 pb-5 pt-0">
                            <View className="border-t-[1px] border-black/10 pt-4">
                                <Text
                                    className="text-gray-800 text-base leading-6"
                                    style={S.fontAnswer}
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
});

export default FAQSection;
