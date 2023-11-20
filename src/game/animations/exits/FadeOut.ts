import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 600,
    ease: Phaser.Math.Easing.Quadratic.Out,
    props: {
        alpha: { start: 1, from: 1, to: 0 },
    },
}

class FadeOutAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default FadeOutAnimation
