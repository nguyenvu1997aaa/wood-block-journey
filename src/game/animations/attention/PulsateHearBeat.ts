import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    yoyo: true,
    duration: 120,
    ease: Phaser.Math.Easing.Circular.Out,
    props: {
        scale: { from: 1, to: 1.3 },
    },
}

class PulsateHearBeatAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default PulsateHearBeatAnimation
