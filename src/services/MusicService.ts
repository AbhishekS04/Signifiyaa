import { Audio } from 'expo-av';

class MusicService {
    private sound: Audio.Sound | null = null;
    private isCurrentlyPlaying: boolean = false;

    async playMusic(musicSource: any) {
        try {
            // Unload previous sound if exists
            if (this.sound) {
                await this.sound.unloadAsync();
            }

            // Create and load new sound
            const { sound } = await Audio.Sound.createAsync(
                musicSource,
                { shouldPlay: true, isLooping: true, volume: 0.5 }
            );

            this.sound = sound;
            await sound.playAsync();
            this.isCurrentlyPlaying = true;
            console.log('Music started playing');
        } catch (error) {
            console.error('Error playing music:', error);
        }
    }

    async pauseMusic() {
        if (this.sound && this.isCurrentlyPlaying) {
            await this.sound.pauseAsync();
            this.isCurrentlyPlaying = false;
            console.log('Music paused');
        }
    }

    async resumeMusic() {
        if (this.sound && !this.isCurrentlyPlaying) {
            await this.sound.playAsync();
            this.isCurrentlyPlaying = true;
            console.log('Music resumed');
        }
    }

    async stopMusic() {
        if (this.sound) {
            await this.sound.stopAsync();
            await this.sound.unloadAsync();
            this.sound = null;
            this.isCurrentlyPlaying = false;
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
