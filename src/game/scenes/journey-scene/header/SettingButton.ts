import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.GAMEPLAY

class SettingButton extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_WOOD_SMALL)

        this.button.setWorldSize(55, 48)

        this.setName('Setting')

        this.createIcon()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_SETTING,
        })

        icon.setWorldSize(30, 30)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this, 1, -1.5)
    }
}

export default SettingButton
