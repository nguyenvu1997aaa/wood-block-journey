class SoundManager {
    private game: Phaser.Game

    private audios: Map<string, Phaser.Sound.WebAudioSound>
    private volume: number
    private soundKeys: Map<string, string>

    constructor(game: Phaser.Game) {
        this.game = game

        this.audios = new Map<string, Phaser.Sound.WebAudioSound>()
        this.soundKeys = new Map<string, string>()
    }

    public addSoundKeys(soundKeys: TObject): void {
        Object.keys(soundKeys).forEach((key) => {
            const value = soundKeys[key]

            if (typeof value !== 'string') return

            this.soundKeys.set(key, value)
        })
    }

    public clearSoundKeys(): void {
        this.soundKeys.clear()
    }

    public play(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
        const lastConfig = {
            volume: this.volume,
            ...(config || {}),
        }

        if (lastConfig.volume !== this.volume) {
            lastConfig.volume *= this.volume
        }

        let audio = this.audios.get(key)
        if (!audio) {
            if (this.game.cache.audio.exists(key)) {
                const newAudio = this.game.sound.add(key) as Phaser.Sound.WebAudioSound
                this.audios.set(key, newAudio)
                audio = newAudio
            }
        }

        if (audio) {
            audio.play(undefined, lastConfig)
            return
        }

        const soundPath = this.soundKeys.get(key)

        if (!soundPath) {
            console.log(this.soundKeys.get(key), key)
            console.warn(`${key} not found. Use importSoundEffectKeys from audio plugin to add it.`)
            return
        }

        try {
            console.log(key, soundPath, 'load_sound_plugin')
            this.game.globalScene.load.audio(key, soundPath)
            this.game.globalScene.load.on(
                `${Phaser.Loader.Events.FILE_KEY_COMPLETE}audio-${key}`,
                () => {
                    console.log(key, soundPath, 'finish')
                    const newAudio = this.game.sound.add(key) as Phaser.Sound.WebAudioSound
                    this.audios.set(key, newAudio)
                    newAudio.play(undefined, lastConfig)
                }
            )
            this.game.globalScene.load.start()
        } catch (error) {
            console.warn(error)
        }
    }

    public pauseAll(): void {
        this.audios.forEach((audio) => {
            audio.pause()
        })
    }

    public resumeAll(): void {
        this.audios.forEach((audio) => {
            audio.resume()
        })
    }

    public stopAll(): void {
        this.audios.forEach((audio) => {
            audio.stop()
        })
    }

    public pause(key: string): void {
        const audio = this.audios.get(key)
        if (!audio) return

        audio.pause()
    }

    public stop(key: string): void {
        const audio = this.audios.get(key)
        if (!audio) return

        audio.stop()
    }

    public setVolume(value: number): void {
        this.volume = value
    }

    public isMusicEnabled = (): boolean => {
        const { player } = this.game
        return !!player.getPlayerSetting('music')
    }

    public isSoundEnabled = (): boolean => {
        const { player } = this.game
        return !!player.getPlayerSetting('sound')
    }
}

export default SoundManager
