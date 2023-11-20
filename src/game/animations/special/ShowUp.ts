import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 600,
    ease: Phaser.Math.Easing.Back.Out,
    props: {
        y: { from: 250, to: 0 },
        scale: { from: 0.9, to: 1 },
        alpha: { start: 0, from: 0, to: 1 },
    },
}

class ShowUpAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default ShowUpAnimation
