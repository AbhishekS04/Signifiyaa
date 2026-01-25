import React, { useState, useEffect } from 'react';
import PreloaderScreen from '../screens/PreloaderScreen';
import MusicPromptModal from '../components/MusicPromptModal';
import MusicService from '../services/MusicService';
import { useMusicContext } from '../context/MusicContext';
import AppNavigator from '../navigation/AppNavigator';

// CONSTANT SOURCE
const MUSIC_SOURCE = {
    uri: 'https://res.cloudinary.com/dldhfjo5v/video/upload/v1769373781/public_song_kden7k.mp3'
};

export default function AppContent() {
    const { setIsPlaying } = useMusicContext();
    const [showPreloader, setShowPreloader] = useState(true);
    const [showMusicPrompt, setShowMusicPrompt] = useState(false);

    // 🚀 STEP 1: Preload music IMMEDIATELY on app launch
    useEffect(() => {
        const preloadMusic = async () => {
            console.log('Started preloading music...');
            await MusicService.loadMusic(MUSIC_SOURCE);
        };
        preloadMusic();
    }, []);

    const handlePreloaderFinish = () => {
        setShowPreloader(false);
        setShowMusicPrompt(true);
    };

    const handleMusicSelection = async (withMusic: boolean) => {
        setShowMusicPrompt(false);

        if (withMusic) {
            // 🚀 STEP 2: Instant Play (Music is already loaded!)
            setIsPlaying(true);
            MusicService.resumeMusic(); // Just resume, it's sitting at 0:00
        } else {
            // User chose "No Music", but it's loaded and ready if they change their mind
            setIsPlaying(false);
        }
    };

    return (
        <>
            <AppNavigator />
            {showPreloader && <PreloaderScreen onFinish={handlePreloaderFinish} />}
            {showMusicPrompt && <MusicPromptModal onSelectMusic={handleMusicSelection} />}
        </>
    );
}
