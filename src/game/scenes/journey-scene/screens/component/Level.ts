import FONTS from '@/game/constants/resources/fonts'
import SPRITES from '@/game/constants/resources/sprites'
import { ILevel } from '../../constant/types'

const { KEY, FRAME } = SPRITES.DEFAULT

class Level extends Phaser.GameObjects.Container {
    private image: Phaser.GameObjects.Image
    private text: Phaser.GameObjects.BitmapText

    constructor(scene: Phaser.Scene, payload?: ILevel) {
        super(scene)

        this.createImage()

        this.createText()

        if (payload) {
            this.updateInfo(payload)
        }
    }

    private createImage(): void {
        this.image = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_HOME,
        })

        this.image.setWorldSize(50, 50)

        this.add(this.image)

        Phaser.Display.Align.In.Center(this.image, this)
    }

    private createText(): void {
        this.text = this.scene.make.bitmapText({
            font: FONTS.NUMBER_LIGHT.KEY,
            size: this.scene.fontSize(80),
            origin: { x: 0.5, y: 0.5 },
            text: '0',
        })

        this.add(this.text)

        Phaser.Display.Align.In.Center(this.text, this)
    }

    private setImage(frame: string): void {
        this.image.setFrame(frame)
    }

    private setText(text: string): void {
        this.text.setText(text)
    }

    public updateInfo(payload: ILevel): void {
        const { level, passed } = payload
        const frame = passed ? FRAME.ICON_BROWN_JOURNEY : FRAME.ICON_ADS

        this.setText(String(level))
        this.setImage(String(frame))

        this.setPosition(100, 200)
    }
}

export default Level
