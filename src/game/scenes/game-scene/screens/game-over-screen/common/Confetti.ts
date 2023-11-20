import DEPTH_OBJECTS from '@/game/constants/depth'
import SPRITES from '@/game/constants/resources/sprites'
import ConfettiParticle from './ConfettiParticles'

const { KEY, FRAME } = SPRITES.EFFECTS

class Confetti {
    static particle: Phaser.GameObjects.Particles.ParticleEmitterManager
    static ribbonParticle: Phaser.GameObjects.Particles.ParticleEmitterManager

    public particle: Phaser.GameObjects.Particles.ParticleEmitterManager

    listEmitter: Phaser.GameObjects.Particles.ParticleEmitter[]

    private emitter1: Phaser.GameObjects.Particles.ParticleEmitter
    private emitter2: Phaser.GameObjects.Particles.ParticleEmitter

    private readonly gameWidth: number
    private readonly gameHeight: number
    private readonly delay: number
    private readonly scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.delay = 100

        this.init()
    }

    init() {
        const frames = [
            FRAME.FX_CONFETTI_SMALL_1,
            FRAME.FX_CONFETTI_SMALL_2,
            FRAME.FX_CONFETTI_SMALL_3,
            FRAME.FX_CONFETTI_SMALL_4,
        ]

        const marginTop = -70
        const gravityY = 600

        this.particle = this.scene.add.particles(KEY).setDepth(DEPTH_OBJECTS.ON_TOP)

        const { width, height } = this.scene.gameZone
        const zoomRatio = this.scene.world.getZoomRatio()

        this.emitter1 = this.particle.createEmitter({
            frame: frames,
            //tint: CONFETTI_COLOR,
            x: -20 - width / 2,
            y: marginTop,
            speed: { min: 250 / zoomRatio, max: 3000 / zoomRatio },
            gravityY: gravityY / zoomRatio,
            scale: {
                start: 0.55 / zoomRatio,
                end: 0.9 / zoomRatio,
                ease: Phaser.Math.Easing.Expo.Out,
            },
            angle: { min: 270, max: 360 },
            alpha: { start: 1, end: 0, ease: Phaser.Math.Easing.Expo.In },
            lifespan: { min: 2000, max: 4000 },
            maxParticles: 0,
            on: false,
            // @ts-expect-error
            particleClass: ConfettiParticle,
        })
        this.emitter2 = this.particle.createEmitter({
            frame: frames,
            //tint: CONFETTI_COLOR,
            x: width / 2 + 20,
            y: marginTop,
            speed: { min: 250 / zoomRatio, max: 3000 / zoomRatio },
            gravityY: gravityY / zoomRatio,
            scale: {
                start: 0.55 / zoomRatio,
                end: 0.9 / zoomRatio,
                ease: Phaser.Math.Easing.Expo.Out,
            },
            angle: { min: 180, max: 270 },
            alpha: { start: 1, end: 0, ease: Phaser.Math.Easing.Expo.In },
            lifespan: { min: 2000, max: 4000 },
            maxParticles: 0,
            on: false,
            // @ts-expect-error
            particleClass: ConfettiParticle,
        })

        this.listEmitter = [this.emitter1, this.emitter2]
    }

    start() {
        this.emitter1.flow(10000, 45)
        this.emitter2.flow(10000, 45)
        this.scene.time.delayedCall(500, this.stop.bind(this))
    }

    stop() {
        this.listEmitter.forEach((emitter) => {
            emitter.stop()
        })
    }

    killAll() {
        this.listEmitter.forEach((emitter) => {
            emitter.killAll()
            emitter.forEachDead((particle) => {
                particle.resetPosition()
            }, this)
        })
    }

    hide() {
        this.emitter1.setVisible(false)
        this.emitter2.setVisible(false)
    }
}

export default Confetti
