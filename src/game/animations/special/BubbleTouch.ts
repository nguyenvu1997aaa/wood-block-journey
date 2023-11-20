import BaseAnimation from '../BaseAnimation'
import EaseBubbleOut from '../easing/BubbleOut'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 300,
    ease: EaseBubbleOut,
    props: {
        scale: { from: 1.2, to: 1 },
    },
}

class BubbleTouchAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default BubbleTouchAnimation
