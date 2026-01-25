import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MusicContextType {
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);

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
