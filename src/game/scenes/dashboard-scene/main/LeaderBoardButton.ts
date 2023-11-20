import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class LeaderBoardButton extends Button {
    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_MINOR)

        this.button.setWorldSize(62, 53)

        this.setName('LeaderBoard')

        this.createIcon()
    }

    private createIcon() {
        const icon = this.scene.make.image({
            key: KEY,
            frame: FRAME.ICON_RANK,
        })

        icon.setWorldSize(30, 30)

        this.add(icon)

        Phaser.Display.Align.In.Center(icon, this, 0, -2)
    }
}

export default LeaderBoardButton
