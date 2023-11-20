import SPRITES, { demoEffect } from '@/game/constants/resources/sprites'

const { KEY, FRAME: Demo } = SPRITES.EFFECTS
const FRAME = Demo as demoEffect

class PaperFireworkExplosive extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private deathZone: Phaser.Geom.Circle
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.FX_SPARK)

        this.createDeathZone()

        this.createEmitters()

        this.setActive(false)
        this.setVisible(false)

        this.scene.add.existing(this)
    }

    private createDeathZone(): void {
        this.deathZone = new Phaser.Geom.Circle()
    }

    private createEmitters(): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()
        const colors = [0x80d544, 0x2cb0e3, 0xb74dec, 0xf9e121, 0xe93e26]

        this.emitter = this.createEmitter({
            on: false,
            frame: FRAME.ANIMATION_STAR_X + '1',
            speed: { min: 85, max: 150 },
            alpha: { start: 1, end: 0 },
            tint: colors,
            scale: scale / 2,
            deathZone: {
                source: this.deathZone as Phaser.Types.GameObjects.Particles.DeathZoneSource,
                type: 'onLeave',
            },
            lifespan: 1000,
        })
    }

    public explode(count: number, x: number, y: number, radius: number): void {
        this.setActive(true)
        this.setVisible(true)

        this.deathZone.radius = radius
        this.deathZone.setPosition(x, y)

        this.emitter.explode(count, x, y)
    }
}

export default PaperFireworkExplosive
