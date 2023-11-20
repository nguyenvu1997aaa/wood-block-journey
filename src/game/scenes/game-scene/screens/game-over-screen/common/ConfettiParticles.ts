import { airResistanceForce } from '@/utils/utils'

export default class ConfettiParticle extends Phaser.GameObjects.Particles.Particle {
    windX = 1
    airFrictionX = 0.05
    airFrictionY = 0.01

    _lastRotaion = 0
    rotationRate: number = Math.random() < 0.5 ? -1 : 1
    constructor(emiter: Phaser.GameObjects.Particles.ParticleEmitter) {
        super(emiter)
        this.airFrictionX = Math.random() * 0.01 + 0.007
        this.airFrictionY = Math.random() * 0.004 + 0.006
        return this
    }

    update(delta: number, step: number, processors: any[]) {
        const result = super.update(delta, step, processors)

        const k1 = 0.01
        let currentDelta = delta
        while (currentDelta > 16.67) {
            this.velocityX -= airResistanceForce(this.velocityX, k1, this.airFrictionX) / 60 * 2
            this.velocityY -= airResistanceForce(this.velocityY, k1, this.airFrictionY) / 60 * 2
            currentDelta -= 16.67
        }
        this.velocityX -=
            (airResistanceForce(this.velocityX, k1, this.airFrictionX) * currentDelta) / 1000
        this.velocityY -=
            (airResistanceForce(this.velocityY, k1, this.airFrictionY) * currentDelta) / 1000 

        this.rotation =
            this._lastRotaion + ((this.rotationRate * Math.random() * Math.PI) / 180) * 4
        this._lastRotaion = this.rotation

        return result
    }
}
