import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class InviteFriendButton extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_DARK_BLUE)

        this.button.setWorldSize(231, 63)

        this.setName('Invite')

        this.createText()
    }

    private createText() {
        const text = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_INVITE_FRIENDS,
        })

        text.setWorldSize(173, 18)

        this.add(text)

        Phaser.Display.Align.In.Center(text, this, 0, 0)
    }
}

export default InviteFriendButton
