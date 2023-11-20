import SPRITES from '@/game/constants/resources/sprites'
import ConfettiHexagonParticle from './particle/ConfettiHexagonParticle'

const { KEY, FRAME } = SPRITES.EFFECTS

class ConfettiHexagonFallDown extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.FX_CONFETTI_HEXAGON + '0')

        this.setActive(false)

        this.scene.add.existing(this)
    }

    private createEmitters(): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()

        const config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
            on: false,
            particleBringToTop: true,
            // @ts-expect-error: is valid particle class
            particleClass: ConfettiHexagonParticle,
            tint: [
                0xd9082a, // #d9082a
                0x0f976c, // #0f976c
                0x52b5f1, // #52B5F1
                0xfeda64, // #feda64
            ],
            timeScale: 1,
            reserve: 20,
            // This means repeat delay
            frequency: 100,
            // This means the maximum particles has created in one shot
            maxParticles: 2,

            gravityY: -5,

            speedX: {
                min: -100,
                max: 100,
            },
            speedY: {
                min: 50,
                max: 150,
            },
            alpha: { start: 1, end: 0.2 },
            rotate: { start: 0, end: 360 * 3 },
            scale: { min: scale * 1, max: scale * 0.3 },
            angle: { min: 10, max: 170 },
            lifespan: { min: 8000, max: 12000 },
        }

        this.emitter = this.createEmitter(config)
    }

    public run(count: number, x: number, y: number): void {
        this.setActive(true)

        this.stop()
        this.reset()

        this.emitter.setQuantity(count)

        this.emitter.setPosition(x, y)

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

export default ConfettiHexagonFallDown
