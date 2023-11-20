import AdaptivePerformance from '..'

class FpsTracker extends Phaser.Events.EventEmitter {
    private game: Phaser.Game
    private options: FpsTrackerOptions
    private performance: AdaptivePerformance

    private isRunning = false

    private checkTimer: number
    private fpsHistory: number[]

    constructor(game: Phaser.Game, performance: AdaptivePerformance, options: FpsTrackerOptions) {
        super()

        this.game = game
        this.options = options
        this.performance = performance
    }

    public start = (): void => {
        if (this.isRunning) return
        this.isRunning = true

        const { checkInterval } = this.options

        this.checkTimer = checkInterval
        this.fpsHistory = []

        this.game.events.on(Phaser.Core.Events.POST_STEP, this.onPostStep)
    }

    public stop = (): void => {
        if (!this.isRunning) return
        this.isRunning = false

        this.game.events.off(Phaser.Core.Events.POST_STEP, this.onPostStep)

        const { onlyUpdateWhenSwitchScene } = this.options
        onlyUpdateWhenSwitchScene && this.checkFps()
    }

    private onPostStep = (_time: number, delta: number): void => {
        this.checkTimer -= delta

        if (this.checkTimer > 0) return

        const { checkInterval, onlyUpdateWhenSwitchScene } = this.options
        this.checkTimer += checkInterval

        this.fpsHistory.push(this.game.loop.actualFps)

        if (onlyUpdateWhenSwitchScene === false) {
            this.fpsHistory.length >= 5 && this.checkFps()
        }
    }

    private checkFps(): void {
        if (this.fpsHistory.length === 0) return

        const { autoUpgradeQuality } = this.options

        let success = false
        if (this.isLowFps()) {
            success = this.performance.downgradeGraphicsQuality()
        } else if (autoUpgradeQuality && this.isHighFps()) {
            success = this.performance.upgradeGraphicsQuality()
        }

        if (success) {
            this.fpsHistory = []
        }
    }

    private getFpsMedian(): number {
        return Phaser.Math.Median(this.fpsHistory)
    }

    private isLowFps(): boolean {
        return this.getFpsMedian() < this.options.fpsThreshold
    }

    private isHighFps(): boolean {
        return this.getFpsMedian() > this.options.fpsThreshold * 1.2
    }
}

export default FpsTracker
