import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 600,
    ease: Phaser.Math.Easing.Back.Out,
    props: {
        alpha: { from: 0, to: 1 },
        scale: { from: 3, to: 1 },
    },
}

class SlideInBackAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default SlideInBackAnimation
