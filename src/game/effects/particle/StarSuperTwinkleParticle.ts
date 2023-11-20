import { airResistanceForce } from '@/utils/utils'

class StarSuperTwinkleParticle extends Phaser.GameObjects.Particles.Particle {
    static bonusAirFrictionX = 0
    static bonusAirFrictionY = 0
    static bonusRotationRate = 0
    static scaleXNumber: number
    static scaleYNumber: number

    windX = 1
    airFrictionX = 0.05
    airFrictionY = 0.01
    _lastRotaion = 0
    rotationRate: number = Math.random() + StarSuperTwinkleParticle.bonusRotationRate < 0.5 ? -1 : 1
    scaleXNumber: number = this.getRandomFloat(0.1, 0.2)
    scaleYNumber: number = this.scaleXNumber
    scaleRate = -1
    maxScale: number = this.getRandomFloat(0.5, 1)
    deltaAlpha = 0

    constructor(emiter: Phaser.GameObjects.Particles.ParticleEmitter) {
        super(emiter)
        this.airFrictionX =
            Math.random() * 0.01 + (StarSuperTwinkleParticle.bonusAirFrictionX || 0.007)
        this.airFrictionY =
            Math.random() * 0.004 + (StarSuperTwinkleParticle.bonusAirFrictionY || 0.006)

        this.maxScale = Math.max(this.scaleXNumber, this.maxScale)
        this.alpha = 0

        return this
    }

    getRandomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    getRandomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    setValueAirFrictionX(airFrictionX: number) {
        StarSuperTwinkleParticle.bonusAirFrictionX = airFrictionX

        this.airFrictionX =
            Math.random() * 0.01 + (StarSuperTwinkleParticle.bonusAirFrictionX || 0.007)
    }

    setValueAirFrictionY(airFrictionY: number) {
        StarSuperTwinkleParticle.bonusAirFrictionY = airFrictionY
    }

    setValueRotationRate(rotationRate: number) {
        StarSuperTwinkleParticle.bonusRotationRate = rotationRate
    }

    reset() {
        this.scaleXNumber = this.getRandomFloat(0.3, 0.8)
        this.scaleYNumber = this.scaleXNumber
        this.scaleRate = -1
        this.alpha = 0
        this.deltaAlpha = 0
    }

    update(delta: number, step: number, processors: any[]) {
        const result = super.update(delta, step, processors)

        const k1 = 0.5
        let currentDelta = delta
        while (currentDelta > 16.67) {
            this.velocityX -= airResistanceForce(this.velocityX, k1, this.airFrictionX) / 60
            this.velocityY -= airResistanceForce(this.velocityY, k1, this.airFrictionY) / 60
            currentDelta -= 16.67
        }
        this.velocityX -=
            (airResistanceForce(this.velocityX, k1, this.airFrictionX) * currentDelta) / 1000
        this.velocityY -=
            (airResistanceForce(this.velocityY, k1, this.airFrictionY) * currentDelta) / 1000

        this._lastRotaion = this.rotation

        if (this.lifeCurrent > (this.life * 3) / 4) {
            this.scaleX = this.maxScale
            this.scaleY = this.maxScale

            this.deltaAlpha += delta / (this.life / 4)

            this.alpha = this.deltaAlpha
        } else {
            if (this.lifeCurrent > 0) {
                const maxScale = this.scaleRate > 0 ? this.maxScale : 1

                this.scaleXNumber +=
                    maxScale * this.scaleRate * ((delta / ((this.life * 3) / 4)) * 3)
                this.scaleYNumber +=
                    maxScale * this.scaleRate * ((delta / ((this.life * 3) / 4)) * 3)
                this.scaleX = this.scaleXNumber
                this.scaleY = this.scaleYNumber
                this.alpha = this.deltaAlpha

                if (this.scaleX <= 0) {
                    this.scaleRate = 1
                }

                if (this.scaleX >= this.maxScale) {
                    this.scaleRate = -1
                }
            } else {
                this.reset()
            }
        }

        return result
    }
}

StarSuperTwinkleParticle.bonusAirFrictionX = 0
StarSuperTwinkleParticle.bonusAirFrictionY = 0
StarSuperTwinkleParticle.bonusRotationRate = 0
StarSuperTwinkleParticle.scaleXNumber = Math.random()
StarSuperTwinkleParticle.scaleYNumber = Math.random()

export default StarSuperTwinkleParticle
