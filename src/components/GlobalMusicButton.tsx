import React from 'react';
import { View } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import SmoothButton from './ui/SmoothButton';
import MusicService from '../services/MusicService';
import { useMusicContext } from '../context/MusicContext';
import Animated from 'react-native-reanimated';

interface GlobalMusicButtonProps {
    style?: any;
}

export default function GlobalMusicButton({ style }: GlobalMusicButtonProps) {
    const { isPlaying, setIsPlaying } = useMusicContext();

    const toggleMusic = async () => {
        if (isPlaying) {
            await MusicService.pauseMusic();
            setIsPlaying(false);
        } else {
            await MusicService.resumeMusic();
            setIsPlaying(true);
        }
    };

    return (
        <Animated.View style={[{
            position: 'absolute',
            top: 75, // Moved down for better positioning
            right: 28,
            zIndex: 9999,
        }, style]}>
            <SmoothButton
                onPress={toggleMusic}
                buttonStyle="bg-black/80 rounded-full"
                shadowStyle="bg-black/40 rounded-full"
                depth={4}
                innerButtonStyle={{ padding: 12 }}
            >
                {isPlaying ? (
                    <Pause color="white" size={20} fill="white" />
                ) : (
                    <Play color="white" size={20} fill="white" />
                )}
            </SmoothButton>
        </Animated.View>
    );
}
