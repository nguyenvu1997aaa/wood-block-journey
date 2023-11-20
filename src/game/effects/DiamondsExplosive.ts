import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class DiamondsExplosive extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.ICON_CUP)

        this.createEmitters()

        this.setActive(false)
        this.setVisible(false)

        this.scene.add.existing(this)
    }

    private createEmitters(): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.emitter = this.createEmitter({
            on: false,
            frame: FRAME.ICON_CUP,
            gravityY: 160,
            angle: { min: -180, max: 0 },
            speed: { min: 50, max: 200 },
            scale: { min: scale * 0.3, max: scale * 1 },
            alpha: { start: 1, end: 0, ease: Phaser.Math.Easing.Expo.In },

            lifespan: 1500,
        })
    }

    public explode(count: number, x: number, y: number): void {
        this.setActive(true)
        this.setVisible(true)

        this.emitter.explode(count, x, y)
    }
}

export default DiamondsExplosive
