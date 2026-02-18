import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import SmoothButton from './ui/SmoothButton';
import MusicService from '../services/MusicService';
import { useMusicContext } from '../context/MusicContext';
import Animated from 'react-native-reanimated';

interface GlobalMusicButtonProps {
    style?: any;
}

export default React.memo(function GlobalMusicButton({ style }: GlobalMusicButtonProps) {
    const { isPlaying, setIsPlaying } = useMusicContext();

    const toggleMusic = useCallback(() => {
        // OPTIMISTIC UPDATE: Update UI immediately ⚡
        const nextState = !isPlaying;
        setIsPlaying(nextState);

        // Fire and forget audio logic
        if (nextState) {
            MusicService.resumeMusic();
        } else {
            MusicService.pauseMusic();
        }
    }, [isPlaying, setIsPlaying]);

    return (
        <Animated.View style={[{
            position: 'absolute',
            top: 75, // Moved down for better positioning
            right: 28,
            zIndex: 9999,
        }, style]}>
            <SmoothButton
                onPress={toggleMusic}
                buttonStyle="bg-black/85 rounded-full"
                shadowStyle="bg-black/90 rounded-full"
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
});