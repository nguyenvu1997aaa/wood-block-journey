import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

class StarsFlyUp extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitZone: Phaser.Geom.Rectangle
    private timeScaleTween: Phaser.Tweens.Tween
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
            frame: FRAME.FX_STAR_YELLOW,
            tint: [
                0xfafef8, // #FAFEF8
                0x9fc8ee, // #9FC8EE
                0xf9f7e4, // #F9F7E4
                0xdfc089, // #DFC089
            ],
            emitZone: {
                source: this.emitZone as Phaser.Types.GameObjects.Particles.RandomZoneSource,
            },
            reserve: 3,
            timeScale: 1,
            frequency: 10,
            maxParticles: 300,
            speedY: { min: -100, max: -350 },
            alpha: { start: 0.2, end: 1 },
            scale: { start: scale * 0.6, end: scale * 0.1 },
            lifespan: { min: 5000, max: 10000 },
        })
    }

    public run(count: number, x: number, y: number, width: number, height: number): void {
        this.stop()
        this.reset()

        this.emitZone.setSize(width, height)
        this.emitZone.setPosition(x - width / 2, y - height / 2)

        this.emitter.setQuantity(count)
        this.emitter.start()

        this.runTimeScaleAnimation()
    }

    public stop(): void {
        this.timeScaleTween?.stop()
        this.emitter?.killAll()
        this.emitter?.stop()
    }

    private reset(): void {
        this.createEmitters()
    }

    // Animation
    private runTimeScaleAnimation(): void {
        if (!this.timeScaleTween) {
            this.timeScaleTween = this.scene.tweens.add({
                targets: [this.emitter],
                duration: 2000,
                ease: Phaser.Math.Easing.Quartic.In,
                props: {
                    frequency: { from: 1, to: 200 },
                    timeScale: { from: 20, to: 1 },
                },
            })

            return
        }

        this.timeScaleTween.restart()
    }
}

export default StarsFlyUp
