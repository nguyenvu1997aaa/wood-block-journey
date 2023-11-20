import AvatarFrame from '@/game/components/AvatarFrame'
import SPRITES from '@/game/constants/resources/sprites'

const { KEY, FRAME } = SPRITES.DEFAULT

class Avatar extends AvatarFrame {
    public scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        super(scene, {
            key: KEY,
            frame: FRAME.AVATAR_BORDER_CHALLENGE,
            background: FRAME.AVATAR_BACKGROUND,
            width: 56,
            height: 56,
            borderWidth: 5,
        })

        this.scene = scene
    }
}

export default Avatar
