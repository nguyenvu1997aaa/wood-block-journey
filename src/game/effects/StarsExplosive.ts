import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

class StarsExplosive extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.FX_STAR_YELLOW)

        this.scene = scene

        this.createEmitters()

        this.setActive(false)
        this.setVisible(false)

        this.scene.add.existing(this)
    }

    private createEmitters(): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.emitter = this.createEmitter({
            on: false,
            frame: FRAME.FX_STAR_YELLOW,
            alpha: { start: 1, end: 0.8 },
            speed: { min: 50, max: 150 },
            scale: { start: scale * 0.4, end: scale * 1 },
            lifespan: { min: 600, max: 1500 },
        })
    }

    public explode(count: number, x: number, y: number): void {
        this.setActive(true)
        this.setVisible(true)

        this.emitter.explode(count, x, y)
    }
}

export default StarsExplosive
