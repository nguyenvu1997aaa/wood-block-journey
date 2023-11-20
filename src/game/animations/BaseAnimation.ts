import { merge } from 'merge-anything'

abstract class BaseAnimation {
    protected scene: Phaser.Scene | null
    protected config: ITweenBuilderConfig

    private isStarted: boolean
    public tween: Phaser.Tweens.Tween | null

    constructor(config: ITweenBuilderConfig, override: ITweenBuilderConfig) {
        if (override.targets.length < 1) return

        this.buildConfig(config, override)

        const { scene } = this.config.targets[0]

        if (!scene) return

        this.scene = scene
        this.isStarted = false

        this.tween = scene.tweens.create(this.config)
    }

    protected buildConfig(config: ITweenBuilderConfig, override: ITweenBuilderConfig): void {
        this.config = merge(config, override) as ITweenBuilderConfig
    }

    public play(): void {
        if (!this.tween) return

        if (this.isStarted && this.tween.hasStarted) {
            this.restart()
            return
        }

        this.tween.play()
        this.isStarted = true
    }

    public restart(): void {
        this.tween?.restart()
    }

    public stop(): void {
        this.tween?.stop()
    }

    public remove(): void {
        this.tween?.remove()
    }

    public next(callback: Function): Phaser.Tweens.Tween | null {
        if (!this.tween) return null

        this.tween.off(Phaser.Tweens.Events.TWEEN_COMPLETE, callback)
        this.tween.once(Phaser.Tweens.Events.TWEEN_COMPLETE, callback)

        return this.tween
    }
}

export default BaseAnimation
