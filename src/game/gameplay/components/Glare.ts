import RotateAnimation from '@/game/animations/basic/Rotate'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class Glare extends Phaser.GameObjects.Image {
    private anim: RotateAnimation

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, KEY, FRAME.GLARE)

        this.setWorldSize(200, 200)

        this.scene.add.existing(this)
    }

    private runAnimation(): void {
        this.anim?.remove()

        this.anim = new RotateAnimation({
            targets: [this],
            repeat: -1,
            duration: 3000,
        })

        this.anim.play()
    }

    public setVisible(visible: boolean) {
        super.setVisible(visible)

        if (visible) {
            this.runAnimation()
        } else {
            this.anim?.stop()
        }

        return this
    }
}

export default Glare
