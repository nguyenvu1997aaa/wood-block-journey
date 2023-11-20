import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

class StarsExplosiveSmall extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.FX_COMET)

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
            frame: FRAME.FX_COMET,
            alpha: { start: 1, end: 0.8 },
            speed: { min: 40, max: 80 },
            scale: { start: scale * 0.4, end: scale * 0.7 },
            lifespan: { min: 400, max: 600 },
        })
    }

    public explode(count: number, x: number, y: number): void {
        this.revive()

        this.emitter.explode(count, x, y)
    }
}

export default StarsExplosiveSmall
