import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class ReplayButton extends Button {
    private icon: Phaser.GameObjects.Image
    private text: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_BROWN)

        this.button.setWorldSize(246, 53)

        this.setName('Replay')

        this.createIcon()

        this.createText()

        this.alignItems()
    }

    private createIcon() {
        this.icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_REPLAY,
        })

        this.icon.setWorldSize(26, 31)

        this.add(this.icon)
    }

    private createText() {
        const imageScale = this.scene.world.getPixelRatio()

        this.text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_REPLAY,
        })

        const { width, height } = this.text

        this.text.setWorldSize(width / imageScale, height / imageScale)

        this.add(this.text)
    }

    private alignItems(): void {
        const space = 5
        const totalWidth = this.icon.width / 2 + this.text.width / 2
        Phaser.Display.Align.In.Center(
            this.icon,
            this,
            -totalWidth + this.icon.width / 2 - space,
            -2
        )
        Phaser.Display.Align.In.Center(
            this.text,
            this,
            totalWidth - this.text.width / 2 + space,
            -1
        )
    }
}

export default ReplayButton
