import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

class ProgressStarSparkle extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    public emitZone: Phaser.Geom.Rectangle
    public emitter: Phaser.GameObjects.Particles.ParticleEmitter

    private _isPlaying = false
    private frequency: number
    private count: number

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.FX_STAR_WHITE)

        this.createEmitZone()
        this.createEmitters()

        this.scene.add.existing(this)
    }

    private createEmitZone(): void {
        this.emitZone = new Phaser.Geom.Rectangle()
    }

    private createEmitters(): void {
        const scale = 1 / this.scene.world.getPixelRatio()

        this.emitter = this.createEmitter({
            frame: FRAME.DUST_YELLOW,
            tint: 0xfefb7a,
            emitZone: {
                source: this.emitZone as Phaser.Types.GameObjects.Particles.RandomZoneSource,
                type: 'random',
            },
            frequency: 16,
            speedX: { min: -25, max: -10 },
            speedY: { min: -7, max: 7 },
            lifespan: { min: 500, max: 1500 },
            alpha: { start: 0.7, end: 0.3 },
            scale: {
                min: 1 * scale,
                max: 1.5 * scale,
            },
            delay: 300,
        })
    }

    public run(
        count: number,
        frequency: number,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        console.log(`${x}-${y}-${width}-${height}`)

        this.emitZone.setSize(width, height)
        this.emitZone.setPosition(x - width / 2, y - height / 2)

        if (frequency != this.frequency) {
            this.emitter.setFrequency(frequency)
            this.frequency = frequency
        }

        if (count != this.count) {
            this.emitter.setQuantity(count)
            this.count = count
        }

        if (this._isPlaying) return
        this.emitter.start()
        this._isPlaying = true
    }

    public stop(): void {
        this.emitter?.stop()
        this._isPlaying = false
    }

    public isPlaying(): boolean {
        return this._isPlaying
    }
}

export default ProgressStarSparkle
