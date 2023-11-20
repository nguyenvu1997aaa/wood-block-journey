import FONTS from '@/game/constants/resources/fonts'
import Button from './Button'

interface IIconButtonPayload {
    key: string
    button: string
    icon: string
    text: string
}

class IconButtonHorizontal extends Button {
    public icon: Phaser.GameObjects.Image
    private payload: IIconButtonPayload

    private text: Phaser.GameObjects.BitmapText

    constructor(scene: Phaser.Scene, payload: IIconButtonPayload, width?: number, height?: number) {
        super(scene, payload.key, payload.button, width, height)

        this.payload = payload

        this.createIcon()
        this.createText()

        this.updateWidth()
    }

    private createIcon(): void {
        const icon = this.scene.add.image(0, 0, this.payload.key, this.payload.icon)
        icon.setWorldSize(43, 43)
        this.add(icon)
        this.icon = icon

        Phaser.Display.Align.In.LeftCenter(this.icon, this, -25)
    }

    private createText(): void {
        const { text } = this.payload
        const textBtn = this.scene.make.bitmapText({
            font: FONTS.PRIMARY.KEY,
            size: this.scene.fontSize(40),
            text,
            origin: { x: 0.5, y: 0.5 },
        })

        this.text = textBtn

        this.add(textBtn)
    }

    public setPositionIcon(x: number, y: number) {
        Phaser.Display.Align.In.LeftCenter(this.icon, this, x, y)
    }

    private updateWidth(padding = 10) {
        const iconWidth = this.icon.width
        const textWidth = this.text.width
        this.icon.setX(-textWidth / 2 - padding / 2)
        this.text.setX(iconWidth / 2 + padding / 2)
        this.button.setWorldSize(iconWidth + textWidth + padding * 5, this.button.height)
    }
}

export default IconButtonHorizontal
