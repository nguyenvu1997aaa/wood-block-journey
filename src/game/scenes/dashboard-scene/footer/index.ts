import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class FooterBar extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene) {
        super(scene)

        // this.createBackground()

        this.scene.add.existing(this)
    }

    private createBackground(): void {
        this.background = this.scene.make.image({
            key: KEY,
            frame: FRAME.FOOTER,
            origin: { x: 0.5, y: 1 },
        })

        // this.background.setDepth(DEPTH_OBJECTS.BACKGROUND)

        this.background.setWorldSize(375, 85)

        this.add(this.background)
    }
}

export default FooterBar
