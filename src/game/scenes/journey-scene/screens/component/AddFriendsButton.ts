import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.GAMEPLAY

class AddFriendsButton extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_WOOD_SMALL)

        this.button.setWorldSize(64, 55)

        this.setName('AddFriends')

        this.createIcon()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_ADD_FRIEND,
        })

        icon.setWorldSize(31, 28)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this, 0.25, -2.5)
    }
}

export default AddFriendsButton
