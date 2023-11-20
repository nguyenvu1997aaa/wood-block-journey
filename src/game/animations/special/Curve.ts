import BaseAnimation from '../BaseAnimation'

type CurveOnUpdateCallback = (target: Phaser.GameObjects.GameObject) => void

interface ICurveBuilderConfig extends ITweenBuilderConfig {
    curve?: number[][]
    onCurveUpdate?: CurveOnUpdateCallback
}

const defaultConfig: ICurveBuilderConfig = {
    targets: [],
    duration: 1000,
    ease: Phaser.Math.Easing.Quadratic.InOut,
    props: {
        scale: 0.2,
    },
}

class CurveAnimation extends BaseAnimation {
    private spline: Phaser.Curves.Spline

    constructor(config: ICurveBuilderConfig) {
        super(defaultConfig, config)

        const { curve } = this.config as ICurveBuilderConfig
        if (!curve) return

        this.spline = new Phaser.Curves.Spline(curve)
        this.tween?.on(Phaser.Tweens.Events.TWEEN_START, this.createCounter)
    }

    private createCounter = (
        tween: Phaser.Tweens.Tween,
        objects: Phaser.GameObjects.GameObject[]
    ): void => {
        const { onCurveUpdate } = this.config as ICurveBuilderConfig
        const curveUpdate = typeof onCurveUpdate === 'function' ? onCurveUpdate : null

        objects.forEach((target, index) => {
            if (!this.scene) return

            const { duration, delay } = tween.data[index]

            const position = new Phaser.Math.Vector2()
            this.scene.tweens.addCounter({
                delay,
                duration,
                ease: Phaser.Math.Easing.Quadratic.InOut,
                onUpdate: (tween) => {
                    this.spline.getPoint(tween.getValue(), position)

                    target.x = position.x
                    target.y = position.y

                    curveUpdate && curveUpdate(target)
                },
            })
        })
    }
}

export default CurveAnimation
