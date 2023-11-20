export interface ITextSequencePayload {
    text: string
    font: string
    size: number
}

export default class TextSequence extends Phaser.GameObjects.Container {
    private textMain: Phaser.GameObjects.BitmapText
    private textAnim: Phaser.GameObjects.BitmapText
    private anim: Phaser.Tweens.Tween
    private payload: ITextSequencePayload
    private chars: string[]
    private char: string
    private listAnim: Phaser.Tweens.Tween[] = []
    private listTextScale: number[] = []
    private currentScale = 0
    private currentTextIndex = 0

    constructor(scene: Phaser.Scene, payload: ITextSequencePayload) {
        super(scene)

        this.payload = payload

        this.createTextMain()

        // this.createTextAnim()

        this.scene.add.existing(this)
    }

    private createTextMain(): void {
        const { font, size } = this.payload

        this.textMain = this.scene.make.bitmapText({
            font,
            size,
            origin: { x: 0.5, y: 0.5 },
        })

        // this.textMain.setDisplayCallback((data) => {
        //     if (
        //         this.currentTextIndex > this.payload.text.length ||
        //         data.index !== this.currentTextIndex
        //     )
        //         return data

        //     if (data.index > this.currentTextIndex) {
        //         data.scale = 0
        //     }

        //     this.currentScale += 0.01

        //     data.scale = this.currentScale

        //     if (this.currentScale > 1) {
        //         this.currentScale = 0
        //         this.currentTextIndex++
        //     }

        //     return data
        // })

        this.add(this.textMain)
    }

    private createTextAnim(): void {
        const { font, size } = this.payload

        this.textAnim = this.scene.make.bitmapText({
            font,
            size,
            origin: { x: 0.5, y: 0.5 },
        })

        this.add(this.textAnim)
    }

    private createAnim(): void {
        this.anim = this.scene.tweens.add({
            targets: [this.textAnim],
            paused: true,
            delay: 1000,
            duration: 200,
            scale: {
                from: 0,
                to: 1,
            },
            onComplete: () => {
                console.log('Complete')
                const mainText = this.textMain.text + this.char
                this.textMain.setText(mainText)

                console.log('this.textMain.displayWidth === ', this.textMain.width)

                Phaser.Display.Align.In.Center(this.textAnim, this.textMain, this.textMain.width)

                this.runAnim()
            },
        })
    }

    private runAnim(): void {
        console.log('this.char.length === ', this.chars.length)

        if (this.chars.length === 0) return

        this.char = this.chars.shift() || ''

        this.textAnim.setText(this.char).setScale(0)

        this.anim?.remove()

        this.createAnim()

        this.anim.play()
    }

    private showText(): void {
        const { text } = this.payload

        // this.textMain.setText(text)

        // return

        const chars = text.split('')

        if (chars.length === 0) return

        let str = ''
        let count = 0

        this.scene.time.addEvent({
            repeat: chars.length,
            delay: 80,
            callback: () => {
                const c = chars.shift() || ''
                str += c

                this.textMain.setText(str)

                this.listAnim[count]?.play()

                count++
            },
        })
    }

    public start(delay = 0): void {
        this.scene.time.addEvent({
            delay,
            callback: () => {
                this.showText()
            },
        })

        // const { text } = this.payload
        // this.chars = text.split('')

        // this.runAnim()

        // this.textMain.setText(text)

        // console.log('Size === ', size, this.textMain.width)
        // console.log('1111 === ', this.textMain.width / this.chars.length)

        // let width = 0

        // this.chars.forEach((text, index) => {
        //     const c = this.scene.make.bitmapText({
        //         font,
        //         size,
        //         origin: { x: 0.5, y: 0.5 },
        //         text,
        //     })
        //     console.log('Width = ', c.width)

        //     width += c.width - 2

        //     c.setX(width)
        //     c.setY(100)

        //     this.add(c)
        // })
    }
}
