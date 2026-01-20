import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Instagram, Linkedin, Github } from 'lucide-react-native';

const TEAM_MEMBERS = [
    { id: 1, name: 'Ashish Yadav', role: 'BLOCKCHAIN DEV', desc: 'Developing smart contracts.', image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Ashish' },
    { id: 2, name: 'Garima Roy', role: 'FRONTEND DEV', desc: 'Building beautiful UIs.', image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Garima' },
    { id: 3, name: 'Leeza Bhowal', role: 'UI/UX DESIGNER', desc: 'Crafting user experiences.', image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Leeza' },
    { id: 4, name: 'Somnath Singha', role: 'BACKEND DEV', desc: 'Managing servers & APIs.', image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Somnath' },
    { id: 5, name: 'Srijita Bera', role: 'CONTENT LEAD', desc: 'Writing compelling stories.', image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Srijita' },
    { id: 6, name: 'Siddhartha', role: 'TECH LEAD', desc: 'Overseeing technology.', image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Siddhartha' },
    { id: 7, name: 'Samriddhi Sinha', role: 'EVENT MANAGER', desc: 'Organizing chaos.', image: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Samriddhi' },
];

const TeamSection = () => {
    const [activeMember, setActiveMember] = useState(TEAM_MEMBERS[0]);

    return (
        <View className="bg-[#F3E5F5] rounded-[40px] px-6 py-10 mb-6 mx-2 border-2 border-black">

            {/* Sticky Card */}
            <View className="mb-10 items-center">
                <View className="bg-white border-[3px] border-black rounded-3xl p-6 w-full items-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <View className="w-24 h-24 bg-gray-200 rounded-full border-[3px] border-black mb-4 overflow-hidden relative">
                        <Image source={{ uri: activeMember.image }} className="w-full h-full" />
                    </View>

                    <Text className="font-[ArchivoBlack_400Regular] text-2xl text-black text-center mb-1 leading-6">
                        {activeMember.name}
                    </Text>
                    <Text className="font-[Inter_700Bold] text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4 text-center">
                        {activeMember.role}
                    </Text>
                    <Text className="font-[Inter_900Black] text-black text-center text-sm mb-6 leading-5">
                        {activeMember.desc}
                    </Text>

                    {/* Socials */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity className="p-2 border-2 border-black rounded-full hover:bg-gray-100 flex-row items-center justify-center w-10 h-10">
                            <Instagram size={20} color="black" strokeWidth={2.5} />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2 border-2 border-black rounded-full hover:bg-gray-100 flex-row items-center justify-center w-10 h-10">
                            <Linkedin size={20} color="black" strokeWidth={2.5} />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2 border-2 border-black rounded-full hover:bg-gray-100 flex-row items-center justify-center w-10 h-10">
                            <Github size={20} color="black" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* List */}
            <View>
                <View className="flex-row mb-6 items-baseline gap-2">
                    <Text className="font-[ArchivoBlack_400Regular] text-3xl text-black">MEET THE</Text>
                    <Text className="font-[Inter_900Black] text-3xl text-black italic">TEAM</Text>
                </View>

                <View className="gap-4 pl-2">
                    {TEAM_MEMBERS.map((member) => (
                        <TouchableOpacity
                            key={member.id}
                            onPress={() => setActiveMember(member)}
                            activeOpacity={0.7}
                        >
                            <Text className={`text-lg font-[Inter_700Bold] ${activeMember.id === member.id
                                    ? 'text-black'
                                    : 'text-[#C7B5D6]'
                                }`}>
                                {member.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

        </View>
    );
};

export default TeamSection;
