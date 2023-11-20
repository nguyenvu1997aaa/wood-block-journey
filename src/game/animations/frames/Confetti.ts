import ANIMATIONS from '@/game/constants/animation'

const { KEY, TEXTURE, FRAME_RATE, END, PREFIX, ZERO_PAD } = ANIMATIONS.CONFETTI_HEXAGON

class ConfettiAnimation extends Phaser.Animations.Animation {
    constructor(manager: Phaser.Animations.AnimationManager) {
        const animationConfig: Phaser.Types.Animations.Animation = {
            repeat: -1,
            frameRate: FRAME_RATE,
            frames: manager.generateFrameNames(TEXTURE, {
                prefix: PREFIX,
                end: END,
                zeroPad: ZERO_PAD,
            }),
            yoyo: true,
            showOnStart: true,
            // hideOnComplete: true,
        }

        super(manager, KEY, animationConfig)
    }
}

export default ConfettiAnimation
