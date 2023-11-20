import Button from '@/game/components/Button'
import SPRITES from '@/game/constants/resources/sprites'
import GameScene from '../../GameScene'

const { KEY } = SPRITES.DEFAULT

class SkipButton extends Button {
    public scene: GameScene

    constructor(scene: GameScene) {
        super(scene, KEY, scene.lang.Texture.NO_THANKS)

        this.scene = scene

        const imageScale = this.scene.world.getPixelRatio()

        const { width, height } = this

        this.button.setWorldSize(width / imageScale, height / imageScale)

        this.setName('NoThanks')
    }
}

export default SkipButton
