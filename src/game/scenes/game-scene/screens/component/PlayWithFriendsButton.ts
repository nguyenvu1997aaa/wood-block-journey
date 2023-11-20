import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class PlayWithFriendsButton extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_DARK_BLUE_BIG)

        this.button.setWorldSize(120, 55)

        this.setName('PlayWithFriends')

        this.createIcon()

        this.createText()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_SWORD_BLUE,
        })

        icon.setWorldSize(22, 20)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this, -40)
    }

    private createText() {
        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_PLAY_WITH_BLUE,
        })

        text.setWorldSize(159.5, 15.5)

        this.add(text)

        Phaser.Display.Align.In.Center(text, this, 12)
    }
}

export default PlayWithFriendsButton
