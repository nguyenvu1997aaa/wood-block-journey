import FONTS from '../constants/resources/fonts'

export interface ITextSequencePayload {
    text: string
    font: string
    size: number
}

export default class TextSequenceAnim2 extends Phaser.GameObjects.Container {
    private textMain: Phaser.GameObjects.Text
    private payload: ITextSequencePayload
    private chars: string[]
    private listText: Phaser.GameObjects.Text[] = []
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
            .text({
                style: {
                    fontFamily: FONTS.FONT_FAMILY,
                    fontSize: `${this.scene.fontSize(size)}px`,
                },
                origin: { x: 0.5, y: 0.5 },
                text,
            })
            .setAlpha(0)

        this.textMain.setTint(0xeed3b2)

        this.add(this.textMain)
    }

    private initListText(): void {
        const { text, font, size } = this.payload

        if (!text) return

        this.chars = text.split('')

        let width = 0

        for (let i = 0; i < this.chars.length; i++) {
            const char = this.chars[i]

            const text = this.scene.make.text({
                style: {
                    fontFamily: FONTS.FONT_FAMILY,
                    fontSize: `${this.scene.fontSize(size)}px`,
                },
                origin: { x: 0.5, y: 0.5 },
                text: char,
            })

            text.setTint(0xeed3b2)

            this.listText.push(text)

            width += text.width
        }

        let pX = -width / 2

        for (let i = 0; i < this.chars.length; i++) {
            const text = this.listText[i]

            text.setX(pX)

            text.setAlpha(0)

            pX += text.width + 1
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
        // this.resetListText()

        this.textMain.setScale(0).setAlpha(0)
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
