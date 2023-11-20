import BaseAnimation from '../BaseAnimation'

const defaultConfig: ITweenBuilderConfig = {
    targets: [],
    repeat: -1,
    yoyo: true,
    duration: 33,
    ease: Phaser.Math.Easing.Sine.InOut,
    props: {
        x: 5,
    },
}

class ShakeHorizontalAnimation extends BaseAnimation {
    private posX: number

    constructor(config: ITweenBuilderConfig) {
        super(defaultConfig, config)

        if (!this.config?.props) return

        this.posX = this.config.props.x as number

        this.tween?.on(Phaser.Tweens.Events.TWEEN_REPEAT, this.handleSwitchPosition)
    }

    private handleSwitchPosition = (): void => {
        this.posX = -this.posX

        this.tween?.updateTo('x', -this.posX)
    }
}

export default ShakeHorizontalAnimation
