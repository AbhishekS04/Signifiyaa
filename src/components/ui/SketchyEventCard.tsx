import React from 'react';
import { View, Text, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
// Video removed as per request
import { MapPin, Clock, Star } from 'lucide-react-native';
import Svg, { Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface SketchyEventCardProps {
    item: any;
    index: number;
    onPressRegister: () => void;
    onPressDetails: () => void;
}

// Fonts based on reference approximation
const SECTION_FONTS = {
    TITLE: 'Gilton',
    BODY: 'Softura',
    BADGE: 'Gilton',
};

const SketchyEventCard = ({ item, index, onPressRegister, onPressDetails }: SketchyEventCardProps) => {
    // Reference image pattern:
    // "Polaroid" thrown on a table style.

    const isEven = index % 2 === 0;

    return (
        <View className="w-full mb-12 px-5">
            <View className={`flex-row ${isEven ? '' : 'flex-row-reverse'} justify-between items-start`}>

                {/* TEXT SECTION (~55%) */}
                <View className={`flex-1 pt-2 ${isEven ? 'mr-4' : 'ml-4'}`}>

                    {/* TAGS: Rounded Rects with Thick Border */}
                    <View className="flex-row gap-2 mb-4 flex-wrap justify-start">
                        {/* Category Tag */}
                        <View className="border-[2px] border-black px-3 py-1 rounded-[12px] bg-white shadow-[2px_2px_0px_#000]">
                            <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                                {item.category}
                            </Text>
                        </View>
                        {/* Number Tag (Fake #01 for style) */}
                        <View className="border-[2px] border-black px-3 py-1 rounded-[12px] bg-[#E0E0E0] shadow-[2px_2px_0px_#000]">
                            <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                                #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text
                        className="text-[28px] text-black leading-[0.95] mb-4 uppercase tracking-tighter"
                        style={{ fontFamily: SECTION_FONTS.TITLE, textAlign: 'left' }}
                    >
                        {item.title}
                    </Text>

                    {/* Description */}
                    <Text
                        className="text-[11px] text-black/80 leading-4 mb-6 font-medium"
                        numberOfLines={4}
                        style={{ fontFamily: SECTION_FONTS.BODY }}
                    >
                        {item.description}
                    </Text>

                    {/* PILLS: Time & Venue */}
                    <View className="gap-3 w-full items-start mb-6">

                        {/* Time Pill (Light Purple) */}
                        <View
                            className="bg-[#E0C3FC] border-[2px] border-black rounded-[14px] px-4 py-2 flex-row items-center shadow-[3px_3px_0px_#000] w-full mb-3"
                            style={{ elevation: 4 }}
                        >
                            <Clock size={14} color="black" strokeWidth={2.5} style={{ marginRight: 8 }} />
                            <Text className="text-[11px] uppercase tracking-widest text-black flex-1" style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', fontWeight: 'bold' }}>
                                TIME: {item.time || 'TBA'}
                            </Text>
                        </View>

                        {/* Venue Pill (White) */}
                        <View
                            className="bg-white border-[2px] border-black rounded-[14px] px-4 py-2 flex-row items-center shadow-[3px_3px_0px_#000] w-full"
                            style={{ elevation: 4 }}
                        >
                            <MapPin size={14} color="#ff0000ff" strokeWidth={2.5} style={{ marginRight: 8 }} />
                            <Text className="text-[10px] font-bold uppercase tracking-widest text-black flex-1" style={{ fontFamily: 'monospace' }}>
                                VENUE: {item.venue || '10k'}
                            </Text>
                        </View>

                    </View>

                </View>

                {/* IMAGE SECTION (~45%) */}
                <View className="w-[45%] pt-2 items-center justify-start">
                    <View
                        className="bg-[#F5F5F5] p-2 border-[3px] border-black"
                        style={{
                            transform: [{ rotate: isEven ? '2deg' : '-2deg' }],
                            borderRadius: 16,
                            shadowColor: "#000",
                            shadowOffset: { width: 6, height: 6 },
                            shadowOpacity: 1,
                            shadowRadius: 0,
                            elevation: 5,
                            width: '100%',
                            aspectRatio: 0.85,
                        }}
                    >
                        {/* Inner Image Only - No Video */}
                        <View className="w-full h-full bg-black border-[2px] border-black rounded-[10px] overflow-hidden relative">
                            <Image
                                source={
                                    typeof item.imageUrl === 'string' && (item.imageUrl.startsWith('http') || item.imageUrl.startsWith('https'))
                                        ? { uri: item.imageUrl }
                                        : item.imageUrl
                                }
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                                cachePolicy="memory-disk"
                                transition={150}
                                recyclingKey={item.title}
                            />
                        </View>

                        {/* Star Badge (Top Right Corner) */}
                        <View className="absolute -top-3 -right-3 bg-black w-8 h-8 rounded-full border-[2px] border-white items-center justify-center shadow-md z-10">
                            <Star size={14} color="white" fill="white" />
                        </View>

                    </View>
                </View>

            </View>

            {/* SEPARATOR: Dashed Line (Full Width) */}
            <View className="w-full h-[2px] mb-5 mt-2 overflow-hidden">
                <Svg height="100%" width="100%">
                    <Line
                        x1="0"
                        y1="1"
                        x2="100%"
                        y2="1"
                        stroke="#B0B0B0"
                        strokeWidth="2"
                        strokeDasharray="12, 12"
                    />
                </Svg>
            </View>

            {/* COORDINATORS (Full Width) */}
            <View className="flex-row gap-6 w-full px-1">
                {/* Student Coords */}
                <View className="flex-1">
                    <Text className="text-[8px] uppercase text-gray-500 font-black tracking-[0.15em] mb-1.5" style={{ fontFamily: SECTION_FONTS.BADGE }}>
                        Student Coordinators
                    </Text>
                    <View>
                        {item.studentCoordinators?.map((name: string, i: number) => (
                            <Text key={i} className="text-[10px] font-bold text-black leading-3.5 mb-0.5">
                                {name}
                            </Text>
                        )) || <Text className="text-[10px] font-bold text-black">TBA</Text>}
                    </View>
                </View>

                {/* Faculty Coords */}
                <View className="flex-1">
                    <Text className="text-[8px] uppercase text-gray-500 font-black tracking-[0.15em] mb-1.5" style={{ fontFamily: SECTION_FONTS.BADGE }}>
                        Faculty Coordinators
                    </Text>
                    <View>
                        {item.facultyCoordinators?.map((name: string, i: number) => (
                            <Text key={i} className="text-[10px] font-bold text-black leading-3.5 mb-0.5">
                                {name}
                            </Text>
                        )) || <Text className="text-[10px] font-bold text-black">TBA</Text>}
                    </View>
                </View>
            </View>

        </View>
    );
};

export default React.memo(SketchyEventCard);
