import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

class StarWhiteTwinkle extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitZone: Phaser.Geom.Rectangle
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.FX_STAR_YELLOW)

        this.scene = scene

        this.createEmitZone()

        this.scene.add.existing(this)
    }

    private createEmitZone(): void {
        this.emitZone = new Phaser.Geom.Rectangle()
    }

    private createEmitters(): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.emitter = this.createEmitter({
            on: false,
            frame: FRAME.FX_STAR_WHITE,
            emitZone: {
                source: this.emitZone as Phaser.Types.GameObjects.Particles.RandomZoneSource,
                type: 'random',
            },
            timeScale: 1,
            frequency: 80,
            maxParticles: 15,
            // alpha: { start: 1, end: 0, ease: Phaser.Math.Easing.Quadratic.Out },
            scale: { start: 0, end: scale * 1, ease: Phaser.Math.Easing.Bounce.Out },
            lifespan: 400,
        })
    }

    public run(count: number, x: number, y: number, width: number, height: number): void {
        this.stop()
        this.reset()

        this.emitZone.setSize(width, height)
        this.emitZone.setPosition(x - width / 2, y - height / 2)

        this.emitter.setQuantity(count)
        this.emitter.start()
    }

    public explode(count: number, x: number, y: number, width: number, height: number): void {
        this.stop()
        this.reset()

        this.emitZone.setSize(width, height)
        this.emitZone.setPosition(-width / 2, -height / 2)

        this.emitter.explode(count, x, y)
    }

    public stop(): void {
        this.emitter?.killAll()
        this.emitter?.stop()
    }

    private reset(): void {
        this.createEmitters()
    }
}

export default StarWhiteTwinkle
