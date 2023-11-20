import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class Leaf extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, KEY, FRAME.LEAF)

        const { width } = this.scene.gameZone
        const height = (width * this.height) / this.width

        this.setWorldSize(width, height)

        this.scene.add.existing(this)
    }
}

export default Leaf
