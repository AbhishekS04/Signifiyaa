import React, { useState } from 'react';
import PreloaderScreen from '../screens/PreloaderScreen';
import MusicPromptModal from '../components/MusicPromptModal';
import MusicService from '../services/MusicService';
import { useMusicContext } from '../context/MusicContext';
import AppNavigator from '../navigation/AppNavigator';

export default function AppContent() {
    const { setIsPlaying } = useMusicContext();
    const [showPreloader, setShowPreloader] = useState(true);
    const [showMusicPrompt, setShowMusicPrompt] = useState(false);

    const handlePreloaderFinish = () => {
        setShowPreloader(false);
        setShowMusicPrompt(true);
    };

    const handleMusicSelection = async (withMusic: boolean) => {
        setShowMusicPrompt(false);

        if (withMusic) {
            // ============================================
            // 🎵 MUSIC CONFIGURATION
            // Choose ONE option below (comment out the other)
            // ============================================

            // Option 1: Stream from URL (Active)
            const musicSource = {
                uri: 'https://res.cloudinary.com/dldhfjo5v/video/upload/v1769352085/The_Weeknd_Playboi_Carti_-_Timeless_Official_Audio_nzylcx.mp4'
            };

            // Option 2: Load from local assets (Commented out)
            // const musicSource = require('../../assets/The Weeknd, Playboi Carti - Timeless (Official Audio).mp4');

            // Play the selected music
            await MusicService.playMusic(musicSource);
            setIsPlaying(true); // ✅ Set to playing - button shows PAUSE icon
        } else {
            // User chose "Enter Without Music"
            setIsPlaying(false); // ✅ Set to paused - button shows PLAY icon
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
