import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const PastGlimpses = () => {
    // Placeholder frames - in a real app these would be prop-driven or from an API
    const items = [1, 2, 3, 4, 5];

    return (
        <View className="bg-[#FFF0F5] py-10 w-full items-center rounded-[40px] mb-6">
            {/* Header */}
            <View className="items-center mb-10">
                <Text className="text-5xl text-black uppercase" style={{
                    fontFamily: 'Gilton',
                }}>GLIMPSES OF</Text>
                <Text className="text-5xl text-black -mt-2" style={{
                    fontFamily: 'Gilton',
                }} >PAST</Text>
                <Text className="text-gray-500 text-center text-lg px-8 mt-2"
                style={{
                    fontFamily: 'Softura',
                }}>
                    Relive the best moments from our previous events.
                </Text>
            </View>

            {/* Timeline Gallery */}
            <View className="w-full items-center px-4 gap-y-[-40px]">
                {items.map((item, index) => {
                    // Alternating rotation
                    const rotate = index % 2 === 0 ? 'rotate-2' : '-rotate-2';
                    // Z-index to stack correctly (top ones need to be under bottom ones if we want a cascading stack, 
                    // OR simple vertical stack. Design says "scrapbook feel", overlapping usually implies later ones on top or random.
                    // Let's use standard z-index: later items on top of previous ones, but with negative margin.

                    return (
                        <View
                            key={index}
                            className={`bg-white p-3 pb-8 rounded-xl border border-black shadow-sm w-full max-w-sm relative ${rotate} mb-[-20px]`}
                            style={{ zIndex: index }}
                        >
                            {/* The Pin */}
                            <View className="absolute -top-2 left-1/2 -ml-2 w-4 h-4 bg-red-600 rounded-full border border-black z-20 shadow-sm" />

                            {/* Image Placeholder */}
                            <View className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden border border-gray-100">
                                {/* Can use a subtle pattern or actual placeholder image here */}
                                <View className="w-full h-full items-center justify-center bg-gray-300">
                                    <Text className="text-gray-500 font-bold">Image {item}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Footer Button (added spacing because of negative margins above) */}
            <View className="mt-16">
                <TouchableOpacity className="bg-black px-10 py-4 rounded-full shadow-lg">
                    <Text className="text-white text-lg"
                    style={{
                        fontFamily: 'Softura',
                    }}>
                        VIEW GALLERY
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default PastGlimpses;
