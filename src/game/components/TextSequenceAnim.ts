export interface ITextSequencePayload {
    text: string
    font: string
    size: number
}

export default class TextSequenceAnim extends Phaser.GameObjects.Container {
    private textMain: Phaser.GameObjects.BitmapText
    private payload: ITextSequencePayload
    private chars: string[]
    private listText: Phaser.GameObjects.BitmapText[] = []
    private tweenText: Phaser.Tweens.Tween

    constructor(scene: Phaser.Scene, payload: ITextSequencePayload) {
        super(scene)

        this.payload = payload

        this.createTextMain()

        this.initListText()

        this.scene.add.existing(this)
    }

    private createTextMain(): void {
        const { font, size, text } = this.payload

        this.textMain = this.scene.make
            .bitmapText({
                font,
                size,
                origin: { x: 0.5, y: 0.5 },
                text,
            })
            .setVisible(false)

        this.add(this.textMain)
    }

    private initListText(): void {
        const { text, font, size } = this.payload

        if (!text) return

        this.chars = text.split('')

        const textLength = text.length
        const maxLength = 15
        let offsetSize = 0

        if (textLength > maxLength) offsetSize = textLength - maxLength

        let width = 0

        for (let i = 0; i < this.chars.length; i++) {
            const char = this.chars[i]
            const text = this.scene.make.bitmapText({
                font,
                size: size - offsetSize,
                origin: { x: 0.5, y: 0.5 },
                text: char,
            })

            this.listText.push(text)

            width += text.width
        }

        let pX = -width / 2

        for (let i = 0; i < this.chars.length; i++) {
            const text = this.listText[i]
            const rateX = text.width / 2

            text.setX(pX + rateX)

            text.setAlpha(0)

            pX += text.width
        }

        this.add(this.listText)
    }

    private createAnim(): void {
        if (this.tweenText) return

        const { text } = this.payload
        const maxTime = 1700

        this.tweenText = this.scene.tweens.add({
            targets: this.listText,
            paused: true,
            duration: 150,
            scale: {
                from: 0,
                to: 1,
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: 'Back.easeOut',
            delay: this.scene.tweens.stagger(maxTime / text.length, {}),
        })
    }

    private runAnim(): void {
        this.resetListText()

        this.tweenText.play()
    }

    private resetListText(): void {
        for (let i = 0; i < this.listText.length; i++) {
            this.listText[i].setScale(0).setAlpha(0)
        }
    }

    public restart(): void {
        this.resetListText()
    }

    public start(delay = 0): void {
        this.createAnim()

        if (!delay) {
            this.runAnim()
            return
        }

        this.scene.time.addEvent({
            delay,
            callback: () => {
                this.runAnim()
            },
        })
    }
}
