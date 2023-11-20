import SPRITES from '@/game/constants/resources/sprites'
import RotateAnimation from '../animations/basic/Rotate'

const { KEY, FRAME } = SPRITES.DEFAULT

class Loading extends Phaser.GameObjects.Image {
    private anim: RotateAnimation

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, KEY, FRAME.PRELOADER)

        this.runAnimation()

        this.setWorldSize(80, 80)

        this.scene.add.existing(this)
    }

    private runAnimation(): void {
        this.anim?.remove()

        this.anim = new RotateAnimation({
            targets: [this],
            repeat: -1,
            duration: 1200,
        })

        this.anim.play()
    }

    public setVisible(visible: boolean) {
        super.setVisible(visible)

        if (visible) {
            this.runAnimation()
        } else {
            this.anim.stop()
        }

        return this
    }
}

export default Loading
