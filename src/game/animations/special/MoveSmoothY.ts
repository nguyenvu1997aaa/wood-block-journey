import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    duration: 300,
    ease: Phaser.Math.Easing.Quadratic.Out,
    props: {
        y: 100,
    },
}

class MoveSmoothYAnimation extends BaseAnimation {
    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)
    }

    protected buildConfig(config: ITweenBuilderConfig, override: ITweenBuilderConfig): void {
        if (override?.props) {
            const y = override.props.y
            override.props.y = (target) => target.y + y
        }

        super.buildConfig(config, override)
    }
}

export default MoveSmoothYAnimation
