interface IMarkers {
    [key: string]: Phaser.Sound.BaseSound | null
}

class MusicManager {
    private name: string
    private game: Phaser.Game
    private isSprite: boolean

    private audio: Phaser.Sound.WebAudioSound
    private markers: IMarkers

    private volume: number

    constructor(game: Phaser.Game, name: string) {
        this.name = name
        this.game = game
        this.markers = {}
        this.isSprite = false

        if (!this.isSprite) {
            this.audio = this.game.sound.add(this.name) as Phaser.Sound.WebAudioSound
        }
    }

    public play(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
        const lastConfig = {
            volume: this.volume,
            ...(config || {}),
        }

        if (lastConfig.volume !== this.volume) {
            lastConfig.volume *= this.volume
        }

        if (!this.isSprite) {
            if (this.audio?.seek > 0) {
                this.audio.resume()
                return
            }

            this.audio?.play(key, lastConfig)
            return
        }

        this.createMaker(key)
        this.markers[key]?.play(key, lastConfig)
    }

    public pause(key: string): void {
        if (!this.isSprite) {
            this.audio?.pause()
            return
        }

        this.markers[key]?.pause()
    }

    public stop(key: string): void {
        if (!this.isSprite) {
            this.audio?.stop()
            return
        }

        this.markers[key]?.stop()
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

    private createMaker(key: string): void {
        if (this.markers[key]) return

        try {
            this.markers[key] = this.game.sound.addAudioSprite(this.name)
        } catch (error) {
            console.warn('createMaker', error)
        }
    }
}

export default MusicManager
