import RotateAnimation from '@/game/animations/basic/Rotate'
import SPRITES from '@/game/constants/resources/sprites'
import JourneyScene from '..'

const { KEY, FRAME } = SPRITES.GAMEPLAY

export default class ProgressBar extends Phaser.GameObjects.Container {
    public scene: JourneyScene

    private leftBg: Phaser.GameObjects.Image
    private midBg: Phaser.GameObjects.Image
    private rightBg: Phaser.GameObjects.Image

    private leftProgress: Phaser.GameObjects.Image
    private midProgress: Phaser.GameObjects.Image
    private rightProgress: Phaser.GameObjects.Image

    private iconCup: Phaser.GameObjects.Image
    private glareCup: Phaser.GameObjects.Image

    private tweenRotationGlareCup: RotateAnimation

    private targetScore: number

    private listPoolMilestoneFrame: Phaser.GameObjects.Image[] = []

    public listMilestoneFrame: {
        score: number
        frame: Phaser.GameObjects.Image
    }[] = []

    private particle: Phaser.GameObjects.Particles.ParticleEmitterManager
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter
    private progressBarFull: boolean

    constructor(scene: JourneyScene, width: number, height: number) {
        super(scene)

        this.setSize(width, height)

        this.scene = scene

        this.init()
    }

    public init() {
        this.initBg()
        this.initProgressBar()
        this.createParticle()
        this.createEmitter()
        this.createGlareCup()
        this.createTweenGlare()
        this.createIconCup()
    }

    private initBg(): void {
        this.leftBg = this.scene.make.image({ key: KEY, frame: FRAME.PROGRESS_BG_LEFT })
        this.midBg = this.scene.make.image({ key: KEY, frame: FRAME.PROGRESS_BG_MID })
        this.rightBg = this.scene.make.image({ key: KEY, frame: FRAME.PROGRESS_BG_RIGHT })

        // Left bg
        const { width: lWidth, height: lHeight } = this.leftBg
        const lWidthRatio = (lWidth * this.height) / lHeight
        this.leftBg.setWorldSize(lWidthRatio, this.height)

        // Right bg
        const { width: rWidth, height: rHeight } = this.rightBg
        const rWidthRatio = (rWidth * this.height) / rHeight
        this.rightBg.setWorldSize(rWidthRatio, this.height)

        // Mid bg
        const remainWidth = this.width - (lWidthRatio + rWidthRatio)
        this.midBg.setWorldSize(remainWidth, this.height)

        //
        this.add(this.leftBg)
        this.add(this.midBg)
        this.add(this.rightBg)

        Phaser.Display.Align.In.LeftCenter(this.leftBg, this, 0, 0)
        Phaser.Display.Align.In.Center(this.midBg, this, 0, 0)
        Phaser.Display.Align.In.RightCenter(this.rightBg, this, 0, 0)
    }

    private initProgressBar(): void {
        this.leftProgress = this.scene.make.image({ key: KEY, frame: FRAME.PROGRESS_BAR_LEFT })
        this.midProgress = this.scene.make.image({ key: KEY, frame: FRAME.PROGRESS_BAR_MID })
        this.rightProgress = this.scene.make.image({ key: KEY, frame: FRAME.PROGRESS_BAR_RIGHT })

        // Left bg
        const { width: lWidth, height: lHeight } = this.leftProgress
        const lWidthRatio = (lWidth * this.height) / lHeight
        this.leftProgress.setWorldSize(lWidthRatio, this.height)

        // Right bg
        const { width: rWidth, height: rHeight } = this.rightProgress
        const rWidthRatio = (rWidth * this.height) / rHeight
        this.rightProgress.setWorldSize(rWidthRatio, this.height)

        // Mid bg
        const remainWidth = this.width - (lWidthRatio + rWidthRatio) + 2
        this.midProgress.setWorldSize(remainWidth, this.height)

        //
        this.add(this.leftProgress)
        this.add(this.midProgress)
        this.add(this.rightProgress)

        this.leftProgress.setVisible(false)
        this.rightProgress.setVisible(false)
        this.midProgress.setVisible(false)

        Phaser.Display.Align.In.LeftCenter(this.leftProgress, this, 0, 0)
        Phaser.Display.Align.In.Center(this.midProgress, this, 0, 0)
        Phaser.Display.Align.In.RightCenter(this.rightProgress, this, 0, 0)
    }

