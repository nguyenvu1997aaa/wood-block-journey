import SoundManager from './common/SoundManager'
import MusicManager from './common/MusicManager'

class AudioManager extends Phaser.Plugins.BasePlugin implements IAudioManager {
    private soundManager: SoundManager
    private musicManager: MusicManager
    private isMuteAll: boolean

    public initMusic = (key: string): void => {
        this.musicManager = new MusicManager(this.game, key)
        this.setMusicVolume(1)
    }

    public initSound = (): void => {
        this.soundManager = new SoundManager(this.game)
        this.setSoundVolume(1)
    }

    public importSoundEffectKeys(keys: TObject): void {
        this.soundManager.addSoundKeys(keys)
    }

    public playSound(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
        try {
            if (!this.soundManager || this.isMuteAll || !this.game.visibility.isGameVisible())
                return
            if (!this.soundManager.isSoundEnabled()) return

            this.soundManager.play(key, config)
        } catch (error) {
            // console.warn('playSound', error)
        }
    }

    public stopSound(key: string): void {
        try {
            this.soundManager.stop(key)
        } catch (error) {
            // console.warn('stopSound', error)
        }
    }

    public playMusic(config: Phaser.Types.Sound.SoundConfig = {}): void {
        try {
            if (!this.musicManager || this.isMuteAll || !this.game.visibility.isGameVisible())
                return
            if (!this.musicManager.isMusicEnabled()) return

            this.musicManager.play('', {
                loop: true,
                volume: 0.2,
                ...config,
            })
        } catch (error) {
            // console.warn('playMusic', error)
        }
    }

    public pauseMusic(): void {
        try {
            if (!this.musicManager) return
            this.musicManager.pause('')
        } catch (error) {
            // console.warn('pauseMusic', error)
        }
    }

    public stopMusic(): void {
        try {
            if (!this.musicManager) return
            this.musicManager.stop('')
        } catch (error) {
            // console.warn('stopMusic', error)
        }
    }

    public pauseAllSounds(): void {
        try {
            if (!this.soundManager) return
            this.soundManager.pauseAll()
        } catch (error) {
            // console.warn('pauseAllSounds', error)
        }
    }
    public resumeAllSounds(): void {
        try {
            if (!this.soundManager) return
            this.soundManager.resumeAll()
        } catch (error) {
            // console.warn('resumeAllSounds', error)
        }
    }

    public setSoundVolume(volume: number): void {
        try {
            if (!this.soundManager) return
            this.soundManager.setVolume(volume)
        } catch (error) {
            console.warn('setSoundVolume', error)
        }
    }

    public setMusicVolume(volume: number): void {
        try {
            if (!this.musicManager) return
            this.musicManager.setVolume(volume)
        } catch (error) {
            console.warn('setMusicVolume', error)
        }
    }

    public muteAll() {
        this.isMuteAll = true

        this.game.sound.mute = true
    }

    public unmuteAll() {
        this.isMuteAll = false

        this.game.sound.mute = false
    }
}

export default AudioManager
