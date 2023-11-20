import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    props: {
        alpha: { start: 0, to: 1, duration: 500, ease: Phaser.Math.Easing.Cubic.Out },
        scale: {
            start: 0.8,
            to: 1,
            duration: 1000,
            ease: Phaser.Math.Easing.Elastic.Out,
            easeParams: [0.1, 0.45],
        },
        y: { start: 0, to: 0, duration: 500, ease: Phaser.Math.Easing.Back.Out },
    },
    delay: 0,
}

class ShowPopupAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default ShowPopupAnimation
