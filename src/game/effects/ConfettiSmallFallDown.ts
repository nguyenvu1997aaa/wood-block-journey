import SPRITES from '@/game/constants/resources/sprites'
import { merge } from 'merge-anything'

const { KEY, FRAME } = SPRITES.EFFECTS

class ConfettiSmallFallDown extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private config: TObject
    public emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene, config?: TObject) {
        super(scene, KEY, FRAME.BLANK)

        this.config = config || {}

        this.scene.add.existing(this)
    }

    private createEmitters(): void {
        const {
            FX_CONFETTI_SMALL_1,
            FX_CONFETTI_SMALL_2,
            FX_CONFETTI_SMALL_3,
            FX_CONFETTI_SMALL_4,
        } = FRAME

        const scale = 1 / GameCore.Utils.Image.getImageScale()

        const config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
            on: false,
            particleBringToTop: true,
            frame: [
                FX_CONFETTI_SMALL_1,
                FX_CONFETTI_SMALL_2,
                FX_CONFETTI_SMALL_3,
                FX_CONFETTI_SMALL_4,
            ],
            tint: [
                0xd9082a, // #d9082a
                0x0f976c, // #0f976c
                0x52b5f1, // #52B5F1
                0xfeda64, // #feda64
            ],
            timeScale: 1,
            // This means repeat delay
            frequency: 300,
            // This means the maximum particles has created in one shot
            maxParticles: 120,

            gravityY: -10,

            speedX: {
                min: -100,
                max: 100,
            },
            speedY: {
                min: 80,
                max: 250,
            },
            alpha: { start: 1, end: 0.8 },
            rotate: { start: 0, end: 360 * 3 },
            scale: { min: scale * 0.8, max: scale * 2 },
            angle: { min: 20, max: 160 },
            lifespan: { min: 8000, max: 12000 },
        }

        const newConfig = merge(
            config,
            this.config
        ) as Phaser.Types.GameObjects.Particles.ParticleEmitterConfig

        this.emitter = this.createEmitter(newConfig)
    }

    public run(count: number, x: number, y: number): void {
        this.stop()

        this.emitter.setQuantity(count)

        this.emitter.setPosition(x, y)

        this.emitter.start()
    }

    public explode(count: number, x: number, y: number): void {
        if (!this.emitter) {
            this.createEmitters()
        }

        this.emitter.explode(count, x, y)
    }

    public stop(): void {
        this.emitter?.killAll()
        this.emitter?.stop()
        this.emitter?.remove()
        this.createEmitters()
    }
}

export default ConfettiSmallFallDown
