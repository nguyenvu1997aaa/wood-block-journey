import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class PlayWithFriendsButton extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_BROWN)

        this.button.setWorldSize(242, 54)

        this.setName('PlayWithFriends')

        this.createIcon()

        this.createText()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_SWORD,
        })

        icon.setWorldSize(31, 25)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this, -60)
    }

    private createText() {
        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_PLAY_WITH,
        })

        text.setWorldSize(111, 16)

        this.add(text)

        Phaser.Display.Align.In.Center(text, this, 20)
    }
}

export default PlayWithFriendsButton
