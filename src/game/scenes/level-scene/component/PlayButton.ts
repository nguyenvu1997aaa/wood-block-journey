import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class PlayButton extends Button {
    public nextLevel: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_GREEN)

        this.button.setWorldSize(182, 55)

        this.setName('Play Level')

        this.createText()
    }

    private createText() {
        const scale = this.scene.world.getPixelRatio()

        this.nextLevel = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_NEXT_LEVEL,
        })

        this.nextLevel.setWorldSize(this.nextLevel.width / scale, this.nextLevel.height / scale)

        this.add(this.nextLevel)

        Phaser.Display.Align.In.Center(this.nextLevel, this, 0, -1)
    }
}

export default PlayButton
