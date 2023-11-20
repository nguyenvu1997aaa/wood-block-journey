import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.EFFECTS

class StarTwinkleUp extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitZone: Phaser.Geom.Rectangle
    public emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.FX_COMET)

        this.createEmitZone()
        this.createEmitters()

        this.scene.add.existing(this)
    }

    private createEmitZone(): void {
        this.emitZone = new Phaser.Geom.Rectangle()
    }

    private createEmitters(): void {
        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.emitter = this.createEmitter({
            on: false,
            frame: FRAME.FX_COMET,
            emitZone: {
                source: this.emitZone as Phaser.Types.GameObjects.Particles.RandomZoneSource,
                type: 'random',
            },
            deathZone: {
                source: this.emitZone as Phaser.Types.GameObjects.Particles.DeathZoneSource,
                type: 'onLeave',
            },
            timeScale: 1,
            frequency: 150,
            // maxParticles: 30,
            speedY: { min: -20, max: -60 },
            alpha: { start: 1, end: 0, ease: Phaser.Math.Easing.Cubic.Out },
            scale: { start: scale * 1, end: 0, ease: Phaser.Math.Easing.Cubic.Out },
            lifespan: { min: 1500, max: 2500 },
        })
    }

    public run(count: number, x: number, y: number, width: number, height: number): void {
        this.stop()

        this.emitZone.setSize(width, height)
        this.emitZone.setPosition(x - width / 2, y - height / 2)

        this.emitter.setQuantity(count)
        this.emitter.start()
    }

    public stop(): void {
        this.emitter?.killAll()
        this.emitter?.stop()
    }
}

export default StarTwinkleUp
