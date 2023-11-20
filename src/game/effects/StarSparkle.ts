import SPRITES, { demoEffect } from '@/game/constants/resources/sprites'
import SparklingStar from './particle/SparklingStar'

const { KEY, FRAME: Demo } = SPRITES.EFFECTS
const FRAME = Demo as demoEffect

class StarSparkle extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitZone: Phaser.Geom.Rectangle
    public emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.FX_SPARK_YELLOW)

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
            frame: FRAME.FX_STAR_YELLOW,
            emitZone: {
                source: this.emitZone as Phaser.Types.GameObjects.Particles.RandomZoneSource,
                type: 'random',
            },
            deathZone: {
                source: this.emitZone as Phaser.Types.GameObjects.Particles.DeathZoneSource,
                type: 'onLeave',
            },
            frequency: 200,
            speedX: { min: -1, max: 1 },
            speedY: { min: -9, max: -13 },
            lifespan: { min: 1000, max: 1500 },
            scale: {
                min: 0.01,
                max: 0.015,
            },
            emitCallback: (star: SparklingStar): void => {
                star.setScale({ min: scale / 4, max: scale })
            },
            // @ts-expect-error: is valid particle class
            particleClass: SparklingStar,
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

export default StarSparkle
