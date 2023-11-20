import ANIMATIONS from '@/game/constants/animation'

class StarConfettiParticle extends Phaser.GameObjects.Particles.Particle {
    private scene: Phaser.Scene

    private isYoyo: boolean
    private isGravityChanged: boolean

    private lastChange: number
    private currentFrame: number

    private star: Phaser.Animations.Animation
    private starX: Phaser.Animations.Animation
    private starY: Phaser.Animations.Animation

    constructor(emitter: Phaser.GameObjects.Particles.ParticleEmitter) {
        super(emitter)

        this.isYoyo = false
        this.isGravityChanged = false

        this.lastChange = 0
        this.currentFrame = -1

        this.scene = emitter.manager.scene

        this.starX = this.scene.anims.get(ANIMATIONS.CONFETTI_STAR_X.KEY)
        this.starY = this.scene.anims.get(ANIMATIONS.CONFETTI_STAR_Y.KEY)

        this.star = this.starX
    }

    public update(delta: number, step: number, processors: unknown[]) {
        const result = super.update(delta, step, processors)

        this.updateGravity()
        this.updateVelocity()
        this.updateFrameRate()
        this.updateFrames(delta)

        return result
    }

    private updateGravity(): void {
        if (this.lifeCurrent > this.life - 2000 || this.isGravityChanged) return
        this.isGravityChanged = true

        this.emitter.setGravityY(15)
        this.emitter.setSpeedX(0)
    }

    private updateVelocity(): void {
        if (this.lifeCurrent > this.life - 2000) return

        if (this.velocityX > 0) {
            this.velocityX += Phaser.Math.Between(-6, 3)
        } else {
            this.velocityX += Phaser.Math.Between(-3, 6)
        }
    }

    private updateFrames(delta: number): void {
        this.lastChange += delta

        if (this.lastChange >= this.star.msPerFrame) {
            const rand = Phaser.Math.RND.between(0, 1)
            this.star = rand > 0 ? this.starX : this.starY

            if (this.isYoyo) {
                this.currentFrame--
            } else {
                this.currentFrame++
            }

            if (this.currentFrame < 0) {
                this.isYoyo = false
                this.currentFrame = 1
                this.emitter.setAlpha(1)
            }

            if (this.currentFrame >= this.star.frames.length) {
                this.isYoyo = true
                this.currentFrame -= 1
                this.emitter.setAlpha(0.8)
            }

            this.frame = this.star.frames[this.currentFrame].frame

            this.lastChange -= this.star.msPerFrame
        }
    }

    private updateFrameRate(): void {
        if (this.lifeCurrent < this.life - 2000) {
            this.star.msPerFrame = 150
        } else {
            this.star.msPerFrame = Phaser.Math.RND.between(300, 600)
        }
    }
}

export default StarConfettiParticle
