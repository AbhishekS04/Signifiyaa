import React, { useState, useEffect, useCallback } from 'react';
import PreloaderScreen from '../screens/PreloaderScreen';
import MusicPromptModal from '../components/MusicPromptModal';
import MusicService from '../services/MusicService';
import { useMusicContext } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import AppNavigator from '../navigation/AppNavigator';
import WelcomeToast from './ui/WelcomeToast';

// CONSTANT SOURCE
const MUSIC_SOURCE = {
    uri: 'https://res.cloudinary.com/dldhfjo5v/video/upload/v1769373781/public_song_kden7k.mp3'
};

export default function AppContent() {
    const { setIsPlaying } = useMusicContext();
    const { welcomeToastVisible, setWelcomeToastVisible } = useAuth();
    const [showPreloader, setShowPreloader] = useState(true);
    const [showMusicPrompt, setShowMusicPrompt] = useState(false);

    // 🚀 STEP 1: Preload music IMMEDIATELY on app launch
    useEffect(() => {
        const preloadMusic = async () => {
            await MusicService.loadMusic(MUSIC_SOURCE);
        };
        preloadMusic();
    }, []);

    const handlePreloaderFinish = useCallback(() => {
        setShowPreloader(false);
        setShowMusicPrompt(true);
    }, []);

    const handleMusicSelection = useCallback(async (withMusic: boolean) => {
        setShowMusicPrompt(false);

        if (withMusic) {
            setIsPlaying(true);
            MusicService.resumeMusic();
        } else {
            setIsPlaying(false);
        }
    }, [setIsPlaying]);

    const handleWelcomeToastComplete = useCallback(() => {
        setWelcomeToastVisible(false);
    }, [setWelcomeToastVisible]);

    return (
        <>
            <AppNavigator />
            {showPreloader && <PreloaderScreen onFinish={handlePreloaderFinish} />}
            {showMusicPrompt && <MusicPromptModal onSelectMusic={handleMusicSelection} />}

            {/* Global Welcome Toast */}
            {welcomeToastVisible && (
                <WelcomeToast onComplete={handleWelcomeToastComplete} />
            )}
        </>
    );
}
