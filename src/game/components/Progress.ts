interface IProgressPayload {
    key: string
    frames: TObject
    width: number
}

class Progress extends Phaser.GameObjects.Container {
    private payload: IProgressPayload

    private process: number
    private minProcess: number
    private maxProcess: number

    private progressBoxLeft: Phaser.GameObjects.Image
    private progressBoxBg: Phaser.GameObjects.Image
    private progressBoxRight: Phaser.GameObjects.Image

    private progressBarLeft: Phaser.GameObjects.Image
    private progressBarBg: Phaser.GameObjects.Image
    private progressBarRight: Phaser.GameObjects.Image

    private progressAnimation: Phaser.Tweens.Tween

    constructor(scene: Phaser.Scene, payload: IProgressPayload) {
        super(scene)

        this.payload = payload

        const width = payload.width
        const height = 16
        this.setSize(width, height)

        this.process = 0
        this.minProcess = 0
        this.maxProcess = 1

        this.createProgressBox()
        this.createProgressBar()

        this.createContainer()
    }

    public setProcess(value: number, instance = false): void {
        this.process = this.getCorrectValue(value)

        if (!this.scene || instance) {
            this.updateProcess()
            return
        }

        // this.updateProcess(value);
        this.runProcessAnimation(value)
    }

    private updateProcess(): void {
        const { displayHeight } = this.progressBarBg
        const displayWidth = this.getDisplayWidthByProcess(this.process)
        this.progressBarBg.setWorldSize(displayWidth, displayHeight)

        const { x } = this.progressBarBg
        this.progressBarRight.setX(x + displayWidth)
    }

    private getCorrectValue(value: number): number {
        let correctValue = value

        if (!isFinite(correctValue)) {
            correctValue = 0
        }

        if (correctValue < this.minProcess) {
            correctValue = this.minProcess
        }

        if (correctValue > this.maxProcess) {
            correctValue = this.maxProcess
        }

        return correctValue
    }

    private getDisplayWidthByProcess(process: number): number {
        const { width: progressWidth } = this

        const padding = 17
        const displayWidth = (progressWidth - padding) * process

        return displayWidth
    }

    private runProcessAnimation(value: number): void {
        this.progressAnimation?.stop(1)

        this.progressAnimation = this.scene.add.tween({
            targets: [this.progressBarBg],
            duration: 300,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            props: {
                displayWidth: () => {
                    const process = this.getCorrectValue(value)
                    return this.getDisplayWidthByProcess(process)
                },
            },
            onStart: () => {
                const { displayHeight } = this.progressBarBg
                const displayWidth = this.getDisplayWidthByProcess(this.process)
                this.progressBarBg.setWorldSize(displayWidth, displayHeight)
            },
            onUpdate: () => {
                const { x, displayWidth } = this.progressBarBg
                this.progressBarRight.setX(x + displayWidth)
            },
            onComplete: () => {
                this.updateProcess()
            },
        })
    }

    private createProgressBox(): void {
        const { key, frames } = this.payload

        this.progressBoxLeft = this.scene.make.image({
            key,
            frame: frames.PROGRESS_BG_LEFT,
        })
        this.progressBoxLeft.setOrigin(0, 0.5)
        this.progressBoxLeft.setWorldSize(11, 16)

        this.progressBoxRight = this.scene.make.image({
            key,
            frame: frames.PROGRESS_BG_RIGHT,
        })
        this.progressBoxRight.setOrigin(0, 0.5)
        this.progressBoxRight.setWorldSize(11, 16)

        this.progressBoxBg = this.scene.make.image({
            key,
            frame: frames.PROGRESS_BG_MID,
        })
        this.progressBoxBg.setOrigin(0, 0.5)
        this.progressBoxBg.setWorldSize(11, 16)

        const { displayHeight } = this.progressBoxBg

        const { displayWidth: progressWidth } = this
        const { displayWidth: boxLeftWidth } = this.progressBoxLeft
        const { displayWidth: boxRightWidth } = this.progressBoxRight

        this.progressBoxLeft.setWorldSize(boxLeftWidth, displayHeight)
        this.progressBoxRight.setWorldSize(boxRightWidth, displayHeight)
        this.progressBoxBg.setWorldSize(
            progressWidth - (boxLeftWidth + boxRightWidth),
            displayHeight
        )

        Phaser.Display.Align.In.Center(this.progressBoxBg, this, 0, 0)
        Phaser.Display.Align.In.LeftCenter(this.progressBoxLeft, this, 0, 0)
        Phaser.Display.Align.In.RightCenter(this.progressBoxRight, this, 0, 0)
    }

    private createProgressBar(): void {
        const { key, frames } = this.payload

        this.progressBarLeft = this.scene.make.image({
            key,
            frame: frames.PROGRESS_BAR_LEFT,
            // alpha: 0.8,
        })
        this.progressBarLeft.setOrigin(0, 0.5)
        this.progressBarLeft.setWorldSize(11, 16)

        this.progressBarRight = this.scene.make.image({
            key,
            frame: frames.PROGRESS_BAR_RIGHT,
            // alpha: 0.8,
        })
        this.progressBarRight.setOrigin(0, 0.5)
        this.progressBarRight.setWorldSize(11, 16)

        this.progressBarBg = this.scene.make.image({
            key,
            frame: frames.PROGRESS_BAR_MID,
            // alpha: 0.8,
        })
        this.progressBarBg.setOrigin(0, 0.5)
        this.progressBarBg.setWorldSize(11, 16)

        const posX = 0
        const bgPosX = -5.8

        Phaser.Display.Align.In.LeftCenter(this.progressBarBg, this, bgPosX)

        Phaser.Display.Align.In.LeftCenter(this.progressBarLeft, this, posX)

        Phaser.Display.Align.In.LeftCenter(this.progressBarRight, this, posX)

        this.setProcess(0, true)
    }

    private createContainer(): void {
        // * Sort depth by index
        this.add([
            this.progressBoxBg,
            this.progressBoxLeft,
            this.progressBoxRight,
            this.progressBarBg,
            this.progressBarLeft,
            this.progressBarRight,
        ])

        this.scene.add.existing(this)
    }
}

export default Progress