    private createIconCup(): void {
        this.iconCup = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_CUP,
        })

        this.iconCup.setWorldSize(25, 20)

        this.add(this.iconCup)

        Phaser.Display.Align.In.RightCenter(this.iconCup, this.glareCup, -9, 1)
    }

    private createGlareCup(): void {
        this.glareCup = this.scene.make.image({
            key: KEY,
            frame: FRAME.CUP_GLARE,
        })

        this.glareCup.setWorldSize(44, 44)

        this.glareCup.setVisible(false) //.setAlpha(0)

        this.add(this.glareCup)

        Phaser.Display.Align.In.RightCenter(this.glareCup, this.rightBg, 42, -3)
    }

    private createTweenGlare(): void {
        this.tweenRotationGlareCup = new RotateAnimation({
            targets: [this.glareCup],
            repeat: -1,
            duration: 6000,
        })
    }

    private createParticle(): void {
        this.particle = this.scene.add.particles(KEY)

        this.add(this.particle)

        // Phaser.Display.Align.In.Center(this.particle, this)
    }

    private createEmitter(): void {
        this.emitter = this.particle.createEmitter({
            x: 0,
            y: 0,
            scale: {
                min: 0.3,
                max: 1,
            },
            speed: { min: 10, max: 30 },
            lifespan: { min: 500, max: 1000 },
            quantity: 1,
            on: false,
            frame: FRAME.DUST,
        })

        this.emitter.setPosition(this.x + this.width / 2 + 20, -3)
    }

    private createMilestoneFrame(): Phaser.GameObjects.Image {
        const image = this.scene.make.image({ key: KEY, frame: FRAME.FLAG })

        image.setWorldSize(16, 22)

        return image
    }

    private getMilestoneFrame(): Phaser.GameObjects.Image {
        const filter = this.listPoolMilestoneFrame.filter((item) => {
            return !item.visible
        })

        if (!filter || filter.length === 0) {
            const image = this.createMilestoneFrame()

            this.listPoolMilestoneFrame.push(image)

            this.add(image)

            return image
        }

        return filter[0]
    }

    public handleSetAlphaListMilestone(score: number): void {
        this.listMilestoneFrame.forEach((item) => {
            if (item.score <= score) {
                item.frame.setAlpha(1)
            } else {
                item.frame.setAlpha(0.5)
            }
        })
    }

    public handleSetAlphaCup(score: number): void {
        if (score >= this.targetScore) {
            this.iconCup.setAlpha(1)
        } else {
            this.iconCup.setAlpha(0.5)
        }
    }

    public runEmitter(): void {
        this.emitter.start()
    }

    public stopEmitter(): void {
        this.emitter.stop()
    }

    public runAnimGlare(): void {
        this.glareCup.setVisible(true)
        this.tweenRotationGlareCup.play()
    }

    public stopAnimGlare(): void {
        this.tweenRotationGlareCup.stop()
        this.glareCup.setVisible(false)
    }

    public hideProgressBar(): void {
        this.leftProgress.setVisible(false)
        this.rightProgress.setVisible(false)
        this.midProgress.setVisible(false)
    }

    public hideMilestone(): void {
        this.listPoolMilestoneFrame.forEach((i) => {
            i.setVisible(false)
        })
    }

    public resetListMilestone(): void {
        this.listMilestoneFrame = []
    }

    public reset(): void {
        this.hideMilestone()
        this.hideProgressBar()
        this.setPercent(0)
        this.resetListMilestone()
    }

    public setTargetScore(score: number) {
        this.targetScore = score
    }

    public getTargetScore(): number {
        return this.targetScore
    }

    public setPercent(percent: number): void {
        const currentWidth = percent * this.width
        const { displayWidth: lWidth } = this.leftProgress
        const { displayWidth: mWidth } = this.midProgress
        const { displayWidth: rWidth } = this.rightProgress

        if (percent >= 1) {
            if (this.progressBarFull) return

            this.progressBarFull = true
            this.leftProgress.setVisible(true)
            this.midProgress.setVisible(true)
            this.rightProgress.setVisible(true)

            this.leftProgress.setCrop(0, 0, lWidth / this.leftProgress.scaleX, this.height * 2)
            this.midProgress.setCrop(0, 0, mWidth / this.midProgress.scaleX, this.height * 2)
            this.rightProgress.setCrop(0, 0, rWidth / this.rightProgress.scaleX, this.height * 2)

            this.runAnimGlare()
            this.runEmitter()

            return
        }

        this.stopAnimGlare()
        this.stopEmitter()

        this.progressBarFull = false

        if (currentWidth < lWidth) {
            this.leftProgress.setVisible(true)
            this.leftProgress.setCrop(
                0,
                0,
                currentWidth / this.leftProgress.scaleX,
                this.height * 2
            )

            return
        }

        if (currentWidth > lWidth + mWidth) {
            this.leftProgress.setVisible(true)
            this.midProgress.setVisible(true)
            this.midProgress.setCrop(0, 0, mWidth / this.midProgress.scaleX, this.height * 2)
            this.rightProgress.setVisible(true)
            this.rightProgress.setCrop(
                0,
                0,
                (currentWidth - (lWidth + mWidth - 2)) / this.rightProgress.scaleX,
                this.height * 2
            )

            return
        }

        this.leftProgress.setVisible(true)
        this.leftProgress.setCrop(0, 0, lWidth / this.leftProgress.scaleX, this.height * 2)
        this.midProgress.setVisible(true)
        this.midProgress.setCrop(
            0,
            0,
            (currentWidth - lWidth) / this.midProgress.scaleX,
            this.height * 2
        )
    }
}
