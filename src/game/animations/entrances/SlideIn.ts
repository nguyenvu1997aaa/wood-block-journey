import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 600,
    ease: Phaser.Math.Easing.Back.Out,
    props: {
        y: { from: 500, to: 0 },
    },
}

class SlideInAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default SlideInAnimation
