import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class JourneyButton extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_MINOR)

        this.button.setWorldSize(64, 55)

        this.setName('Journey')

        this.createIcon()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_JOURNEY_2,
        })

        icon.setWorldSize(35, 28)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this, -0.25, -1.5)
    }
}

export default JourneyButton
