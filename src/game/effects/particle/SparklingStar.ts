class SparklingStar extends Phaser.GameObjects.Particles.Particle {
    private scale: number
    constructor(emitter: Phaser.GameObjects.Particles.ParticleEmitter) {
        super(emitter)
    }

    public update(delta: number, _step: number, _professors: unused[]): boolean {
        const result = super.update(delta, _step, _professors)
        this.updateScale()
        this.updateVelocity()
        return result
    }

    public setScale(scale: { min: number; max: number }): void {
        this.scale = Phaser.Math.FloatBetween(scale.min, scale.max)
    }

    private easeInCubic(x: number): number {
        return x * x * x
    }

    private updateScale(): void {
        const cubicLifeProgress = this.easeInCubic(1 - this.lifeT)
        this.scaleX = this.scale * Math.sin(cubicLifeProgress * Math.PI)
        this.scaleY = this.scale * Math.sin(cubicLifeProgress * Math.PI)
    }

    private updateVelocity(): void {
        this.velocityX += Phaser.Math.Between(-1, 1)
    }
}

export default SparklingStar
