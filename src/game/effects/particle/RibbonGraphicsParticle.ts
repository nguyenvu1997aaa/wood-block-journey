import ANIMATIONS from '@/game/constants/animation'

class RibbonGraphicsParticle extends Phaser.GameObjects.Particles.Particle {
    private scene: Phaser.Scene
    private ribbon: Phaser.Animations.Animation
    private graphics: Phaser.GameObjects.Graphics
    private colorUse: number

    private lastChange: number
    private currentFrame: number

    private isYoyo: boolean
    private isGravityChanged: boolean

    private points: { x: number; y: number }[]

    constructor(emitter: Phaser.GameObjects.Particles.ParticleEmitter) {
        super(emitter)

        this.scene = emitter.manager.scene

        const { x, y } = this.emitter.manager
        this.points = new Array(10).fill(null).map(() => ({ x: this.x + x, y: this.y + y }))

        this.isYoyo = false
        this.isGravityChanged = false

        this.lastChange = 0
        this.currentFrame = -1 //? Phaser.Math.RND.between(-1, 40)

        this.createGraphics()
        this.randomRibbonUsedWhenFall()
    }

    private randomRibbonUsedWhenFall(): void {
        const choice = Phaser.Math.Between(0, 3)

        switch (choice) {
            case 0:
                this.ribbon = this.scene.anims.get(ANIMATIONS.RIBBON_A.KEY)
                break
            case 1:
                this.ribbon = this.scene.anims.get(ANIMATIONS.RIBBON_B.KEY)
                break
            case 2:
                this.ribbon = this.scene.anims.get(ANIMATIONS.RIBBON_C.KEY)
                break
            case 3:
                this.ribbon = this.scene.anims.get(ANIMATIONS.RIBBON_D.KEY)
                break
            default:
                this.ribbon = this.scene.anims.get(ANIMATIONS.RIBBON_A.KEY)
                break
        }
    }

    public setRibbonPosition(x: number, y: number): void {
        this.points.map((point) => {
            point.x = x
            point.y = y
        })
    }

    private createGraphics(): void {
        const tint = [0x80d544, 0x2cb0e3, 0xb74dec, 0xf9e121, 0xe93e26]
        this.colorUse = tint[Phaser.Math.Between(0, tint.length - 1)]

        this.graphics = this.scene.add.graphics({
            lineStyle: { width: 3, color: this.colorUse },
        })

        const { x, y, depth } = this.emitter.manager

        this.graphics.setDepth(depth)
        this.graphics.setPosition(x, y)
    }

    public update(delta: number, step: number, processors: unknown[]) {
        const result = super.update(delta, step, processors)

        this.updateFrames(delta)
        this.updatePoints()
        this.updateGraphics()
        this.updateGravity()
        this.updateVelocity()
        this.updateColor()

        return result
    }

    private updateFrames(delta: number): void {
        this.lastChange += delta

        if (this.lastChange >= this.ribbon.msPerFrame) {
            if (this.isYoyo) {
                this.currentFrame--
            } else {
                this.currentFrame++
            }

            if (this.currentFrame < 0) {
                this.isYoyo = false
                this.currentFrame = 1
            }

            if (this.currentFrame >= this.ribbon.frames.length) {
                this.isYoyo = true
                this.currentFrame -= 1
            }

            this.frame = this.ribbon.frames[this.currentFrame].frame

            this.lastChange -= this.ribbon.msPerFrame
        }
    }

    private updatePoints(): void {
        if (!this.graphics.visible) return

        this.points.shift()
        this.points.push({ x: this.x, y: this.y })
    }

    private updateGraphics(): void {
        if (!this.graphics.visible) return

        this.graphics.clear()
        this.graphics.strokePoints(this.points)
    }

    private updateGravity(): void {
        if (this.lifeCurrent > this.life - 2000 || this.isGravityChanged) return
        this.isGravityChanged = true

        this.graphics.destroy()

        this.emitter.setVisible(true)
        this.emitter.setGravityY(45)
    }

    private updateVelocity(): void {
        if (!this.graphics.visible) return

        if (this.lifeCurrent > this.life - 1800) {
            this.velocityX += Phaser.Math.Between(-12, 12)
            return
        }

        if (this.velocityX > 0) {
            this.velocityX += Phaser.Math.Between(-10, 6)
        } else {
            this.velocityX += Phaser.Math.Between(-6, 10)
        }
    }

    private updateColor(): void {
        if (this.graphics.visible) return
        this.tint = this.colorUse
    }
}

export default RibbonGraphicsParticle
