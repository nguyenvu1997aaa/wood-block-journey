declare interface IAnalytic {
    event(name: string, payload?: Record<string, string>, value?: any): void
    pageview(key: string): void
    levelStart(level: number, score?: number, levelName?: string): void
    levelFail(level: number, score?: number, levelName?: string): void
    levelRescue(level: number, score?: number, levelName?: string): void
    levelComplete(level: number, score?: number, levelName?: string): void
    showPreRollAd(placement?: string): void
    showInterstitialAd(placement?: string): void
    showRewardedVideoAd(placement?: string): void
    receiveReward(placement?: string): void
    showAdFail(type: AdType, placement?: string, reason?: AdErrorCode): void
}

interface IAnalyticsManager {
    analytics: IAnalytic[]
    add(analytic: IAnalytic): void
    event(name: string, payload?: Record<string, any>, value?: any): void
    pageview(key: string): void
    levelStart(level: number, score?: number, levelName?: string): void
    levelFail(level: number, score?: number, levelName?: string): void
    levelRescue(level: number, score?: number, levelName?: string): void
    levelComplete(level: number, score?: number, levelName?: string): void
    showPreRollAd(placement?: string): void
    showInterstitialAd(placement?: string): void
    showRewardedVideoAd(placement?: string): void
    receiveReward(placement?: string): void
    showAdFail(type: AdType, placement?: string, reason?: AdErrorCode): void
}
