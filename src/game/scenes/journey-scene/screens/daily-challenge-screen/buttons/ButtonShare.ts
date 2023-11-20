import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

export default class ButtonShare extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_DARK_BLUE_BIG)

        this.button.setWorldSize(76, 31)

        this.setName('Share')

        this.createIcon()

        this.createText()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_SHARE_BLUE,
        })

        icon.setWorldSize(12, 16)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this, -24)
    }

    private createText(): void {
        const imageScale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_SHARE_BLUE,
        })

        const { width, height } = text

        text.setWorldSize(width / imageScale, height / imageScale)

        this.add(text)

        Phaser.Display.Align.In.Center(text, this, 8)
    }
}
