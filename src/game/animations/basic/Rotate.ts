import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 600,
    ease: Phaser.Math.Easing.Linear,
    props: {
        angle: { from: 0, to: 360 },
    },
}

class RotateAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default RotateAnimation
