import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AppState } from 'react-native';
import MusicService from '../services/MusicService';

interface MusicContextType {
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // pause music when app goes to background
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState.match(/inactive|background/) && isPlaying) {
                MusicService.pauseMusic();
                setIsPlaying(false);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [isPlaying]);

    return (
        <MusicContext.Provider value={{ isPlaying, setIsPlaying }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusicContext = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusicContext must be used within MusicProvider');
    }
    return context;
};
