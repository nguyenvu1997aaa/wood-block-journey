import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class ButtonPlay extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_GREEN_BIG)

        this.button.setWorldSize(109, 50)

        this.setName('Start')

        this.createText()
    }

    private createText() {
        const imageScale = this.scene.world.getPixelRatio()

        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_START,
        })

        const { width, height } = text

        text.setWorldSize(width / imageScale, height / imageScale)

        this.add(text)

        Phaser.Display.Align.In.Center(text, this, 0, -2)
    }
}

export default ButtonPlay
