import BaseAnalytics from './template/Analytics'

GameCore.Analytics = {
    // ? How declaration abstract as classes of variable
    // @ts-expect-error researching
    BaseAnalytics,
}

class AnalyticsManager extends Phaser.Plugins.BasePlugin {
    public analytics: IAnalytic[]

    public init(): void {
        this.analytics = []
    }

    public add(analytic: IAnalytic): void {
        this.analytics.push(analytic)
    }

    public pageview = (key: string): void => {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.pageview(key)
        })
    }

    public event(name: string, payload?: Record<string, string>, value?: unknown): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.event(name, payload, value)
        })
    }

    public levelStart(level: number, score?: number, levelName?: string): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.levelStart(level, score, levelName)
        })
    }

    public levelRescue(level: number, score?: number, levelName?: string): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.levelRescue(level, score, levelName)
        })
    }

    public levelFail(level: number, score?: number, levelName?: string): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.levelFail(level, score, levelName)
        })
    }

    public levelComplete(level: number, score?: number, levelName?: string): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.levelComplete(level, score, levelName)
        })
    }

    public showPreRollAd(placement?: string): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.showPreRollAd(placement)
        })
    }

    public showInterstitialAd(placement?: string): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.showInterstitialAd(placement)
        })
    }

    public showRewardedVideoAd(placement?: string): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.showRewardedVideoAd(placement)
        })
    }

    public receiveReward(placement?: string): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.receiveReward(placement)
        })
    }

    public showAdFail(type: GameCore.Ads.Types, placement?: string, reason?: number): void {
        if (!this.isActive()) return

        this.analytics.forEach((analytic) => {
            analytic.showAdFail(type, placement, reason)
        })
    }

    private isActive(): boolean {
        return this.analytics.length >= 1
    }
}

export default AnalyticsManager
