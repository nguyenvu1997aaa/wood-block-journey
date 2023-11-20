import ANIMATIONS from '@/game/constants/animation'

class ConfettiHexagonParticle extends Phaser.GameObjects.Particles.Particle {
    private lastChange = 0
    private currentFrame = -1
    private isYoyo = false
    private confettiAnim: Phaser.Animations.Animation

    constructor(emitter: Phaser.GameObjects.Particles.ParticleEmitter) {
        super(emitter)

        this.lastChange = 0

        // TODO: use this.game
        this.confettiAnim = window.game.anims.get(ANIMATIONS.CONFETTI_HEXAGON.KEY)
    }

    public update(delta: number, step: number, processors: unknown[]) {
        const result = super.update(delta, step, processors)

        this.lastChange += delta

        if (this.lastChange >= this.confettiAnim.msPerFrame) {
            if (this.isYoyo) {
                this.currentFrame--
            } else {
                this.currentFrame++
            }

            if (this.currentFrame < 0) {
                this.isYoyo = false
                this.currentFrame = 1
            }

            if (this.currentFrame >= this.confettiAnim.frames.length) {
                this.isYoyo = true
                this.currentFrame -= 2
            }

            this.frame = this.confettiAnim.frames[this.currentFrame].frame

            this.lastChange -= this.confettiAnim.msPerFrame
        }

        return result
    }
}

export default ConfettiHexagonParticle
