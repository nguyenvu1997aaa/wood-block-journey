import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class RetryButton extends Button {
    private icon: Phaser.GameObjects.Image
    private text: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_GREEN)

        this.button.setWorldSize(178, 54)

        this.setName('Retry')

        this.createIcon()

        this.createText()

        this.alignItem()
    }

    private createIcon() {
        this.icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_RETRY,
        })

        this.icon.setWorldSize(33, 35)

        this.add(this.icon)
    }

    private createText() {
        const imageScale = this.scene.world.getPixelRatio()
        this.text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_RETRY,
        })

        const { width, height } = this.text

        this.text.setWorldSize(width / imageScale, height / imageScale)

        this.add(this.text)
    }

    private alignItem(): void {
        const width = this.width
        const iWidth = this.icon.width
        const tWidth = this.text.width
        const margin = 10
        const center = width / 2
        const remainW = (width - margin - iWidth - tWidth) / 2
        const iPx = remainW + iWidth / 2
        const tPx = iPx + margin + iWidth / 2 + tWidth / 2

        Phaser.Display.Align.In.Center(this.icon, this, iPx - center, -2)

        Phaser.Display.Align.In.Center(this.text, this, tPx - center, -2)
    }
}

export default RetryButton
