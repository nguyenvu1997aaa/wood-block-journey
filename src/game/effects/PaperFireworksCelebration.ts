import SPRITES, { demoEffect } from '@/game/constants/resources/sprites'
import RibbonAAnimation from '../animations/frames/RibbonA'
import RibbonBAnimation from '../animations/frames/RibbonB'
import RibbonCAnimation from '../animations/frames/RibbonC'
import RibbonDAnimation from '../animations/frames/RibbonD'
import StarRotateXAnimation from '../animations/frames/StarRotateX'
import StarRotateYAnimation from '../animations/frames/StarRotateY'
import ANIMATIONS from '../constants/animation'
import RibbonGraphicsParticle from './particle/RibbonGraphicsParticle'
import StarConfettiParticle from './particle/StarConfettiParticle'

const { KEY, FRAME: Demo } = SPRITES.EFFECTS
const FRAME = Demo as demoEffect

class PaperFireworksCelebration extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private emitterConfetti: Phaser.GameObjects.Particles.ParticleEmitter[]
    private emitterRibbons: Phaser.GameObjects.Particles.ParticleEmitter[]

    private ribbonConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
    private confettiConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig

    public width: number
    public height: number

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BLANK)

        this.emitterRibbons = []
        this.emitterConfetti = []

        this.createConfigs()
        this.createAnimations()

        this.scene.add.existing(this)
    }

    private createConfigs(): void {
        const colors = [0x80d544, 0x2cb0e3, 0xb74dec, 0xf9e121, 0xe93e26]

        const scale = 1 / GameCore.Utils.Image.getImageScale()

        this.ribbonConfig = {
            on: false,
            visible: false,
            timeScale: 1.5,
            frame: FRAME.BLANK, // use Particle class frame
            particleBringToTop: true,
            speedY: {
                min: -480,
                max: -560,
            },
            gravityY: 290,
            // tint: colors,    // use Particle class colors
            lifespan: { min: 4000, max: 6000 },
            rotate: { start: 0, end: 360 * 5, random: true },
            scale: { min: scale * 0.6, max: scale },
            // @ts-expect-error: is valid particle class
            particleClass: RibbonGraphicsParticle,
        }

        this.confettiConfig = {
            on: false,
            delay: 200,
            timeScale: 2,
            tint: colors,
            particleBringToTop: true,
            frame: FRAME.PREFIX_ANIMATION_RIBBON_CONFETTI_A + '1',
            speedY: {
                min: -460,
                max: -580,
            },
            gravityY: 280,
            lifespan: { min: 5000, max: 8000 },
            rotate: { start: 0, end: 360 * 3 },
            scale: { min: scale * 0.6, max: scale },
            // @ts-expect-error: is valid particle class
            particleClass: StarConfettiParticle,
        }
    }

    private createAnimations() {
        if (!this.scene.anims.get(ANIMATIONS.CONFETTI_STAR_X.KEY)) {
            const anim = new StarRotateXAnimation(this.scene.anims)
            this.scene.anims.add(ANIMATIONS.CONFETTI_STAR_X.KEY, anim)
        }

        if (!this.scene.anims.get(ANIMATIONS.CONFETTI_STAR_Y.KEY)) {
            const anim = new StarRotateYAnimation(this.scene.anims)
            this.scene.anims.add(ANIMATIONS.CONFETTI_STAR_Y.KEY, anim)
        }

        if (!this.scene.anims.get(ANIMATIONS.RIBBON_A.KEY)) {
            const anim = new RibbonAAnimation(this.scene.anims)
            this.scene.anims.add(ANIMATIONS.RIBBON_A.KEY, anim)
        }
        if (!this.scene.anims.get(ANIMATIONS.RIBBON_B.KEY)) {
            const anim = new RibbonBAnimation(this.scene.anims)
            this.scene.anims.add(ANIMATIONS.RIBBON_B.KEY, anim)
        }
        if (!this.scene.anims.get(ANIMATIONS.RIBBON_C.KEY)) {
            const anim = new RibbonCAnimation(this.scene.anims)
            this.scene.anims.add(ANIMATIONS.RIBBON_C.KEY, anim)
        }
        if (!this.scene.anims.get(ANIMATIONS.RIBBON_D.KEY)) {
            const anim = new RibbonDAnimation(this.scene.anims)
            this.scene.anims.add(ANIMATIONS.RIBBON_D.KEY, anim)
        }
    }

    public run(x: number, y: number, width: number, height: number): void {
        this.setPosition(x, y)

        this.width = width
        this.height = height

        this.createEmitters()

        this.emitterConfetti.forEach((emitter) => {
            emitter.emitParticle(25)
        })

        this.emitterRibbons.forEach((emitter) => {
            emitter.emitParticle(20)
        })
    }

    public stop(): void {
        this.emitterConfetti.forEach((emitter) => {
            emitter.killAll()
        })

        this.emitterRibbons.forEach((emitter) => {
            emitter.killAll()
        })

        this.kill()
    }

    private createEmitters(): void {
        this.emitterRibbons = []
        this.emitterConfetti = []

        this.createConfettiLeftEmitter()
        this.createConfettiRightEmitter()

        this.createRibbonLeftEmitter()
        this.createRibbonRightEmitter()
    }

    private createConfettiLeftEmitter() {
        const config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
            ...this.confettiConfig,
            speedX: {
                min: 5,
                max: 90,
            },
        }

        const emitter = this.createEmitter(config)
        this.emitterConfetti.push(emitter)
    }

    private createConfettiRightEmitter() {
        const { width } = this

        const config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
            ...this.confettiConfig,
            x: width,
            speedX: {
                min: -5,
                max: -90,
            },
        }

        const emitter = this.createEmitter(config)
        this.emitterConfetti.push(emitter)
    }

    private createRibbonLeftEmitter() {
        const config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
            ...this.ribbonConfig,
            speedX: {
                min: 20,
                max: 80,
            },
            emitCallback: (ribbon: RibbonGraphicsParticle) => {
                ribbon.setRibbonPosition(0, 0)
            },
        }

        const emitter = this.createEmitter(config)
        this.emitterRibbons.push(emitter)
    }

    private createRibbonRightEmitter() {
        const { width } = this

        const config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
            ...this.ribbonConfig,
            x: width,
            speedX: {
                min: -20,
                max: -80,
            },
            emitCallback: (ribbon: RibbonGraphicsParticle) => {
                ribbon.setRibbonPosition(width, 0)
            },
        }

        const emitter = this.createEmitter(config)
        this.emitterRibbons.push(emitter)
    }
}

export default PaperFireworksCelebration
