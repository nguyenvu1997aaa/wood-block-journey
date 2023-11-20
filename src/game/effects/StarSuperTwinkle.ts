import SPRITES from '@/game/constants/resources/sprites'
import DEPTH_OBJECTS from '../constants/depth'
import StarSuperTwinkleParticle from './particle/StarSuperTwinkleParticle'

const { KEY, FRAME } = SPRITES.EFFECTS

class StarSuperTwinkle extends Phaser.GameObjects.Particles.ParticleEmitterManager {
    private position1 = {
        x: -70,
        y: -180,
    }
    private emitterStar1: Phaser.GameObjects.Particles.ParticleEmitter
    private circleImage1: Phaser.GameObjects.Image
    private tweenShowCircle1: Phaser.Tweens.Tween
    private tweenHideCircle1: Phaser.Tweens.Tween

    private position2 = {
        x: -20,
        y: 190,
    }
    private emitterStar2: Phaser.GameObjects.Particles.ParticleEmitter
    private circleImage2: Phaser.GameObjects.Image
    private tweenShowCircle2: Phaser.Tweens.Tween
    private tweenHideCircle2: Phaser.Tweens.Tween

    private position3 = {
        x: 90,
        y: 0,
    }
    private emitterStar3: Phaser.GameObjects.Particles.ParticleEmitter
    private circleImage3: Phaser.GameObjects.Image
    private tweenShowCircle3: Phaser.Tweens.Tween
    private tweenHideCircle3: Phaser.Tweens.Tween

    constructor(scene: Phaser.Scene) {
        super(scene, KEY)

        this.setDepth(DEPTH_OBJECTS.ON_TOP + 1)

        this.createEmitterStars()

        this.createTweenCircle()

        this.scene.add.existing(this)
    }

    private createEmitterStars(): void {
        const frames = [FRAME.GLARE_CROSS, FRAME.DUST]
        const colors = [0xfdd967, 0x50b7f1, 0xf25157]

        this.emitterStar1 = this.createEmitter({
            name: 'Emitter1',
            frame: frames,
            tint: colors,
            x: this.position1.x,
            y: this.position1.y,
            speed: { min: 50, max: 200 },
            gravityY: 40,
            lifespan: { min: 1000, max: 4000 },
            maxParticles: 0,
            on: false,
            alpha: 0,
            //@ts-expect-error
            particleClass: StarSuperTwinkleParticle,
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(
                    0,
                    0,
                    1
                ) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
            },
        })

        this.emitterStar2 = this.createEmitter({
            name: 'Emitter1',
            frame: frames,
            tint: colors,
            x: this.position2.x,
            y: this.position2.y,
            speed: { min: 100, max: 200 },
            gravityY: 40,
            lifespan: { min: 1000, max: 4000 },
            maxParticles: 0,
            on: false,
            alpha: 0,
            // @ts-expect-error
            particleClass: StarSuperTwinkleParticle,
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(
                    0,
                    0,
                    1
                ) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
            },
        })

        this.emitterStar3 = this.createEmitter({
            name: 'Emitter1',
            frame: frames,
            tint: colors,
            x: this.position3.x,
            y: this.position3.y,
            speed: { min: 100, max: 200 },
            gravityY: 40,
            lifespan: { min: 1000, max: 4000 },
            maxParticles: 0,
            on: false,
            alpha: 0,
            // @ts-expect-error
            particleClass: StarSuperTwinkleParticle,
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(
                    0,
                    0,
                    1
                ) as Phaser.Types.GameObjects.Particles.RandomZoneSource,
            },
        })
    }

    private createTweenCircle(): void {
        this.circleImage1 = this.scene.make
            .image({
                x: this.position1.x,
                y: this.position1.y,
                key: KEY,
                frame: FRAME.GLOW_CIRCLE,
            })
            .setAlpha(0)
            .setVisible(false)
            .setScale(0)

        this.tweenShowCircle1 = this.scene.add.tween({
            paused: true,
            targets: this.circleImage1,
            scale: {
                from: 0,
                to: 1,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: 'Sine.easeInOut',
            duration: 1000,
            onComplete: () => {
                this.tweenHideCircle1.play()
            },
        })
        this.tweenHideCircle1 = this.scene.add.tween({
            paused: true,
            targets: this.circleImage1,
            alpha: {
                from: 1,
                to: 0,
            },
            ease: 'Sine.easeInOut',
            duration: 1000,
            onComplete: () => {
                this.circleImage1.setVisible(false)
                this.emitterStar1.stop()
            },
        })

        this.circleImage2 = this.scene.make
            .image({
                x: this.position2.x,
                y: this.position2.y,
                key: KEY,
                frame: FRAME.GLOW_CIRCLE,
            })
            .setAlpha(0)
            .setVisible(false)
            .setScale(0)

        this.tweenShowCircle2 = this.scene.add.tween({
            paused: true,
            targets: this.circleImage2,
            scale: {
                from: 0,
                to: 1,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: 'Sine.easeInOut',
            duration: 1000,
            onComplete: () => {
                this.tweenHideCircle2.play()
            },
        })
        this.tweenHideCircle2 = this.scene.add.tween({
            paused: true,
            targets: this.circleImage2,
            alpha: {
                from: 1,
                to: 0,
            },
            ease: 'Sine.easeInOut',
            duration: 1000,
            onComplete: () => {
                this.circleImage2.setVisible(false)
                this.emitterStar2.stop()
            },
        })

        this.circleImage3 = this.scene.make
            .image({
                x: this.position3.x,
                y: this.position3.y,
                key: KEY,
                frame: FRAME.GLOW_CIRCLE,
            })
            .setAlpha(0)
            .setVisible(false)
            .setScale(0)

        this.tweenShowCircle3 = this.scene.add.tween({
            paused: true,
            targets: this.circleImage3,
            scale: {
                from: 0,
                to: 1,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: 'Sine.easeInOut',
            duration: 1000,
            onComplete: () => {
                this.tweenHideCircle3.play()
            },
        })
        this.tweenHideCircle3 = this.scene.add.tween({
            paused: true,
            targets: this.circleImage3,
            alpha: {
                from: 1,
                to: 0,
            },
            ease: 'Sine.easeInOut',
            duration: 1000,
            onComplete: () => {
                this.circleImage3.setVisible(false)
                this.emitterStar3.stop()
            },
        })

        // this.add([this.circleImage1, this.circleImage2, this.circleImage3])
    }

    public getImages(): Phaser.GameObjects.Image[] {
        return [this.circleImage1, this.circleImage2, this.circleImage3]
    }

    public playConfettiAnimation(): void {
        this.scene.time.addEvent({
            delay: 300,
            callback: () => {
                this.emitterStar1.flow(10000, 30)

                this.circleImage1.setVisible(true)

                this.tweenShowCircle1.play()
            },
            callbackScope: this,
        })

        this.scene.time.addEvent({
            delay: 800,
            callback: () => {
                this.emitterStar2.flow(10000, 25)

                this.circleImage2.setVisible(true)

                this.tweenShowCircle2.play()
            },
            callbackScope: this,
        })

        this.scene.time.addEvent({
            delay: 1300,
            callback: () => {
                this.emitterStar3.flow(10000, 30)

                this.circleImage3.setVisible(true)

                this.tweenShowCircle3.play()
            },
            callbackScope: this,
        })
    }
}

export default StarSuperTwinkle
