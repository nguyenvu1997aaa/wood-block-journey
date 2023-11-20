import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

class SparksExplosive extends Phaser.GameObjects.Particles.ParticleEmitterManager {
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

        this.emitter = this.createEmitter({
            on: false,
            frame: FRAME.FX_SPARK,
            speed: { min: 10, max: 1200 },
            scale: { start: scale * 1.33, end: 0 },
            alpha: { start: 1, end: 0, ease: Phaser.Math.Easing.Expo.Out },
            deathZone: {
                source: this.deathZone as Phaser.Types.GameObjects.Particles.DeathZoneSource,
                type: 'onLeave',
            },
            lifespan: 3000,
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

export default SparksExplosive
