interface IShadowTextPayload {
    size: number
    font: string
}

// ? Use it if need a quality graphic shadow text
class ShadowText extends Phaser.GameObjects.Container {
    private payload: IShadowTextPayload

    private mainText: Phaser.GameObjects.BitmapText
    private shadowText: Phaser.GameObjects.BitmapText

    constructor(scene: Phaser.Scene, payload: IShadowTextPayload) {
        super(scene)

        this.payload = payload

        this.createMainText()
        this.createShadowText()
        this.updateSize()

        this.moveDown(this.shadowText)

        this.scene.add.existing(this)
    }

    public setText(text: string): void {
        this.mainText.setText(text)
        this.shadowText.setText(text)
        this.updateSize()
    }

    public setTintText(
        topLeft: number,
        topRight?: number,
        bottomLeft?: number,
        bottomRight?: number
    ): void {
        this.mainText.setTint(topLeft, topRight, bottomLeft, bottomRight)
    }

    public setDropShadow(x: number, y: number, color: number, alpha = 1): void {
        this.shadowText.setVisible(true)

        this.shadowText.setTint(color)
        this.shadowText.setAlpha(alpha)

        Phaser.Display.Align.In.Center(this.shadowText, this.mainText, x, y)
    }

    private updateSize(): void {
        const { width, height } = this.mainText
        this.setSize(width, height)
    }

    private createMainText(): void {
        this.mainText = this.scene.make.bitmapText({
            font: this.payload.font,
            size: this.payload.size,
            origin: { x: 0.5, y: 0.5 },
        })

        this.add(this.mainText)
    }

    private createShadowText(): void {
        this.shadowText = this.scene.make.bitmapText({
            font: this.payload.font,
            size: this.payload.size,
            origin: { x: 0.5, y: 0.5 },
            visible: false,
        })

        this.add(this.shadowText)
    }
}

export default ShadowText
