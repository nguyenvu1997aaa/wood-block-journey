import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class ContinueButton extends Button {
    private icon: Phaser.GameObjects.Image
    private text: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_GREEN)

        this.button.setWorldSize(160, 54)

        this.setName('Continue')

        this.createIcon()

        this.createText()

        this.alignItem()
    }

    private createIcon() {
        this.icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_ADS,
        })

        this.icon.setWorldSize(30, 27)

        this.add(this.icon)
    }

    private createText() {
        const imageScale = this.scene.world.getPixelRatio()
        this.text = this.scene.make.image({
            key: KEY,
            frame: this.scene.lang.Texture.CONTINUE,
        })

        const { width, height } = this.text

        this.text.setWorldSize(width / imageScale, height / imageScale)

        this.add(this.text)
    }

    private alignItem(): void {
        const width = this.width
        const iWidth = this.icon.width
        const tWidth = this.text.width
        const margin = 5
        const center = width / 2
        const remainW = (width - margin - iWidth - tWidth) / 2
        const iPx = remainW + iWidth / 2
        const tPx = iPx + margin + iWidth / 2 + tWidth / 2

        Phaser.Display.Align.In.Center(this.icon, this, iPx - center, -2)

        Phaser.Display.Align.In.Center(this.text, this, tPx - center, -2)
    }
}

export default ContinueButton
