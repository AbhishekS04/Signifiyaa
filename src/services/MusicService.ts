import { Audio, AVPlaybackStatus } from 'expo-av';

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
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
        } catch {
            // Silent fail - audio mode will use defaults
        }
    }

    /** Sync internal boolean from actual player status */
    private onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            this.isCurrentlyPlaying = status.isPlaying;
        } else {
            this.isCurrentlyPlaying = false;
        }
    };

    async loadMusic(musicSource: any) {
        if (this.isLoaded) return;

        try {
            if (this.sound) {
                await this.sound.unloadAsync();
            }

            const { sound } = await Audio.Sound.createAsync(
                musicSource,
                { shouldPlay: false, isLooping: true, volume: 0.5 },
            );

            sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
            this.sound = sound;
            this.isLoaded = true;
        } catch {
            // Silent fail - music will not play
        }
    }

    async playMusic(musicSource: any, shouldPlay: boolean = true) {
        if (!this.sound) {
            await this.loadMusic(musicSource);
        }

        if (this.sound && shouldPlay) {
            try {
                await this.sound.playAsync();
            } catch {
                this.isCurrentlyPlaying = false;
            }
        }
    }

    async pauseMusic() {
        if (this.sound && this.isCurrentlyPlaying) {
            try {
                await this.sound.pauseAsync();
            } catch {
                // State corrected by onPlaybackStatusUpdate
            }
        }
    }

    async resumeMusic() {
        if (!this.sound || this.isCurrentlyPlaying) return;

        try {
            await this.sound.playAsync();
        } catch {
            this.isCurrentlyPlaying = false;
        }
    }

    async stopMusic() {
        if (!this.sound) return;

        try {
            const status = await this.sound.getStatusAsync();
            if (status.isLoaded) {
                await this.sound.stopAsync();
                await this.sound.unloadAsync();
            }
        } catch {
            // Silent fail
        } finally {
            this.sound = null;
            this.isCurrentlyPlaying = false;
            this.isLoaded = false;
        }
    }

    /**
     * Fully release the Sound instance.
     * Call from provider unmount / app termination to prevent resource leaks.
     */
    async unloadMusic() {
        if (!this.sound) return;

        try {
            await this.sound.stopAsync();
        } catch {
            // May already be stopped
        }

        try {
            await this.sound.unloadAsync();
        } catch {
            // May already be unloaded
        } finally {
            this.sound = null;
            this.isCurrentlyPlaying = false;
            this.isLoaded = false;
        }
    }

    async setVolume(volume: number) {
        if (!this.sound) return;

        try {
            await this.sound.setVolumeAsync(volume);
        } catch {
            // Silent fail - volume change not critical
        }
    }

    isPlaying(): boolean {
        return this.isCurrentlyPlaying;
    }
}

export default new MusicService();
