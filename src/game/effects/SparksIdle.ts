import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

class SparksIdle extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.FX_SPARK)

        this.scene = scene

        this.createEmitters()

        this.scene.add.existing(this)
    }

    private createEmitters(): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.emitter = this.createEmitter({
            on: false,
            frame: FRAME.FX_STAR_YELLOW,
            quantity: 2,
            timeScale: 1,
            frequency: 200,
            speed: { min: 30, max: 80 },
            scale: { start: scale * 0.7, end: 0 },
            alpha: { start: 0, end: 1, ease: Phaser.Math.Easing.Expo.Out },
            angle: { min: 0, max: 360 },
        })
    }

    public run(x: number, y: number, frequency = 100, time = 1500): void {
        this.stop()
        this.reset()

        this.setPosition(x, y)

        this.emitter.setLifespan(time)
        this.emitter.setFrequency(frequency)
        this.emitter.start()
    }

    public stop(): void {
        this.emitter?.killAll()
        this.emitter?.stop()
    }

    private reset(): void {
        this.createEmitters()
    }
}

export default SparksIdle
