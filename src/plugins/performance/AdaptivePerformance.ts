import FpsTracker from './common/FpsTracker'

class AdaptivePerformance extends Phaser.Plugins.BasePlugin implements IAdaptivePerformance {
    private fpsTracker: FpsTracker

    private pixelRatio: number
    private minQuality: number
    private maxQuality: number
    private qualityAdjustStep: number
    private trackingSceneKeys: string[] = []

    public configure(payload: IAdaptivePerformancePayload) {
        const {
            pixelRatio,
            minQuality,
            maxQuality,
            qualityAdjustStep,
            trackingSceneKeys,
            ...options
        } = payload

        this.pixelRatio = pixelRatio
        this.minQuality = minQuality
        this.maxQuality = maxQuality
        this.qualityAdjustStep = qualityAdjustStep
        this.trackingSceneKeys = trackingSceneKeys

        this.fpsTracker = new FpsTracker(this.game, this, options)
    }

    public active(): void {
        this.game.events.on(Phaser.Scenes.Events.WAKE, this.trackingScene)
        this.game.events.on(Phaser.Scenes.Events.START, this.trackingScene)
    }

    public trackingScene = (sceneKey: string): void => {
        if (!this.trackingSceneKeys.includes(sceneKey)) return

        const scene = this.game.scene.getScene(sceneKey)
        scene.events.once(Phaser.Scenes.Events.UPDATE, this.fpsTracker.start)
        scene.events.once(Phaser.Scenes.Events.SLEEP, this.fpsTracker.stop)
    }

    public downgradeGraphicsQuality(): boolean {
        const currentQuality = this.pixelRatio
        if (currentQuality <= this.minQuality) return false

        const lowerQuality = +(currentQuality - this.qualityAdjustStep).toFixed(2)
        if (lowerQuality < this.minQuality) return false

        this.pixelRatio = lowerQuality

        this.game.world.resize(this.pixelRatio)

        console.warn(`💫 Graphics quality was downgraded! (${currentQuality} -> ${lowerQuality})`)
        return true
    }

    public upgradeGraphicsQuality(): boolean {
        const currentQuality = this.pixelRatio
        if (currentQuality >= this.maxQuality) return false

        const higherQuality = +(currentQuality + this.qualityAdjustStep).toFixed(2)
        if (higherQuality > this.maxQuality) return false

        this.pixelRatio = higherQuality

        this.game.world.resize(this.pixelRatio)

        console.warn(`🚀 Graphics quality was upgraded! (${currentQuality} -> ${higherQuality})`)
        return true
    }
}

export default AdaptivePerformance
