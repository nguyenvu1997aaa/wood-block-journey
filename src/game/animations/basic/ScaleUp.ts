import BaseAnimation from '../BaseAnimation'
import EaseBubbleOut from '../easing/BubbleOut'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 400,
    ease: EaseBubbleOut,
    props: {
        scale: '+=0.1',
    },
}

class ScaleUpAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default ScaleUpAnimation
