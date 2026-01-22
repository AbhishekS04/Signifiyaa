"use client";
// NOTE: This file is intended for a Next.js (Web) project.
// You may see TypeScript errors (e.g., 'HTMLDivElement' not found) in this Expo workspace because
// 'dom' libraries are not included in React Native's tsconfig. These will disappear when copied to a web project.

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Star, Volume2, VolumeX, ChevronRight } from 'lucide-react';

// ============================================
// EVENT DATA STRUCTURE
// ============================================
const EVENTS_DATA = [
    // --- ESPORTS EVENTS ---
    {
        title: 'VALORANT',
        date: 'MARCH 13TH - 14TH',
        category: 'ESPORTS',
        description: 'Join the ultimate tactical FPS showdown. Form your squad and compete for glory!',
        prizePool: 'TBA',
        imageColor: '#ccff00',
        buttonColor: '#D194FF',
        imageUrl: '',
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/44fe63af-47e0-4df6-8fc3-0a984c7337da.mp4'
    },
    {
        title: 'BGMI',
        date: 'MARCH 13TH - 14TH',
        category: 'ESPORTS',
        description: 'Battle it out in the most popular mobile battle royale championship.',
        prizePool: '10K',
        imageColor: '#ff9966',
        buttonColor: '#D194FF',
        imageUrl: '',
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/465c6e8d-1d24-4084-b576-5f613dd1829b.mp4'
    },

    // --- CSE EVENTS ---
    {
        title: 'HACKATHON',
        date: 'MARCH 15TH - 16TH',
        category: 'CSE',
        description: 'Build innovative solutions in 24 hours. Code, create, and conquer!',
        prizePool: '50K',
        imageColor: '#66ccff',
        buttonColor: '#FFD700',
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/1359c8e8-57aa-482e-8af0-31d92af491e5.mp4'
    },
    {
        title: 'CODE RELAY',
        date: 'MARCH 15TH',
        category: 'CSE',
        description: 'Team-based coding challenge. Pass the code, solve the problem!',
        prizePool: 'TBA',
        imageColor: '#9933ff',
        buttonColor: '#FFD700',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },

    // --- CIVIL EVENTS ---
    {
        title: 'BRIDGE BUILDING',
        date: 'MARCH 16TH',
        category: 'CIVIL',
        description: 'Design and build the strongest bridge using limited materials.',
        prizePool: '15K',
        imageColor: '#ff6666',
        buttonColor: '#90EE90',
        imageUrl: 'https://images.unsplash.com/photo-1545139224-7eb9c2acc995?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },
    {
        title: 'CAD MASTER',
        date: 'MARCH 17TH',
        category: 'CIVIL',
        description: 'Showcase your AutoCAD and design skills in this technical challenge.',
        prizePool: 'TBA',
        imageColor: '#ffaa66',
        buttonColor: '#90EE90',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },

    // --- MECHANICAL EVENTS ---
    {
        title: 'ROBO RACE',
        date: 'MARCH 16TH - 17TH',
        category: 'MECHANICAL',
        description: 'Build autonomous robots and race them through challenging obstacle courses.',
        prizePool: '25K',
        imageColor: '#66ff66',
        buttonColor: '#FFB6C1',
        imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },
    {
        title: 'MECHANISM DESIGN',
        date: 'MARCH 17TH',
        category: 'MECHANICAL',
        description: 'Create innovative mechanical solutions for real-world problems.',
        prizePool: 'TBA',
        imageColor: '#66ffcc',
        buttonColor: '#FFB6C1',
        imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },

    // --- EEE EVENTS ---
    {
        title: 'CIRCUIT DEBUGGING',
        date: 'MARCH 18TH',
        category: 'EEE',
        description: 'Find and fix errors in complex electrical circuits under time pressure.',
        prizePool: '20K',
        imageColor: '#ff99cc',
        buttonColor: '#87CEEB',
        imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },
    {
        title: 'SMART HOME',
        date: 'MARCH 18TH',
        category: 'EEE',
        description: 'Design an IoT-based smart home automation system.',
        prizePool: 'TBA',
        imageColor: '#cc99ff',
        buttonColor: '#87CEEB',
        imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },

    // --- ROBOTICS EVENTS ---
    {
        title: 'LINE FOLLOWER',
        date: 'MARCH 19TH',
        category: 'ROBOTICS',
        description: 'Program robots to follow complex line patterns at maximum speed.',
        prizePool: '30K',
        imageColor: '#ffcc66',
        buttonColor: '#DDA0DD',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },
    {
        title: 'DRONE RACING',
        date: 'MARCH 19TH - 20TH',
        category: 'ROBOTICS',
        description: 'Pilot your drone through challenging aerial obstacles and courses.',
        prizePool: '35K',
        imageColor: '#66cccc',
        buttonColor: '#DDA0DD',
        imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    },

    // --- NON-TECH EVENTS ---
    {
        title: 'TREASURE HUNT',
        date: 'MARCH 20TH',
        category: 'NON-TECH',
        description: 'Solve clues and puzzles to find hidden treasures across the campus.',
        prizePool: '10K',
        imageColor: '#ffff99',
        buttonColor: '#98FB98',
        videoUrl: 'https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/videos/original/4ebcf404-4545-45bd-817e-5e6cc8b6c361.mp4'
    },
    {
        title: 'TALENT SHOW',
        date: 'MARCH 21ST',
        category: 'NON-TECH',
        description: 'Showcase your unique talents - singing, dancing, comedy, and more!',
        prizePool: 'TBA',
        imageColor: '#ffccff',
        buttonColor: '#98FB98',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        videoUrl: ''
    }
];

// ============================================
// CAROUSEL CARD COMPONENT (WEB OPTIMIZED)
// ============================================
interface Event {
    title: string;
    date: string;
    category: string;
    description: string;
    prizePool: string;
    imageColor: string;
    buttonColor: string;
    imageUrl?: string;
    videoUrl?: string;
}

const EventCard = ({ event, isActive }: { event: Event; isActive: boolean }) => {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            (videoRef.current as any).muted = isMuted;
            // Auto play if active logic is complex on web, but standard loop is fine
            if ((videoRef.current as any).paused) {
                (videoRef.current as any).play().catch((e: any) => console.log("Autoplay prevented", e));
            }
        }
    }, [isMuted]);

    return (
        <motion.div
            className="w-full max-w-[320px] sm:max-w-[360px] h-[600px] bg-black rounded-[32px] overflow-hidden border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col flex-shrink-0 snap-center relative"
            animate={{
                scale: isActive ? 1 : 0.92,
                opacity: isActive ? 1 : 0.65,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Header / Media */}
            <div className="relative w-full h-[300px] bg-black overflow-hidden flex-shrink-0" style={{ marginBottom: -5 }}>
                {event.videoUrl ? (
                    <div className="relative w-full h-full">
                        <video
                            ref={videoRef}
                            src={event.videoUrl}
                            className="w-full h-full object-cover pointer-events-none"
                            loop
                            muted={isMuted}
                            playsInline
                            autoPlay
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                            className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-full border border-white/20 hover:bg-black/80 transition-colors z-10 cursor-pointer"
                        >
                            {isMuted ? <VolumeX size={18} color="white" /> : <Volume2 size={18} color="white" />}
                        </button>
                    </div>
                ) : event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/20 font-bold" style={{ backgroundColor: event.imageColor }}>
                        POSTER GOES HERE
                    </div>
                )}

                {/* Overlay Border */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black pointer-events-none" />

                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-black px-4 py-2 rounded-full border-2 border-white/20">
                    <span className="text-white text-[10px] tracking-widest uppercase font-bold">
                        {event.category}
                    </span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 bg-white flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-black text-3xl font-black uppercase leading-8 mb-1 line-clamp-2 font-['Gilton']">
                        {event.title}
                    </h3>
                    <p className="text-[#8e99af] text-lg mb-3 font-medium font-['Softura']">
                        {event.date}
                    </p>
                    <div className="bg-[#B9F6CA] self-start px-4 py-1.5 rounded-full border border-black mb-4 inline-block">
                        <span className="text-black text-xs font-bold font-['Softura']">
                            Prize pool: <span className="font-black">{event.prizePool}</span>
                        </span>
                    </div>
                    <p className="text-black/80 text-sm leading-5 mb-4 line-clamp-2 font-['Softura']">
                        {event.description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        className="w-full py-4 rounded-xl border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[2px] active:shadow-none uppercase tracking-widest text-[13px] font-bold font-['Gilton']"
                        style={{ backgroundColor: event.buttonColor }}
                    >
                        View Details
                    </button>
                    <button className="w-full py-4 rounded-xl bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-900 transition-colors uppercase tracking-widest text-[13px] font-bold font-['Gilton']">
                        Register
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function DepartmentsEventsWeb() {
    const defaultFilters = ['ESPORTS', 'CSE', 'CIVIL', 'MECHANICAL', 'EEE', 'ROBOTICS', 'NON-TECH'];
    const [selectedCategory, setSelectedCategory] = useState('ESPORTS');
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef(null);

    const filteredEvents = EVENTS_DATA.filter(e => e.category === selectedCategory);

    // Reset index on category change
    useEffect(() => {
        setActiveIndex(0);
        if (containerRef.current) {
            (containerRef.current as any).scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [selectedCategory]);

    // Track active index on scroll
    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollLeft = (containerRef.current as any).scrollLeft;
        const cardWidth = 340 + 20; // Approx card width + gap
        const index = Math.round(scrollLeft / cardWidth);
        setActiveIndex(index);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 font-sans">

            {/* SECTION A: ABOUT SOET */}
            <div className="bg-[#E3F2FD] rounded-3xl border-[3px] border-black p-8 relative mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="absolute top-6 left-6 bg-red-400 p-2 rounded-full border-2 border-black rotate-12">
                    <Star size={20} className="fill-black stroke-black" />
                </div>

                <div className="flex justify-end mb-4">
                    <h1 className="text-4xl md:text-6xl font-black text-black text-right leading-none font-['Gilton']">
                        ABOUT <br /> <span className="italic">SOET</span>
                    </h1>
                </div>

                <p className="text-black text-center text-lg md:text-xl font-semibold leading-relaxed max-w-3xl mx-auto font-['Softura']">
                    The School of Engineering and Technology stands as a beacon of technical excellence, fostering innovation and shaping the future engineers who will build tomorrow's world.
                </p>
            </div>

            {/* SECTION B: MARQUEE */}
            <div className="bg-[#FFEB3B] border-[3px] border-black py-4 overflow-hidden mb-8 -rotate-1 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...Array(20)].map((_, i) => (
                        <span key={i} className="text-xl font-black mx-4 tracking-widest font-['Gilton'] uppercase">
                            EVENTS ★ ★ SOET ★ ★
                        </span>
                    ))}
                </div>
            </div>

            {/* SECTION C: EVENTS CARD */}
            <div className="bg-[#FFF8E1] border-[3px] border-black rounded-3xl p-6 md:p-10 min-h-[600px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-black mb-2 font-['Gilton']">SIGNIFIYA EVENTS</h2>
                    <p className="text-gray-500 font-semibold max-w-md mx-auto font-['Softura']">
                        Discover the diverse range of events happening at Signifiya'26.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {defaultFilters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setSelectedCategory(filter)}
                            className={`px-6 py-2 rounded-full border-2 border-black text-xs font-bold tracking-wider uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0)] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${selectedCategory === filter ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Carousel Area */}
                <div className="relative">
                    {filteredEvents.length > 0 ? (
                        <>
                            {/* Horizontal Scroll Container */}
                            <div
                                ref={containerRef}
                                onScroll={handleScroll}
                                className="flex gap-6 overflow-x-auto pb-8 pt-4 px-[10%] md:px-[calc(50%-180px)] snap-x snap-mandatory scrollbar-hide"
                                style={{ scrollBehavior: 'smooth' }}
                            >
                                {filteredEvents.map((event, index) => (
                                    <EventCard
                                        key={index}
                                        event={event}
                                        isActive={index === activeIndex}
                                    />
                                ))}
                            </div>

                            {/* Pagination Dots */}
                            {filteredEvents.length > 1 && (
                                <div className="flex justify-center gap-2 mt-4">
                                    {filteredEvents.map((_, i) => (
                                        <motion.button
                                            key={i}
                                            onClick={() => {
                                                const cardWidth = 340 + 20;
                                                if (containerRef.current) {
                                                    (containerRef.current as any).scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                                                }
                                            }}
                                            className="h-2 rounded-full bg-black cursor-pointer"
                                            initial={{ width: 8, opacity: 0.3 }}
                                            animate={{
                                                width: i === activeIndex ? 24 : 8,
                                                opacity: i === activeIndex ? 1 : 0.3
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl font-bold text-gray-400">No events found for {selectedCategory}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Adds custom marquee animation if not in tailwind config */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}

// NOTE: Ensure you have "Gilton" and "Softura" fonts loaded in your globals.css or Next.js font configuration.
