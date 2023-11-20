import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    props: {
        alpha: {
            duration: 500,
            value: { start: 0, from: 0, to: 1 },
            ease: Phaser.Math.Easing.Cubic.Out,
        },
        scale: {
            duration: 1000,
            value: { start: 0.8, from: 0.8, to: 1 },
            ease: Phaser.Math.Easing.Elastic.Out,
            easeParams: [0.1, 0.45],
        },
    },
}

class ShowItemAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default ShowItemAnimation
