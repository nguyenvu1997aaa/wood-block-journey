import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class Journey1Button extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_MINOR)

        this.button.setWorldSize(62, 53)

        this.setName('JourneyIcon')

        this.createIcon()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_BROWN_JOURNEY,
        })

        icon.setWorldSize(28, 26)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this)
    }
}

export default Journey1Button
