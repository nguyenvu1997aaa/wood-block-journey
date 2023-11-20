import BaseAnimation from '../BaseAnimation'
import EaseBubbleInOut from '../easing/BubbleInOut'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    yoyo: true,
    repeat: -1,
    duration: 600,
    repeatDelay: 50,
    ease: EaseBubbleInOut,
    easeParams: [0, 0.9],
    props: {
        scale: { from: 1, to: 1.2 },
    },
}

class PulsateBubbleAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default PulsateBubbleAnimation
