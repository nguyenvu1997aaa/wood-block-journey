import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 200,
    repeat: 5,
    props: {
        alpha: { start: 1, to: 0.1 },
    },
}

class FlickerOutAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }
}

export default FlickerOutAnimation
