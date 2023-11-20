interface IAdsManagerConfig {
    enabled: boolean
    calculateSafeAreaBottom: boolean
    enableRewardVideoResetInterstitial: boolean
    interstitialAdOptions: {
        pID: string
        secondsFirstTime: number
        secondsBetweenAds: number
    }
    rewardAdOptions: {
        pID: string
        secondsFirstTime: number
        secondsBetweenAds: number
    }
    bannerAdOptions: BannerAdConfig[]
}

interface IAdsManager {
    enabled: boolean
    events: Phaser.Events.EventEmitter
    configure: (adInstance: typeof GameCore.Ads.AdInstance, config: IAdsManagerConfig) => void
    setAdInstance: (adInstance: typeof GameCore.Ads.AdInstance) => void
    preloadPreRollAdAsync(): Promise<void>
    showPreRollAdAsync(): Promise<void>
    preloadInterstitialAdAsync(): Promise<void>
    showInterstitialAdAsync(): Promise<void>
    preloadRewardedVideoAsync(): Promise<void>
    showRewardedVideoAsync(): Promise<void>
    preloadAdAsync(type: AdType): Promise<void>
    showAdAsync(type: AdType): Promise<void>
    getAdStatus(type: AdType): string | null
    canbeShowInterstitialAd(): boolean
    showBannerAdAsync(options?: GameSDK.IBannerAdSizeOption): Promise<void>
    hideBannerAdAsync(): Promise<void>
    getBannerHeight(): number
}
