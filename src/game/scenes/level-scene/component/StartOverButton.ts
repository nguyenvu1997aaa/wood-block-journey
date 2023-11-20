import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class StartOverButton extends Button {
    public textStartOver: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene, KEY, FRAME.BUTTON_GREEN)

        this.button.setWorldSize(182, 55)

        this.setName('Play Level')

        this.createText()
    }

    private createText() {
        const imageScale = this.scene.world.getPixelRatio()

        this.textStartOver = this.scene.make.image({
            key: KEY,
            frame: FRAME.TEXT_START_OVER,
        })

        const { width, height } = this.textStartOver

        this.textStartOver.setWorldSize(width / imageScale, height / imageScale)

        this.add(this.textStartOver)

        Phaser.Display.Align.In.Center(this.textStartOver, this, 0, -1)
    }
}

export default StartOverButton
