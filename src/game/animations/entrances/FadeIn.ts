import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 600,
    ease: Phaser.Math.Easing.Cubic.Out,
    props: {
        alpha: { start: 0, from: 0, to: 1 },
    },
}

class FadeInAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default FadeInAnimation
