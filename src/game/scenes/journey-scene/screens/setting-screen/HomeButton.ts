import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class HomeButton extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_MINOR)

        this.button.setWorldSize(64, 55)

        this.setName('Home')

        this.createIcon()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_HOME,
        })

        icon.setWorldSize(31, 28)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this, 0, -2)
    }
}

export default HomeButton
