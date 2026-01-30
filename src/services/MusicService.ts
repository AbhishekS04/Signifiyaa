import { Audio } from 'expo-av';

class MusicService {
    private sound: Audio.Sound | null = null;
    private isCurrentlyPlaying: boolean = false;
    private isLoaded: boolean = false;

    constructor() {
        this.initAudioMode();
    }

    private async initAudioMode() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true, // Keep active so we can manually pause without thread crash
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
        } catch (e) {
            // Silent fail - audio mode will use defaults
        }
    }

    async loadMusic(musicSource: any) {
        if (this.isLoaded) return; // Already loaded

        try {
            // Unload previous sound if exists
            if (this.sound) {
                await this.sound.unloadAsync();
            }

            // Create and load new sound with shouldPlay: FALSE
            const { sound } = await Audio.Sound.createAsync(
                musicSource,
                { shouldPlay: false, isLooping: true, volume: 0.5 }
            );

            this.sound = sound;
            this.isLoaded = true;

        } catch (error) {
            // Silent fail - music will not play
        }
    }

    async playMusic(musicSource: any, shouldPlay: boolean = true) {
        if (!this.sound) {
            // If not preloaded, load it now
            await this.loadMusic(musicSource);
        }

        if (this.sound) {
            if (shouldPlay) {
                try {
                    await this.sound.playAsync();
                    this.isCurrentlyPlaying = true;
                } catch (error) {
                    // Silent fail
                }
            }
        }
    }

    async pauseMusic() {
        if (this.sound && this.isCurrentlyPlaying) {
            try {
                await this.sound.pauseAsync();
                this.isCurrentlyPlaying = false;
            } catch (error) {
                // Silent fail
            }
        }
    }

    async resumeMusic() {
        if (this.sound && !this.isCurrentlyPlaying) {
            this.sound.playAsync();
            this.isCurrentlyPlaying = true;
        }
    }

    async stopMusic() {
        if (this.sound) {
            try {
                // Check status first to avoid stopping if already stopped/unloaded
                const status = await this.sound.getStatusAsync();
                if (status.isLoaded) {
                    await this.sound.stopAsync();
                    await this.sound.unloadAsync();
                }
            } catch (error) {
                // Silent fail
            } finally {
                // Always reset state to ensure clean slate
                this.sound = null;
                this.isCurrentlyPlaying = false;
                this.isLoaded = false;
            }
        }
    }

    async setVolume(volume: number) {
        if (this.sound) {
            await this.sound.setVolumeAsync(volume);
        }
    }

    isPlaying(): boolean {
        return this.isCurrentlyPlaying;
    }
}

export default new MusicService();
